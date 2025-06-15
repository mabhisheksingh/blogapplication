package com.blog.comments.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UpdateCommentDTO {

  @NotNull
  @NotBlank(message = "comment is required")
  private String comment; // Actual comment text

  @Null @JsonIgnore @Builder.Default
  private LocalDateTime updatedAt = LocalDateTime.now(); // When comment was last updated

  @Null @JsonIgnore @Builder.Default private boolean isEdited = true; // true if comment was edited
}
