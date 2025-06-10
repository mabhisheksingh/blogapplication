package com.blog.posts.api;

import com.blog.posts.dto.BlogDTO;
import com.blog.posts.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/blogs")
@Tag(name = "Blog Controller", description = "APIs for managing blog posts")
public class BlogController {

  private final BlogService blogService;

  @GetMapping("/api/protected/posts")
  public String getProtectedPosts() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName(); // The subject of the JWT (e.g., 'user')
    System.out.println("Authenticated user: " + username);
    // If you need specific claims from the JWT
    if (authentication.getPrincipal() instanceof Jwt jwt) {
      String issuedBy = jwt.getIssuer().toString(); // The issuer (Auth Server)
      String email = jwt.getClaimAsString("email"); // Example custom claim
      System.out.println("Token issued by: " + issuedBy + ", User email: " + email);
    }

    return "This is a protected post list for " + username;
  }

  @Autowired
  public BlogController(BlogService blogService) {
    this.blogService = blogService;
  }

  @Operation(summary = "Get all blogs", description = "Retrieves a list of all blog posts")
  @ApiResponse(
      responseCode = "200",
      description = "Successfully retrieved list of blogs",
      content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE))
  @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<List<BlogDTO>> getAllBlogs() {
    List<BlogDTO> blogs = blogService.getAllBlogs();
    return ResponseEntity.ok(blogs);
  }

  @Operation(summary = "Get blog by ID", description = "Retrieves a specific blog post by its ID")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved blog post",
            content = @Content(schema = @Schema(implementation = BlogDTO.class))),
        @ApiResponse(responseCode = "404", description = "Blog post not found", content = @Content)
      })
  @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<BlogDTO> getBlogById(
      @Parameter(description = "ID of the blog post to be retrieved", required = true) @PathVariable
          Long id) {
    BlogDTO blog = blogService.getBlogById(id);
    return ResponseEntity.ok(blog);
  }

  @Operation(summary = "Create a new blog post", description = "Creates a new blog post")
  @ApiResponse(
      responseCode = "201",
      description = "Blog post created successfully",
      content = @Content(schema = @Schema(implementation = BlogDTO.class)))
  @PostMapping(
      path = "/p",
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<BlogDTO> createBlog(@Valid @RequestBody BlogDTO blogDTO) {
    BlogDTO createdBlog = blogService.createBlog(blogDTO);
    return ResponseEntity.status(HttpStatus.CREATED).body(createdBlog);
  }

  @Operation(summary = "Update a blog post", description = "Updates an existing blog post")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Blog post updated successfully",
            content = @Content(schema = @Schema(implementation = BlogDTO.class))),
        @ApiResponse(responseCode = "404", description = "Blog post not found", content = @Content)
      })
  @PutMapping(
      value = "/{id}",
      consumes = MediaType.APPLICATION_JSON_VALUE,
      produces = MediaType.APPLICATION_JSON_VALUE)
  public ResponseEntity<BlogDTO> updateBlog(
      @Parameter(description = "ID of the blog post to be updated", required = true) @PathVariable
          Long id,
      @io.swagger.v3.oas.annotations.parameters.RequestBody(
              description = "Updated blog post object",
              required = true,
              content = @Content(schema = @Schema(implementation = BlogDTO.class)))
          @RequestBody
          BlogDTO blogDTO) {
    BlogDTO updatedBlog = blogService.updateBlog(id, blogDTO);
    return ResponseEntity.ok(updatedBlog);
  }

  @Operation(summary = "Delete a blog post", description = "Deletes a specific blog post by its ID")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "Blog post deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Blog post not found")
      })
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBlog(
      @Parameter(description = "ID of the blog post to be deleted", required = true) @PathVariable
          Long id) {
    blogService.deleteBlog(id);
    return ResponseEntity.noContent().build();
  }
}
