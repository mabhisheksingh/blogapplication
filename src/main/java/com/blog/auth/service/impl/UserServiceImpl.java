package com.blog.auth.service.impl;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.exception.UserNotFoundException;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.model.User;
import com.blog.auth.repository.UserRepository;
import com.blog.auth.service.UserService;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
  public CreateUserResponse createUser(CreateUserRequest request) {
    log.info("UserServiceImpl createUser called");
    log.info("UserServiceImpl createUser request: {}", request);
    CreateUserResponse response = keycloakClient.createUser(request);
    try {
      User save = userRepository.save(userMapper.toUser(request));
      response.setUserId(save.getId());
    } catch (Exception e) {
      var status = keycloakClient.deleteUser(response.getUsername());
      log.error("User deleted status: {}", status);
      log.error("Exception while creating user: {}", e.getMessage());
      throw new RuntimeException(request.getUsername());
    }
    return response;
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
