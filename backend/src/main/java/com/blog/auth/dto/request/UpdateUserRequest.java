package com.blog.auth.dto.request;

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
  private String age;
  private String profileImage;
}
