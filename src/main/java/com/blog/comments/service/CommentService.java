package com.blog.comments.service;

import com.blog.comments.dto.CommentDto;
import com.blog.comments.mapper.CommentMapper;
import com.blog.comments.model.Comment;
import com.blog.comments.repository.CommentRepository;
import com.blog.sharedkernel.exception.ResourceNotFoundException;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service for managing blog post comments. */
@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

  private final CommentRepository commentRepository;
  private final CommentMapper commentMapper;

  /**
   * Retrieves paginated comments for a specific post.
   *
   * @param postId the ID of the post
   * @param pageable pagination information
   * @return a page of CommentDto objects
   */
  @Transactional(readOnly = true)
  public Page<CommentDto> getCommentsForPost(Long postId, Pageable pageable) {
    log.debug("Fetching comments for post ID: {}", postId);
    return commentRepository
        .findByPostId(postId, pageable)
        .map(
            comment -> {
              CommentDto dto = commentMapper.toDto(comment);
              // Set the parent ID if exists
              if (comment.getParent() != null) {
                dto.setParentId(comment.getParent().getId());
              }
              return dto;
            });
  }

  /**
   * Retrieves the comment tree for a specific post.
   *
   * @param postId the ID of the post
   * @return a list of top-level comments with their replies
   */
  @Transactional(readOnly = true)
  public List<CommentDto> getCommentTreeForPost(Long postId) {
    log.debug("Building comment tree for post ID: {}", postId);
    return commentRepository.findByPostIdAndParentIsNull(postId).stream()
        .map(this::buildCommentTree)
        .collect(Collectors.toList());
  }

  /**
   * Creates a new comment.
   *
   * @param commentDto the comment data
   * @return the created comment as DTO
   */
  @Transactional
  public CommentDto createComment(CommentDto commentDto) {
    log.debug("Creating new comment for post ID: {}", commentDto.getPostId());

    // Create and save the comment
    Comment comment = commentMapper.toEntity(commentDto);

    // Set parent comment if parentId is provided
    if (commentDto.getParentId() != null) {
      Comment parent = getCommentById(commentDto.getParentId());
      comment.setParent(parent);

      // Verify that the parent comment belongs to the same post
      if (!parent.getPostId().equals(commentDto.getPostId())) {
        throw new IllegalArgumentException("Parent comment does not belong to the same post");
      }
    }

    // Save the comment
    Comment savedComment = commentRepository.save(comment);
    log.info(
        "Created comment with ID: {} for post ID: {}",
        savedComment.getId(),
        savedComment.getPostId());

    // Convert to DTO and return
    CommentDto savedDto = commentMapper.toDto(savedComment);
    if (savedComment.getParent() != null) {
      savedDto.setParentId(savedComment.getParent().getId());
    }

    return savedDto;
  }

  /**
   * Updates an existing comment.
   *
   * @param id the ID of the comment to update
   * @param commentDto the updated comment data
   * @return the updated comment as DTO
   */
  @Transactional
  public CommentDto updateComment(Long id, CommentDto commentDto) {
    log.debug("Updating comment with ID: {}", id);

    // Get the existing comment
    Comment existingComment = getCommentById(id);

    // Update the comment with new data
    commentMapper.updateEntityFromDto(commentDto, existingComment);

    // Save the updated comment
    Comment updatedComment = commentRepository.save(existingComment);
    log.info("Updated comment with ID: {}", id);

    // Convert to DTO and return
    CommentDto updatedDto = commentMapper.toDto(updatedComment);
    if (updatedComment.getParent() != null) {
      updatedDto.setParentId(updatedComment.getParent().getId());
    }

    return updatedDto;
  }

  /**
   * Deletes a comment by ID.
   *
   * @param id the ID of the comment to delete
   */
  @Transactional
  public void deleteComment(Long id) {
    log.debug("Deleting comment with ID: {}", id);

    // Check if the comment exists
    Comment comment = getCommentById(id);

    // Delete the comment
    commentRepository.delete(comment);
    log.info("Deleted comment with ID: {}", id);
  }

  /**
   * Retrieves a comment by ID.
   *
   * @param id the ID of the comment
   * @return the comment entity
   * @throws ResourceNotFoundException if the comment is not found
   */
  @Transactional(readOnly = true)
  public Comment getCommentById(Long id) {
    log.debug("Fetching comment with ID: {}", id);
    return commentRepository
        .findById(id)
        .orElseThrow(
            () -> {
              log.error("Comment not found with ID: {}", id);
              return new ResourceNotFoundException("Comment", "id", id);
            });
  }

  /**
   * Retrieves the total number of comments for a post.
   *
   * @param postId the ID of the post
   * @return the comment count
   */
  @Transactional(readOnly = true)
  public Long getCommentCountForPost(Long postId) {
    log.debug("Fetching comment count for post ID: {}", postId);
    return commentRepository.countByPostId(postId);
  }

  /**
   * Retrieves the number of approved comments for a post.
   *
   * @param postId the ID of the post
   * @return the approved comment count
   */
  @Transactional(readOnly = true)
  public Long getApprovedCommentCountForPost(Long postId) {
    log.debug("Fetching approved comment count for post ID: {}", postId);
    return commentRepository.countByPostIdAndApprovedTrue(postId);
  }

  /**
   * Recursively builds a comment tree from a comment entity.
   *
   * @param comment the comment entity
   * @return the comment DTO with nested replies
   */
  private CommentDto buildCommentTree(Comment comment) {
    if (comment == null) {
      return null;
    }

    // Convert to DTO
    CommentDto dto = commentMapper.toDto(comment);

    // Set parent ID if exists
    if (comment.getParent() != null) {
      dto.setParentId(comment.getParent().getId());
    }

    // Recursively build replies
    if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
      Set<CommentDto> replyDtos =
          comment.getReplies().stream()
              .map(this::buildCommentTree)
              .filter(Objects::nonNull)
              .collect(Collectors.toSet());
      dto.setReplies(replyDtos);
    } else {
      dto.setReplies(Set.of());
    }

    return dto;
  }
}
