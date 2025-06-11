package com.blog.auth.service;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import java.util.List;

public interface UserService {
  // adder user related curd methods like list user,delete user,list User with pagination etc

  // create user
  CreateUserResponse createUser(CreateUserRequest request);

  // update user
  CreateUserResponse updateUser(UpdateUserRequest updateUserRequest);

  // change user password
  CreateUserResponse changeUserPassword(String userId, String newPassword);

  // delete user
  Boolean deleteUser(String userId);

  // get user by id
  CreateUserResponse getUserById(String userId);

  // disable user
  CreateUserResponse disableUser(String userId);

  // enable user
  CreateUserResponse enableUser(String userId);

  // list user with pagination
  CreateUserResponse listUserWithPagination(int page, int size);

  // list all user without pagination
  List<CreateUserResponse> listAllUser();
}
