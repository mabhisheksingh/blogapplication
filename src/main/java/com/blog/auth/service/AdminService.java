package com.blog.auth.service;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.sharedkernel.dto.PagingResult;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface AdminService {
  // delete user
  Boolean deleteUser(String userName);

  // change user password
  CreateUserResponse changeUserPassword(String userId, String newPassword);

  // create user
  CreateUserResponse createUser(CreateUserRequest request);

  // disable user
  CreateUserResponse disableUser(String userId);

  // enable user
  CreateUserResponse enableUser(String userId);

  // list all user without pagination
  List<CreateUserResponse> getAllUser();

  // list all user with pagination
  PagingResult<CreateUserResponse> getAllUser(Pageable pageable);
}
