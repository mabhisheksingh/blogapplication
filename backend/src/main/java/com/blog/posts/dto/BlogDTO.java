package com.blog.posts.dto;

import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class BlogDTO {

  @Null private Long id;
  private String title;
  private String content;
  //  private LocalDateTime createdAt;
  //  private LocalDateTime updatedAt;
}
