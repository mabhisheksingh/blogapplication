package com.blog.auth.service;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import jakarta.annotation.Nonnull;
import java.util.List;
import java.util.Set;

public interface IDPClient {

  String getIDPName();

   //resend email
  void resendEmail(String userName);

  // create user with group
  CreateUserResponse createUser(CreateUserRequest request, Set<String> userGroup);

  // update role
  void updateOrAssignRole(@Nonnull String userId, @Nonnull Set<String> roleName);

  // update user
  CreateUserResponse updateUser(UpdateUserRequest updateUserRequest);

  // change user password
  void changeUserPassword(String userId, String newPassword);

  boolean isUserExist(String userId);

  boolean isUserActive(String userId);

  boolean deleteUser(String userName);

  String getIdFromUserName(String userName);

  List<CreateUserResponse> getAllUsers();

  void disableUser(String userId);

  void enableUser(String userId);
}
