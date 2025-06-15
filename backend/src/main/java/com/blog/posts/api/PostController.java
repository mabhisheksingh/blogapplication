package com.blog.posts.api;

import com.blog.posts.dto.request.PostDTO;
import com.blog.posts.dto.response.ResponsePostDTO;
import com.blog.posts.service.CategoriesService;
import com.blog.posts.service.PostService;
import com.blog.sharedkernel.utils.UserUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/api/post")
@Tag(name = "Post Controller", description = "APIs for managing blog posts")
@Slf4j
public class PostController {
  private final PostService postService;
  private final CategoriesService categoriesService;

  @Autowired
  public PostController(PostService postService, CategoriesService categoriesService) {
    this.postService = postService;
    this.categoriesService = categoriesService;
  }

  @Operation(summary = "Get all posts", description = "Retrieves a list of all blog posts")
  @ApiResponse(
      responseCode = "200",
      description = "Successfully retrieved list of blogs",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @GetMapping
  @PreAuthorize("hasRole('USER') or hasRole('ADMIN') or hasRole('ROOT')")
  public ResponseEntity<List<ResponsePostDTO>> getAllBlogs() {
    log.info("Fetching all postDTOS");
    List<ResponsePostDTO> postDTOS = postService.getAllPosts();
    log.debug("Successfully fetched {} postDTOS", postDTOS);
    return ResponseEntity.ok(postDTOS);
  }

  @Operation(summary = "Get post by ID", description = "Retrieves a specific blog post by its ID")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved blog post",
            content = @Content(schema = @Schema(implementation = ResponsePostDTO.class))),
        @ApiResponse(responseCode = "404", description = "Blog post not found", content = @Content)
      })
  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<ResponsePostDTO> getPostById(
      @Parameter(description = "ID of the blog post to be retrieved", required = true) @PathVariable
          Long id) {
    log.info("getPostById called");
    log.debug("Fetching blog post by id: {}", id);
    ResponsePostDTO post = postService.getPostById(id);
    log.debug("Successfully fetched blog post: {}", post);
    return ResponseEntity.ok(post);
  }

  @Operation(summary = "Create a new blog post", description = "Creates a new blog post")
  @ApiResponse(
      responseCode = "201",
      description = "Blog post created successfully",
      content = @Content(schema = @Schema(implementation = PostDTO.class)))
  @PostMapping(path = "/create")
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<ResponsePostDTO> createBlog(@Valid @RequestBody PostDTO postDto) {
    log.info("PostController createOrUpdatePost called");
    UserUtils.getLoggedInUsername()
        .ifPresentOrElse(postDto::setAuthorUsername, () -> postDto.setAuthorUsername("anonymous"));

    log.info("Creating blog post: {}", postDto);
    ResponsePostDTO createdBlog = postService.createOrUpdatePost(postDto);
    log.info("Successfully created blog post: {}", createdBlog);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdBlog);
  }

  @Operation(summary = "Update a blog post", description = "Updates an existing blog post")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Blog post updated successfully",
            content = @Content(schema = @Schema(implementation = ResponsePostDTO.class))),
        @ApiResponse(responseCode = "404", description = "Blog post not found", content = @Content)
      })
  @PutMapping(
      value = "/{id}",
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('USER')")
  public ResponseEntity<ResponsePostDTO> updatePost(
      @Parameter(description = "ID of the blog post to be updated", required = true) @PathVariable
          Long id,
      @RequestBody PostDTO blogDTO) {
    log.info("UpdatePost called");
    log.debug("Updating blog post with id: {}", id);
    ResponsePostDTO updatedBlog = postService.createOrUpdatePost(id, blogDTO);
    log.debug("Successfully updated blog post: {}", updatedBlog);
    return ResponseEntity.ok(updatedBlog);
  }

  @Operation(summary = "Delete a blog post", description = "Deletes a specific blog post by its ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Blog post deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Blog post not found")
      })
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
  public ResponseEntity<Void> deleteBlog(
      @Parameter(description = "ID of the blog post to be deleted", required = true) @PathVariable
          Long id) {
    postService.deleteBlog(id);
    return ResponseEntity.noContent().build();
  }

  @Operation(summary = "Get all categories", description = "Retrieves a list of all categories")
  @ApiResponse(
      responseCode = "200",
      description = "Successfully retrieved list of categories",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @GetMapping("/categories")
  public ResponseEntity<?> getAllCategories() {
    return ResponseEntity.ok(categoriesService.getAllCategories());
  }
}
