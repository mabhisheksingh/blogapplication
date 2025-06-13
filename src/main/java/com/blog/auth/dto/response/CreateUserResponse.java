package com.blog.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CreateUserResponse {
  // user dto for blog application
  private Long userId;
  private String keycloakId;
  private String email;
  private String firstName;
  private String lastName;
  private String username;
  private String role;
  private String age;
  private String profileImage;
}
