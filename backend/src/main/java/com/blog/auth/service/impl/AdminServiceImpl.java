package com.blog.auth.service.impl;

import com.blog.auth.constant.APIConstant;
import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.model.User;
import com.blog.auth.repository.AdminRepository;
import com.blog.auth.repository.UserRepository;
import com.blog.auth.service.AdminService;
import com.blog.sharedkernel.dto.PagingResult;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import com.blog.sharedkernel.exception.OperationNotPermit;
import com.blog.sharedkernel.exception.UserNotFoundException;
import com.blog.sharedkernel.utils.UserUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class AdminServiceImpl implements AdminService {
  UserRepository userRepository;
  AdminRepository adminRepository;
  KeycloakClientImpl keycloakClient;
  UserMapper userMapper;

  @Autowired
  public AdminServiceImpl(
      AdminRepository adminRepository,
      UserRepository userRepository,
      KeycloakClientImpl keycloakClient,
      UserMapper userMapper) {
    this.userMapper = userMapper;
    this.keycloakClient = keycloakClient;
    this.userRepository = userRepository;
    this.adminRepository = adminRepository;
  }

  @Override
  @Transactional
  public CreateUserResponse createUser(CreateUserRequest request) {
    log.info("Creating new user with username: {}", request.getUsername());
    log.debug("Request: Email={}, Roles={}", request.getEmail(), request.getRole());

    CreateUserResponse response;
    try {
      response = keycloakClient.createUser(request, Set.of());
      log.debug("Successfully created user in Keycloak");
    } catch (Exception ex) {
      log.error("Keycloak user creation failed: {}", ex.getMessage(), ex);
      throw new RuntimeException("Failed to create user in identity provider", ex);
    }

    try {
      User user = userMapper.toUser(request);
      User savedUser = userRepository.save(user);
      response.setUserId(savedUser.getId());
      log.info("Successfully created user with ID: {}", savedUser.getId());
      return response;
    } catch (Exception ex) {
      log.error("DB save failed, rolling back Keycloak user", ex);
      keycloakClient.rollbackKeycloakUser(response.getUsername());
      throw new RuntimeException("Failed to create user in database", ex);
    }
  }

  @Transactional
  @Override
  public CreateUserResponse changeUserPassword(String userId, String newPassword) {
    return null;
  }

  @Override
  @Transactional
  public Boolean deleteUser(String userName) {
    log.info("Deleting user with username: {}", userName);
    try {
      // First try to delete from database
      log.debug("Attempting to delete user from database");
      User user =
          userRepository
              .findByUsername(userName)
              .orElseThrow(
                  () -> {
                    log.warn("User not found in database: {}", userName);
                    return new RuntimeException("User not found: " + userName);
                  });

      // Delete from Keycloak
      log.debug("Deleting user from Keycloak");
      boolean keycloakDeleted = keycloakClient.deleteUser(userName);
      if (!keycloakDeleted) {
        log.error("Failed to delete user from Keycloak: {}", userName);
        throw new RuntimeException("Failed to delete user from identity provider");
      }

      // Delete from database
      userRepository.delete(user);
      log.info("Successfully deleted user: {}", userName);
      return true;

    } catch (Exception e) {
      log.error("Error deleting user {}: {}", userName, e.getMessage(), e);
      throw new RuntimeException("Failed to delete user: " + e.getMessage(), e);
    }
  }

  @Override
  @Transactional
  public Boolean enableUser(Long userId) {
    log.info("enableUser called with userId: {}", userId);
    Optional<User> user = userRepository.findById(userId);
    User user1 = user.orElseThrow(()-> new UserNotFoundException(userId.toString()));
    String loggedInUserName = UserUtils.getLoggedInUsername().orElseThrow(
        () -> new RuntimeException("You are not logged in")
    );
    if(isItSelfOrRootUser(user1.getUsername())){
      throw new OperationNotPermit(loggedInUserName,"You can't enable/disable yourself or root user");
    }
    try{
      user1.setIsEnabled(true);
      String keycloakId = user1.getKeycloakId();
      keycloakClient.enableUser(keycloakId);
      userRepository.save(user1);
      return true;
    } catch (Exception e) {
      user1.setIsEnabled(false);
      userRepository.save(user1);
      log.error("Error disabling user: {}", e.getMessage(), e);
      return false;
    }
  }

  @Override
  @Transactional
  public Boolean disableUser(Long userId) {
    log.info("disableUser called with userId: {}", userId);
    Optional<User> user = userRepository.findById(userId);
    User user1 = user.orElseThrow(()-> new UserNotFoundException(userId.toString()));
    String loggedInUserName = UserUtils.getLoggedInUsername().orElseThrow(
            () -> new RuntimeException("You are not logged in")
    );
    if(isItSelfOrRootUser(user1.getUsername())){
      throw new OperationNotPermit(loggedInUserName,"You can't enable/disable yourself or root user");
    }
    try{
      user1.setIsEnabled(false);
      String keycloakId = user1.getKeycloakId();
      keycloakClient.disableUser(keycloakId);
      User savedUser = userRepository.save(user1);
      return true;
    } catch (Exception e) {
      user1.setIsEnabled(true);
      userRepository.save(user1);
      log.error("Error disabling user: {}", e.getMessage(), e);
      return false;
    }
  }

  @Override
  public Boolean enableAndDisableUser(Long userId, Boolean enableUser) {
    log.info("enableAndDisableUser called with userId: {}, isEnabled: {}", userId, enableUser ? "true" : "false");
    return enableUser?this.enableUser(userId):this.disableUser(userId);
  }

  @Override
  public List<CreateUserResponse> getAllUser() {
    log.info("getAllUser called");
    try {
      List<User> users = userRepository.findAll();
      log.info("Fetched {} users from database", users);

      List<CreateUserResponse> response =
          users.stream()
              .peek(user -> log.info("Processing user: {}", user.getId()))
              .map(userMapper::toCreateUserResponse)
              .toList();

      log.info("Successfully retrieved {} users", response.size());
      return response;

    } catch (Exception e) {
      log.error("Error fetching all users: {}", e.getMessage(), e);
      throw new RuntimeException("Failed to fetch users: " + e.getMessage(), e);
    }
  }

  @Override
  public Boolean isItSelfOrRootUser(String requestedUserName) {
    log.info("isItSelfOrRootUser called with requestedUserName: {}", requestedUserName);
    String loggedInUsername = UserUtils.getLoggedInUsername().orElseThrow(
            () -> new OperationNotPermit(requestedUserName,"Token not found")
    );
    return Objects.equals(loggedInUsername, requestedUserName)  ||
            Objects.equals(requestedUserName, APIConstant.ROOT_USER_NAME);
  }

  @Override
  public PagingResult<CreateUserResponse> getAllUser(Pageable pageable) {
    log.debug(
        "Fetching users with pagination - page: {}, size: {}",
        pageable.getPageNumber(),
        pageable.getPageSize());

    try {
      log.trace("Executing database query to fetch users");
      Page<User> userPage = adminRepository.findAll(pageable);

      List<CreateUserResponse> users =
          userPage.getContent().stream()
              .peek(user -> log.trace("Mapping user: {}", user.getUsername()))
              .map(userMapper::toCreateUserResponse)
              .toList();

      log.debug("Fetched {} of {} total users", users.size(), userPage.getTotalElements());

      return PagingResult.<CreateUserResponse>builder()
          .content(users)
          .totalPages(userPage.getTotalPages())
          .totalElements(userPage.getTotalElements())
          .size(userPage.getSize())
          .page(userPage.getNumber())
          .empty(userPage.isEmpty())
          .build();

    } catch (Exception e) {
      log.error(
          "Error fetching users - Page: {}, Size: {} - {}",
          pageable.getPageNumber(),
          pageable.getPageSize(),
          e.getMessage(),
          e);
      throw new RuntimeException("Failed to fetch users: " + e.getMessage(), e);
    }
  }
}
