package com.blog.auth.service;

import org.keycloak.admin.client.Keycloak;

public interface KeycloakClientIDP extends IDPClient {

  Keycloak getKeycloakClientInstance();

  void rollbackKeycloakUser(String username);
}
