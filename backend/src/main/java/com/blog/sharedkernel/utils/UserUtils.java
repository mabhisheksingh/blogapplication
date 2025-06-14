package com.blog.sharedkernel.utils;

import java.util.Objects;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class UserUtils {

  Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

  public UserUtils() {}

  public Optional<String> getLoggedInUserId() {
    log.info("getLoggedInUserId");
    log.info("getLoggedInUserId authentication: {}", authentication);
    if (authentication instanceof JwtAuthenticationToken jwtAuth) {
      Jwt jwt = jwtAuth.getToken();
      return Optional.of(jwt.getSubject()); // typically "username" or userId
    }
    return Objects.isNull(authentication)
        ? Optional.empty()
        : Optional.of(authentication.getName());
  }
}
