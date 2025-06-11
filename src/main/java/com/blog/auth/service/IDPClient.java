package com.blog.auth.service;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;

public interface IDPClient {

  String getIDPName();

  // create user
  CreateUserResponse createUser(CreateUserRequest request);

  // update user
  CreateUserResponse updateUser(UpdateUserRequest updateUserRequest);

  // change user password
  void changeUserPassword(String userId, String newPassword);

  boolean isUserExist(String userId);

  boolean isUserActive(String userId);

  boolean deleteUser(String userName);

  String getIdFromUserName(String userName);
}
