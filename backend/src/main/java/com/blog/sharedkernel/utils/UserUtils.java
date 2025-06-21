package com.blog.sharedkernel.utils;

import java.util.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

@Slf4j
public final class UserUtils {
  private UserUtils() {}

  public static Optional<String> getLoggedInUserId() {
    log.info("getLoggedInUserId");
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    log.info("getLoggedInUserId authentication: {}", authentication);
    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();
      return Optional.of(jwt.getSubject()); // typically "username" or userId
    }
    return Objects.isNull(authentication)
        ? Optional.empty()
        : Optional.of(authentication.getName());
  }

  // ✅ Get Username (preferred_username claim)
  public static Optional<String> getLoggedInUsername() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();
      return Optional.ofNullable(jwt.getClaimAsString("preferred_username"));
    }
    return authentication == null ? Optional.empty() : Optional.of(authentication.getName());
  }

  // ✅ Get Full Name (preferred_username claim)
  public static Optional<String> getLoggedInFullName() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();
      return Optional.of(
          jwt.getClaimAsString("family_name") + " " + jwt.getClaimAsString("given_name"));
    }
    return authentication == null ? Optional.empty() : Optional.of(authentication.getName());
  }

  // ✅ Get email (preferred_username claim)
  public static Optional<String> getLoggedInEmail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();
      return Optional.of(jwt.getClaimAsString("email"));
    }
    return authentication == null ? Optional.empty() : Optional.of(authentication.getName());
  }

  // ✅ Get realm roles (realm_access claim)
  public static void printLoggedInRealmRoles() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    List<String> rolesOfUser = new ArrayList<>();
    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();

      // Extract and print realm_access.roles
      Object realmAccessObj = jwt.getClaim("realm_access");
      if (realmAccessObj instanceof Map<?, ?> realmAccess) {
        Object rolesObj = realmAccess.get("roles");

        if (rolesObj instanceof List<?> roles) {
          System.out.println("Roles from JWT realm_access:");

          roles.forEach(role -> System.out.println(" - ROLE_" + role));
          roles.forEach(role -> System.out.println("WITHOUT ROLE_ ::: " + role));
        } else {
          System.out.println("No roles found under realm_access");
        }
      } else {
        System.out.println("realm_access claim not found");
      }
    }
  }
}
