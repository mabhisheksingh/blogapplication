package com.blog.posts.dto.response;

import com.blog.sharedkernel.dto.BaseDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO extends BaseDto {
  private String name;
  private String description;
  private String slug;
  private int postCount;
}
