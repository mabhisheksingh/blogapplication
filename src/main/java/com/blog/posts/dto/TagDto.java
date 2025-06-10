package com.blog.posts.dto;

import com.blog.sharedkernel.dto.BaseDto;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TagDto extends BaseDto {
  private String name;
  private String slug;
  private String description;
  private int postCount;
}
