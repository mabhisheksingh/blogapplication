package com.blog.auth.service.impl;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.exception.DuplicateUserException;
import com.blog.auth.exception.KeyCloakException;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.service.KeycloakClientIDP;
import com.blog.sharedkernel.config.IDPConfigProperties;
import jakarta.annotation.PostConstruct;
import jakarta.ws.rs.core.Response;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KeycloakClientImpl implements KeycloakClientIDP {

  private UserMapper userMapper;
  private IDPConfigProperties idpConfigProperties;

  @Autowired
  public KeycloakClientImpl(UserMapper userMapper, IDPConfigProperties idpConfigProperties) {
    this.idpConfigProperties = idpConfigProperties;
    this.userMapper = userMapper;
  }

  @Override
  public String getIDPName() {
    return idpConfigProperties.getIdpName();
  }

  private static Keycloak keycloak;

  @PostConstruct
  public void init() {
    log.info("KeycloakClientImpl initialized");
    log.info("Realm : {}", idpConfigProperties.getRealm());
    log.info("SERVER_URI : {}", idpConfigProperties.getServerUri());
    log.info("CLIENT_ID : {}", idpConfigProperties.getClientId());
    keycloak =
        KeycloakBuilder.builder()
            .serverUrl(idpConfigProperties.getServerUri())
            .realm(idpConfigProperties.getRealm())
            .clientId(idpConfigProperties.getClientId())
            .clientSecret(idpConfigProperties.getClientSecret())
            .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
            .build();
  }

  @Override
  public CreateUserResponse createUser(CreateUserRequest createUserRequest) {
    log.info("KeycloakClientImpl createUser called");
    try {
      UserRepresentation userRepresentation =
          getUserRepresentation(createUserRequest, false, true, true);
      Response response =
          keycloak.realm(idpConfigProperties.getRealm()).users().create(userRepresentation);
      if (response.getStatus() != 201) {
        if (response.getStatus() == HttpStatus.CONFLICT.value()) {
          log.error("User already exists");
          throw new DuplicateUserException(userRepresentation.getUsername());
        } else if (response.getStatus() == HttpStatus.FORBIDDEN.value()) {
          log.error("Failed to create user in keycloak {}", response.readEntity(String.class));
          throw new KeyCloakException(
              "KEYCLOAK_CREATE_ERROR",
              "Create user failed",
              createUserRequest.getUsername(),
              HttpStatus.FORBIDDEN);
        } else {
          log.error("Failed to create user in status: {}", response.getStatus());
          log.error("Failed to create user in entity: {}", response.readEntity(String.class));
          throw new RuntimeException("Failed to create user");
        }
      }

      String userId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");
      log.info("User created with ID: {}", userId);
      CreateUserResponse createUserResponse = userMapper.toCreateUserResponse(createUserRequest);
      createUserResponse.setKeycloakId(userId);
      response.close();
      return createUserResponse;
    } catch (Exception e) {
      log.error("Exception while creating user: {}", e.getMessage());
      throw e;
    } finally {
      log.info("KeycloakClientImpl createUser transaction completed");
    }
  }

  private UserRepresentation getUserRepresentation(
      CreateUserRequest createUserRequest,
      Boolean isTemporaryPassword,
      Boolean isEnabled,
      Boolean isEmailVerified) {
    UserRepresentation userRepresentation = new UserRepresentation();
    userRepresentation.setUsername(createUserRequest.getUsername());
    userRepresentation.setEmail(createUserRequest.getEmail());
    userRepresentation.setFirstName(createUserRequest.getFirstName());
    userRepresentation.setLastName(createUserRequest.getLastName());
    userRepresentation.setEnabled(isEnabled);
    userRepresentation.setEmailVerified(isEmailVerified);

    userRepresentation.setCredentials(
        List.of(getCredentialRepresentation(createUserRequest.getPassword(), isTemporaryPassword)));

    CredentialRepresentation credentialRepresentation =
        getCredentialRepresentation(createUserRequest.getPassword(), isTemporaryPassword);
    userRepresentation.setCredentials(List.of(credentialRepresentation));
    return userRepresentation;
  }

  private CredentialRepresentation getCredentialRepresentation(
      String password, Boolean isTemporaryPassword) {
    CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
    credentialRepresentation.setType(CredentialRepresentation.PASSWORD);
    credentialRepresentation.setTemporary(isTemporaryPassword);
    credentialRepresentation.setValue(password);
    return credentialRepresentation;
  }

  @Override
  public CreateUserResponse updateUser(UpdateUserRequest updateUserRequest) {
    return null;
  }

  @Override
  public void changeUserPassword(String userId, String newPassword) {}

  @Override
  public boolean isUserExist(String userId) {
    return false;
  }

  @Override
  public boolean isUserActive(String userId) {
    return false;
  }

  @Override
  public boolean deleteUser(String userName) {
    String id = getIdFromUserName(userName);
    if (id == null) {
      throw new KeyCloakException(
          "KEYCLOAK_USER_NOT_FOUND_ERROR", "Search user failed", userName, HttpStatus.NOT_FOUND);
    }
    Response response = keycloak.realm(idpConfigProperties.getRealm()).users().delete(id);
    if (response.getStatus() != 204) {
      throw new KeyCloakException(
          "KEYCLOAK_DELETE_ERROR",
          "Delete user failed",
          userName,
          HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return true;
  }

  @Override
  public Keycloak getKeycloakClientInstance() {
    if (keycloak == null) {
      init();
    }
    return keycloak;
  }

  @Override
  public String getIdFromUserName(String userName) {
    return keycloak
        .realm(idpConfigProperties.getRealm())
        .users()
        .search(userName, true)
        .get(0)
        .getId();
  }
}
