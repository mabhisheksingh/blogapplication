package com.blog.posts.dto.response;

import com.blog.sharedkernel.dto.BaseDto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO extends BaseDto {
  private String name;
  private String description;
  private String slug;
  private int postCount;
}
