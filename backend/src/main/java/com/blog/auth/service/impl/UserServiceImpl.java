package com.blog.auth.service.impl;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.model.User;
import com.blog.auth.repository.UserRepository;
import com.blog.auth.service.UserService;
import com.blog.sharedkernel.exception.UserNotFoundException;
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
  public CreateUserResponse getByUserName(String userName) {
    log.info("UserServiceImpl getByUserName called");
    log.debug("UserServiceImpl getByUserName userName: {}", userName);
    Optional<User> user = userRepository.findByUsername(userName);
    CreateUserResponse createUserResponse =
        user.map(u -> userMapper.toCreateUserResponse(u))
            .orElseThrow(() -> new UserNotFoundException(userName));
    log.debug("UserServiceImpl getByUserName response: {}", createUserResponse);
    return createUserResponse;
  }

  @Override
  public CreateUserResponse updateUser(UpdateUserRequest updateUserRequest) {
    return null;
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
