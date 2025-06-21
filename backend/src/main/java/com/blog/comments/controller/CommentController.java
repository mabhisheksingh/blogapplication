package com.blog.comments.controller;

import com.blog.comments.dto.request.CreateCommentDTO;
import com.blog.comments.dto.request.UpdateCommentDTO;
import com.blog.comments.dto.response.ResponseCommentDTO;
import com.blog.comments.service.CommentService;
import com.blog.sharedkernel.utils.UserUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing blog post comments. Provides endpoints for creating, reading,
 * updating, and deleting comments.
 */
@RestController
@RequestMapping("/v1/api/comment")
@Tag(name = "Comment", description = "APIs for managing post comments")
@Slf4j
public class CommentController {

  private final CommentService commentService;

  public CommentController(CommentService commentService) {
    this.commentService = commentService;
  }

  @GetMapping("/post/{postId}")
  public ResponseEntity<Page<ResponseCommentDTO>> getCommentsForPost(
      @Parameter(description = "ID of the post to retrieve comments for", required = true)
          @PathVariable
          Long postId,
      @Parameter(description = "Pagination and sorting parameters") @PageableDefault(size = 10)
          Pageable pageable) {
    log.info("GetCommentsForPost called");
    log.debug("Retrieving comments for post with ID: {}", postId);
    Page<ResponseCommentDTO> comments = commentService.getCommentsForPost(postId, pageable);
    log.debug("Retrieved {} comments for post with ID: {}", comments.getContent().size(), postId);
    return ResponseEntity.ok(comments);
  }

  @Operation(
      summary = "Create a new comment",
      description =
          "Creates a new comment on a blog post. Can be either a top-level comment or a reply to an existing comment.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "201",
            description = "Comment created successfully",
            content =
                @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CreateCommentDTO.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input")
      })
  @PostMapping
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
  public ResponseEntity<ResponseCommentDTO> createComment(
      @Parameter(description = "Comment details to create", required = true) @Valid @RequestBody
          CreateCommentDTO commentDto) {
    log.info("CreateComment called");
    log.debug("Creating comment for post with ID: {}", commentDto.getPostId());
    UserUtils.getLoggedInUsername()
        .ifPresentOrElse(
            commentDto::setAuthorUserName, () -> commentDto.setAuthorUserName("anonymous"));
    UserUtils.getLoggedInEmail()
        .ifPresentOrElse(
            commentDto::setAuthorEmail, () -> commentDto.setAuthorEmail("anonymous@gmail.com"));
    ResponseCommentDTO savedComment = commentService.createComment(commentDto);
    log.debug("Comment saved with ID: {}", savedComment.getId());
    return ResponseEntity.created(URI.create("/api/comments/" + savedComment.getId()))
        .body(savedComment);
  }

  @PutMapping(value = "/{id}")
  public ResponseEntity<?> updateComment(
      @Parameter(description = "ID of the comment to update", required = true) @PathVariable
          Long id,
      @Parameter(description = "Updated comment details", required = true) @Valid @RequestBody
          UpdateCommentDTO updateCommentDTO) {
    log.info("UpdateComment called");
    log.debug("Updating comment with id: {}", id);
    commentService.updateComment(id, updateCommentDTO);
    return ResponseEntity.ok().build();
  }

  @Operation(
      summary = "Delete a comment",
      description =
          "Deletes a comment by ID. Only the comment owner or admin can delete a comment.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Comment deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Comment not found")
      })
  @DeleteMapping("/{commentId}")
  public ResponseEntity<Void> deleteComment(
      @Parameter(description = "ID of the comment to delete", required = true) @PathVariable
          Long commentId) {
    log.info("DeleteComment called");
    log.debug("Deleting comment with commentId: {}", commentId);
    commentService.deleteComment(commentId);
    return ResponseEntity.noContent().build();
  }

  @Operation(
      summary = "Get comment count for a post",
      description = "Returns the total number of comments for a specific blog post.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved comment count",
            content = @Content(mediaType = MediaType.TEXT_PLAIN_VALUE))
      })
  @GetMapping("/post/{postId}/count")
  public ResponseEntity<Long> getCommentCount(
      @Parameter(description = "ID of the post to get comment count for", required = true)
          @PathVariable
          Long postId) {
    log.info("GetCommentCount called");
    log.debug("Fetching comment count for post ID: {}", postId);
    Long commentCount = commentService.getCommentCountForPost(postId);
    log.debug("Successfully fetched comment count: {}", commentCount);
    return ResponseEntity.ok(commentCount);
  }
}
