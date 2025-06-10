package com.blog.posts.dto;

import com.blog.sharedkernel.dto.BaseDto;
import java.util.HashSet;
import java.util.Set;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PostDto extends BaseDto {
  private String title;
  private String content;
  private String excerpt;
  private String slug;
  private String featuredImage;
  private boolean published;
  private String authorId;
  private String authorName;
  private Set<CategoryDto> categories = new HashSet<>();
  private Set<TagDto> tags = new HashSet<>();
  private int commentCount;
}
