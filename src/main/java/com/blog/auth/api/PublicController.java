package com.blog.auth.api;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/v1/api/public")
@Tag(name = "Public", description = "APIs for public operations")
public class PublicController {
  private final UserService userService;

  @Autowired
  public PublicController(UserService userService) {
    this.userService = userService;
  }

  @PostMapping("/create-user")
  @Operation(summary = "Create user info")
  public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
    log.info("PublicController createUser called");
    log.info("PublicController createUser request: {}", createUserRequest);

    createUserRequest.setRole("USER");
    return ResponseEntity.ok(userService.createUser(createUserRequest));
  }
}
