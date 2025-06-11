package com.blog.auth.service.impl;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.mapper.UserMapper;
import com.blog.auth.model.User;
import com.blog.auth.repository.UserRepository;
import com.blog.auth.service.UserService;
import java.util.List;
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
  public CreateUserResponse changeUserPassword(String userId, String newPassword) {
    return null;
  }

  @Override
  public Boolean deleteUser(String userId) {
    return null;
  }

  @Override
  public CreateUserResponse getUserById(String userId) {
    return null;
  }

  @Override
  public CreateUserResponse disableUser(String userId) {
    return null;
  }

  @Override
  public CreateUserResponse enableUser(String userId) {
    return null;
  }

  @Override
  public CreateUserResponse listUserWithPagination(int page, int size) {
    return null;
  }

  @Override
  public List<CreateUserResponse> listAllUser() {
    return List.of();
  }
}
