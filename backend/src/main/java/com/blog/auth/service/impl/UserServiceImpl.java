package com.blog.auth.service.impl;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.model.User;
import com.blog.auth.repository.UserRepository;
import com.blog.auth.service.UserService;
import com.blog.sharedkernel.exception.UserNotFoundException;
import com.blog.sharedkernel.utils.UserUtils;
import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class UserServiceImpl implements UserService {

  UserRepository userRepository;
  KeycloakClientImpl keycloakClient;
  UserMapper userMapper;

  @Autowired
  public UserServiceImpl(
      UserRepository userRepository, KeycloakClientImpl keycloakClient, UserMapper userMapper) {
    this.userMapper = userMapper;
    this.keycloakClient = keycloakClient;
    this.userRepository = userRepository;
  }

  @Override
  @Transactional
  public CreateUserResponse createUser(@Nonnull CreateUserRequest request) {
    log.info("UserServiceImpl createUser called");
    log.info("UserServiceImpl createUser request: {}", request);
    CreateUserResponse response = keycloakClient.createUser(request, Set.of());
    try {
      User user = userMapper.toUser(response);
      user.setKeycloakId(response.getKeycloakId());
      user.setIsEnabled(response.getIsEnabled());
      User savedUser = userRepository.save(user);
      response.setUserId(savedUser.getId());
    } catch (Exception e) {
      var status = keycloakClient.deleteUser(response.getUsername());
      log.error("User deleted status: {}", status);
      log.error("Exception while creating user: {}", e.getMessage());
      throw new RuntimeException(request.getUsername());
    }
    return response;
  }

  @Override
  public void saveUsersFromIDP(@Nonnull List<CreateUserResponse> response) {
    log.info("UserServiceImpl createUserFromIDP called");
    log.debug("UserServiceImpl createUserFromIDP response: {}", response);
    for (CreateUserResponse user : response) {
      try {
        User user1 = userMapper.toUser(user);
        User existingUser = userRepository.findByUsername(user.getUsername()).orElse(null);
        if (existingUser != null) {
          log.info("UserServiceImpl createUserFromIDP user exist: {}", user);
          continue;
        }
        log.debug("UserServiceImpl createUserFromIDP user object: {}", user1);
        User save = userRepository.save(userMapper.toUser(user));
        log.info("Saved user with ID: {}", save.getId());
        log.debug("UserServiceImpl createUserFromIDP after saving in DB : {}", save);
      } catch (Exception e) {
        var status = keycloakClient.deleteUser(user.getUsername());
        log.error("User deleted status: {}", status);
        log.error("Exception while creating user: {}", e.getMessage());
        throw new RuntimeException(user.getUsername());
      }
    }
  }

  @Override
  @Transactional
  public CreateUserResponse getByUserName(String userName) {
    log.info("UserServiceImpl getByUserName called");
    log.debug("UserServiceImpl getByUserName userName: {}", userName);
    Optional<User> user = userRepository.findByUsername(userName);
    log.info("UserServiceImpl getByUserName user: {}", user.get().getProfileImage());
    CreateUserResponse createUserResponse =
        user.map(u -> userMapper.toCreateUserResponse(u))
            .orElseThrow(() -> new UserNotFoundException(userName));
    log.debug("UserServiceImpl getByUserName response: {}", createUserResponse);
    return createUserResponse;
  }

  @Override
  @Transactional
  public CreateUserResponse updateUser(UpdateUserRequest updateUserRequest) {
    log.info("UserServiceImpl updateUser called");
    log.debug("UserServiceImpl updateUser request: {}", updateUserRequest);
    String loggedInUser = UserUtils.getLoggedInUsername().orElseThrow(() -> new UserNotFoundException("User not found"));
    Optional<User> byUsername = userRepository.findByUsername(loggedInUser);
    if (byUsername.isEmpty()) {
      throw new UserNotFoundException(loggedInUser);
    }
    User user = byUsername.get();
    user.setRole(updateUserRequest.getRole());
    user.setFirstName(updateUserRequest.getFirstName());
    user.setLastName(updateUserRequest.getLastName());
    user.setIsEnabled(updateUserRequest.getIsEnabled());
    user.setProfileImage(updateUserRequest.getProfileImage());
    user.setAge(updateUserRequest.getAge());
    try {
      User savedUser = userRepository.save(user);
      return userMapper.toCreateUserResponse(savedUser);
    } catch (Exception e) {
      log.error("Exception while updating user: {}", e.getMessage());
      throw new RuntimeException("Failed to update user: " + e.getMessage(), e);
    }
  }

  @Override
  public CreateUserResponse getUserById(Long userId) {
    log.info("UserServiceImpl getUserById called");
    log.debug("UserServiceImpl getUserById userId: {}", userId);
    Optional<User> user = userRepository.findById(userId);
    CreateUserResponse createUserResponse =
        user.map(u -> userMapper.toCreateUserResponse(u))
            .orElseThrow(() -> new UserNotFoundException(userId.toString()));
    log.debug("UserServiceImpl getUserById response: {}", createUserResponse);
    return createUserResponse;
  }
}
