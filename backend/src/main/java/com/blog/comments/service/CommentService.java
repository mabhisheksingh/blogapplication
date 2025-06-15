package com.blog.comments.service;

import com.blog.comments.dto.request.CreateCommentDTO;
import com.blog.comments.dto.request.UpdateCommentDTO;
import com.blog.comments.dto.response.ResponseCommentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentService {

  /** Get paginated comments for a specific blog post. */
  Page<ResponseCommentDTO> getCommentsForPost(Long postId, Pageable pageable);

  /** Create a new comment. */
  ResponseCommentDTO createComment(CreateCommentDTO createCommentDTO);

  /** Update an existing comment. */
  void updateComment(Long id, UpdateCommentDTO updateCommentDTO);

  /** Delete a comment by ID. */
  void deleteComment(Long commentId);

  /** Get total comment count for a blog post. */
  Long getCommentCountForPost(Long postId);
}
