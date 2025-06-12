package com.blog.auth.service.impl;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.model.User;
import com.blog.auth.repository.AdminRepository;
import com.blog.auth.repository.UserRepository;
import com.blog.auth.service.AdminService;
import com.blog.sharedkernel.dto.PagingResult;
import java.util.List;
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
    log.debug(
        "User creation request details - Email: {}, Roles: {}",
        request.getEmail(),
        request.getRoles());

    try {
      log.debug("Creating user in Keycloak");
      CreateUserResponse response = keycloakClient.createUser(request);

      try {
        log.debug("Saving user to database");
        User user = userMapper.toUser(request);
        User savedUser = userRepository.save(user);
        response.setUserId(savedUser.getId());

        log.info(
            "Successfully created user with ID: {} and username: {}",
            savedUser.getId(),
            savedUser.getUsername());
        return response;

      } catch (Exception e) {
        log.error("Error saving user to database. Attempting to rollback Keycloak user", e);
        boolean deleted = keycloakClient.deleteUser(response.getUsername());
        log.debug("Keycloak user rollback status: {}", deleted ? "Success" : "Failed");
        throw new RuntimeException("Failed to create user in database: " + e.getMessage(), e);
      }

    } catch (Exception e) {
      log.error("Failed to create user in Keycloak: {}", e.getMessage(), e);
      throw new RuntimeException(
          "Failed to create user in identity provider: " + e.getMessage(), e);
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
  public CreateUserResponse disableUser(String userId) {
    return null;
  }

  @Override
  @Transactional
  public CreateUserResponse enableUser(String userId) {
    return null;
  }

  @Override
  public List<CreateUserResponse> getAllUser() {
    log.info("Fetching all users without pagination");
    try {
      List<User> users = userRepository.findAll();
      log.debug("Fetched {} users from database", users.size());

      List<CreateUserResponse> response =
          users.stream()
              .peek(user -> log.trace("Processing user: {}", user.getUsername()))
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
