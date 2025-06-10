package com.blog.posts.dto;

import com.blog.sharedkernel.dto.BaseDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDto extends BaseDto {
  private String name;
  private String description;
  private String slug;
  private int postCount;
}
