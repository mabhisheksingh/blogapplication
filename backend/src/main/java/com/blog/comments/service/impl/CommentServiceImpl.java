package com.blog.comments.service.impl;

import com.blog.comments.dto.request.CreateCommentDTO;
import com.blog.comments.dto.request.UpdateCommentDTO;
import com.blog.comments.dto.response.ResponseCommentDTO;
import com.blog.comments.mapper.CommentMapper;
import com.blog.comments.model.Comment;
import com.blog.comments.repository.CommentRepository;
import com.blog.comments.service.CommentService;
import com.blog.sharedkernel.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Service for managing blog post comments. */
@Slf4j
@Service
public class CommentServiceImpl implements CommentService {

  private final CommentRepository commentRepository;
  private final CommentMapper commentMapper;

  @Autowired
  public CommentServiceImpl(CommentRepository commentRepository, CommentMapper commentMapper) {
    this.commentRepository = commentRepository;
    this.commentMapper = commentMapper;
  }

  @Override
  @Transactional
  public Page<ResponseCommentDTO> getCommentsForPost(Long postId, Pageable pageable) {
    log.info("GetCommentsForPost called");
    log.debug(
        "Retrieving comments for post with ID: {} for pageNumber: {} and pageSize: {}",
        postId,
        pageable.getPageNumber(),
        pageable.getPageSize());
    Page<Comment> byPostId = commentRepository.findByPostId(postId, pageable);
    log.debug("Retrieved {} comments for post with ID: {}", byPostId.getContent().size(), postId);
    return byPostId.map(commentMapper::toResponseDto);
  }

  @Override
  public ResponseCommentDTO createComment(CreateCommentDTO createCommentDTO) {
    log.info("CreateComment called");
    log.debug("Creating comment for post with ID: {}", createCommentDTO.getPostId());
    Comment comment = commentMapper.toEntity(createCommentDTO);
    comment = commentRepository.save(comment);
    log.debug("Comment saved with ID: {}", comment.getId());
    return commentMapper.toResponseDto(comment);
  }

  @Override
  public void updateComment(Long id, UpdateCommentDTO updateCommentDTO) {
    log.info("UpdateComment called");
    log.debug("Updating comment with ID: {}", id);
    Comment comment =
        commentRepository
            .findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException("Comment not found", "commentId ", id));
    updateCommentDTO.setComment(comment.getComment());
    comment.setUpdatedAt(updateCommentDTO.getUpdatedAt());
    commentRepository.save(comment);
    log.debug("Comment updated with ID: {}", id);
  }

  @Override
  public void deleteComment(Long commentId) {
    log.info("DeleteComment called");
    log.debug("Deleting comment with ID: {}", commentId);
    Comment comment =
        commentRepository
            .findById(commentId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Comment not found", "commentId ", commentId));
    commentRepository.delete(comment);
    log.debug("Comment deleted with ID: {}", commentId);
  }

  @Override
  public Long getCommentCountForPost(Long postId) {
    log.info("GetCommentCountForPost called");
    log.debug("Retrieving comment count for post with ID: {}", postId);
    Long l = commentRepository.countByPostId(postId);
    log.debug("Retrieved comment count: {}", l);
    return l;
  }
}
