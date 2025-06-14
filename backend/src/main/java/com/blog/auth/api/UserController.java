package com.blog.auth.api;

import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/user")
@Tag(name = "User Controller", description = "User operations for blog management")
public class UserController {

  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  // User related CRUD operations

  @GetMapping("/users/{userId}")
  @Operation(summary = "Get user by ID")
  public ResponseEntity<?> getUserById(@PathVariable Long userId) {
    return ResponseEntity.ok(userService.getUserById(userId));
  }

  @PutMapping("/users/{userId}")
  @Operation(summary = "Update user info")
  public ResponseEntity<?> updateUser(@RequestBody UpdateUserRequest updateUserRequest) {
    return ResponseEntity.ok(userService.updateUser(updateUserRequest));
  }
}
