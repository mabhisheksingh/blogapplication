package com.blog.auth.service;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;

public interface UserService {
  // adder user related curd methods like list user,delete user,list User with pagination etc

  // create user
  CreateUserResponse createUser(CreateUserRequest request);

  // update user
  CreateUserResponse updateUser(UpdateUserRequest updateUserRequest);

  // get user by id
  CreateUserResponse getUserById(Long userId);
}
