package com.blog.comments.dto;

import com.blog.sharedkernel.dto.BaseDto;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.HashSet;
import java.util.Set;
import lombok.*;
import lombok.experimental.SuperBuilder;

/** Data Transfer Object for Comment operations. */
@Schema(description = "Data Transfer Object for Comment operations")
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class CommentDto extends BaseDto {
  @Schema(
      description = "The content of the comment",
      requiredMode = Schema.RequiredMode.REQUIRED,
      example = "This is a great post! Thanks for sharing.")
  private String content;

  @Schema(
      description = "ID of the comment author",
      requiredMode = Schema.RequiredMode.REQUIRED,
      example = "auth0|1234567890")
  private String authorId;

  @Schema(description = "Name of the comment author", example = "John Doe")
  private String authorName;

  @Schema(description = "Email of the comment author", example = "john.doe@example.com")
  private String authorEmail;

  @Schema(description = "Whether the comment has been approved by a moderator", example = "false")
  private boolean approved;

  @Schema(
      description = "ID of the post this comment belongs to",
      requiredMode = Schema.RequiredMode.REQUIRED,
      example = "123")
  private Long postId;

  @Schema(description = "ID of the parent comment if this is a reply", example = "456")
  private Long parentId;

  @Schema(description = "List of replies to this comment")
  private Set<CommentDto> replies = new HashSet<>();
}
