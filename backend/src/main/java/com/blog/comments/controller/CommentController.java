package com.blog.comments.controller;

import com.blog.comments.dto.CommentDto;
import com.blog.comments.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing blog post comments. Provides endpoints for creating, reading,
 * updating, and deleting comments.
 */
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "APIs for managing blog post comments")
public class CommentController {

  private final CommentService commentService;

  @Operation(
      summary = "Get paginated comments for a post",
      description = "Retrieves a paginated list of comments for a specific blog post.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved comments",
            content =
                @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CommentDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid post ID")
      })
  @GetMapping("/post/{postId}")
  public ResponseEntity<Page<CommentDto>> getCommentsForPost(
      @Parameter(description = "ID of the post to retrieve comments for", required = true)
          @PathVariable
          Long postId,
      @Parameter(description = "Pagination and sorting parameters") @PageableDefault(size = 10)
          Pageable pageable) {
    return ResponseEntity.ok(commentService.getCommentsForPost(postId, pageable));
  }

  @Operation(
      summary = "Get comment tree for a post",
      description =
          "Retrieves all comments for a post in a hierarchical tree structure with replies nested under their parent comments.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved comment tree",
            content =
                @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CommentDto.class)))
      })
  @GetMapping("/post/{postId}/tree")
  public ResponseEntity<List<CommentDto>> getCommentTreeForPost(
      @Parameter(description = "ID of the post to retrieve comment tree for", required = true)
          @PathVariable
          Long postId) {
    return ResponseEntity.ok(commentService.getCommentTreeForPost(postId));
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
                    schema = @Schema(implementation = CommentDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input")
      })
  @PostMapping(
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<CommentDto> createComment(
      @Parameter(description = "Comment details to create", required = true) @Valid @RequestBody
          CommentDto commentDto) {
    CommentDto savedComment = commentService.createComment(commentDto);
    return ResponseEntity.created(URI.create("/api/comments/" + savedComment.getId()))
        .body(savedComment);
  }

  @Operation(
      summary = "Update a comment",
      description =
          "Updates an existing comment by ID. Only the comment owner or admin can update a comment.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Comment updated successfully",
            content =
                @Content(
                    mediaType = MediaType.APPLICATION_JSON_VALUE,
                    schema = @Schema(implementation = CommentDto.class))),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "404", description = "Comment not found")
      })
  @PutMapping(
      value = "/{id}",
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<CommentDto> updateComment(
      @Parameter(description = "ID of the comment to update", required = true) @PathVariable
          Long id,
      @Parameter(description = "Updated comment details", required = true) @Valid @RequestBody
          CommentDto commentDto) {
    return ResponseEntity.ok(commentService.updateComment(id, commentDto));
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
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteComment(
      @Parameter(description = "ID of the comment to delete", required = true) @PathVariable
          Long id) {
    commentService.deleteComment(id);
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
    return ResponseEntity.ok(commentService.getCommentCountForPost(postId));
  }
}
