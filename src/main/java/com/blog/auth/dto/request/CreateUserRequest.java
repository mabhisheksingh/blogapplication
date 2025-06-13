package com.blog.auth.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreateUserRequest {

  @Email(message = "Invalid email format")
  @NotBlank(message = "Email is required")
  private String email;

  @NotBlank(message = "First name is required")
  private String firstName;

  private String lastName;

  @NotBlank(message = "Username is required")
  private String username;

  @Null private String role;

  @NotBlank(message = "Password is required")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @Min(value = 1, message = "Age must be at least 1")
  @Max(value = 100, message = "Age must be at most 100")
  private Integer age;

  private String profileImage;
}
