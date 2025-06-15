package com.blog.posts.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Null;
import java.util.HashSet;
import java.util.Set;
import lombok.*;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor

@Data
public class PostDTO {
  private String title;
  private String content;
  private String excerpt;
  private String slug;
  private String featuredImage;
  private boolean published;
  @Null @JsonIgnore private String authorUsername;

  @Schema(description = "List of category IDs", example = "[1, 2]")
  private Set<Long> categories = new HashSet<>();

  private Set<TagDTO> tags = new HashSet<>();
}
