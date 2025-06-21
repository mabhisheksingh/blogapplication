package com.blog.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

@Slf4j
public class AuthFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    log.info("AuthFilter called");

    response.addHeader("Access-Control-Allow-Origin", "*");

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    log.info("Authentication: {}", authentication);
    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();

      // Extract and print realm_access.roles
      Object realmAccessObj = jwt.getClaim("realm_access");
      if (realmAccessObj instanceof Map<?, ?> realmAccess) {
        Object rolesObj = realmAccess.get("roles");
        if (rolesObj instanceof List<?> roles) {
          System.out.println("Roles from JWT realm_access:");
          roles.forEach(role -> System.out.println(" - " + role));
        } else {
          System.out.println("No roles found under realm_access");
        }
      } else {
        System.out.println("realm_access claim not found");
      }

      // Also log granted authorities (Spring roles)
      System.out.println("Authorities from Authentication:");
      authentication
          .getAuthorities()
          .forEach(auth -> System.out.println(" - " + auth.getAuthority()));
    } else {
      System.out.println("No JwtAuthenticationToken found");
    }

    filterChain.doFilter(request, response);
  }
}
