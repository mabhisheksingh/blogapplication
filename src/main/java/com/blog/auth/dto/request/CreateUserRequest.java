package com.blog.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CreateUserRequest {
  // user dto for blog application
  @Email private String email;
  @NotBlank private String firstName;

  private String lastName;
  @NotBlank private String username;
  private String roles;
  @NotBlank private String password;

  @Min(1)
  @Max(100)
  private Integer age;

  private String profileImage;
}
