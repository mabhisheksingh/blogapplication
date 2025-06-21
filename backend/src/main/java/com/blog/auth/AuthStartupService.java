package com.blog.auth;

import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.service.IDPClient;
import com.blog.auth.service.UserService;

import java.util.List;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class AuthStartupService {

  private final UserService userService;

  private final IDPClient idpClient;

  public AuthStartupService(UserService userService,@Qualifier("KeycloakClient") IDPClient idpClient) {
    this.idpClient = idpClient;
    this.userService = userService;
  }

  private List<CreateUserResponse> getUserFromIDPKeycloak() {
    log.info("getUserFromIDPKeycloak called");
    List<CreateUserResponse> list = idpClient.getAllUsers();
    log.info("getUserFromIDPKeycloak response: {}", list);
    return list;
  }

  @Bean
  public ApplicationRunner initAuth() {
    return args -> {
      log.info("initData called for auth");
      // Check if data already exists to avoid duplicate inserts
      if (!getUserFromIDPKeycloak().isEmpty()) {
        log.info("Now saving users from IDP Keycloak to user DB...");
        userService.saveUsersFromIDP(getUserFromIDPKeycloak());
      }
    };
  }
}
