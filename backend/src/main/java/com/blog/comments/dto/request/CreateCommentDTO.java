package com.blog.comments.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CreateCommentDTO {

  @NotNull(message = "Post ID is required")
  private Long postId; // Blog post ID that this comment belongs to

  @NotNull
  @NotBlank(message = "Comment is required")
  @Schema(
      description = "The comment of the comment",
      requiredMode = Schema.RequiredMode.REQUIRED,
      example = "This is a great post! Thanks for sharing.")
  private String comment; // Actual comment text

  @Null @JsonIgnore // ID of the person commenting
  private String authorUserName; // Name of the person commenting
  @Null @JsonIgnore private String authorEmail; // (Optional) Email of commenter
  @Null @JsonIgnore
  @Builder.Default
  private LocalDateTime createdAt = LocalDateTime.now(); // When comment was created
  @Builder.Default
  @Null @JsonIgnore private LocalDateTime updatedAt = LocalDateTime.now(); // When comment was last updated
  @Null @JsonIgnore private Boolean isEdited; // true if comment was edited
}
