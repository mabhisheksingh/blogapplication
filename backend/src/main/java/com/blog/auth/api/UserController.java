package com.blog.auth.api;

import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/user")
@Tag(name = "User Controller", description = "User operations for blog management")
@Slf4j
public class UserController {

  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  // User related CRUD operations

  @GetMapping("/users/{userName}")
  @Operation(summary = "Get user by ID")
  public ResponseEntity<?> getUserById(@PathVariable String userName) {
    log.info("GetUserById called");
    log.info("GetUserById userName: {}", userName);
    CreateUserResponse byUserName = userService.getByUserName(userName);
    log.info("GetUserById response: {}", byUserName);
    return ResponseEntity.ok(byUserName);
  }

  @PutMapping("/users/{userId}")
  @Operation(summary = "Update user info")
  public ResponseEntity<CreateUserResponse> updateUser(@RequestBody UpdateUserRequest updateUserRequest) {
    log.info("UpdateUser called");
    log.info("UpdateUserRequest: {}", updateUserRequest);
    CreateUserResponse createUserResponse = userService.updateUser(updateUserRequest);
    log.info("UpdateUserResponse: {}", createUserResponse);
    return ResponseEntity.ok(createUserResponse);
  }
}
