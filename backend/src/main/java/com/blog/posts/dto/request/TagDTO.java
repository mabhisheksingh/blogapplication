package com.blog.posts.dto.request;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TagDTO {
  private String name;
  private String slug;
  private String description;

  public void setName(String name) {
    this.name = (name == null) ? null : name.trim().toLowerCase();
  }
}
