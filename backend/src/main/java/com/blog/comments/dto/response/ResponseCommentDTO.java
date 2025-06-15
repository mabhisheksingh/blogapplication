package com.blog.comments.dto.response;

import com.blog.sharedkernel.dto.BaseDto;
import lombok.*;

@Data
public class ResponseCommentDTO extends BaseDto {
  private Long postId; // Blog post ID that this comment belongs to
  private String comment; // Actual comment text
  private String authorUserName; // Name of the person commenting
  private String authorEmail; // (Optional) Email of commenter
  private boolean isEdited; // true if comment was edited
}
