package com.blog.auth.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UpdateUserRequest {
  // user dto for blog application
  private String firstName;
  private String lastName;
  @Min(value = 1, message = "Age must be at least 1")
  @Max(value = 100, message = "Age must be at most 100")
  private String age;
  private Boolean isEnabled;
  private String role;
  private String profileImage;
}
