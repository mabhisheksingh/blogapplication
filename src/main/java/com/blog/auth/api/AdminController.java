package com.blog.auth.api;

import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.service.AdminService;
import com.blog.auth.service.UserService;
import com.blog.sharedkernel.dto.PagingResult;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/** REST controller for administrative operations. Requires ADMIN role for all endpoints. */
@Slf4j
@RestController
@RequestMapping("/v1/api/admin")
@Tag(name = "Admin", description = "APIs for administrative operations")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

  private final UserService userService;

  private final AdminService adminService;

  @Autowired
  public AdminController(UserService userService, AdminService adminService) {
    this.userService = userService;
    this.adminService = adminService;
  }

  @Operation(
      summary = "Get all users without pagination",
      description = "Retrieves a list of all users without pagination. Requires ADMIN role.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved list of users",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CreateUserResponse.class, type = "array"))),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient privileges")
      })
  @GetMapping(value = "/users-without-page", produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<CreateUserResponse>> getAllUsers() {
    log.info("Fetching all users without pagination");
    List<CreateUserResponse> users = adminService.getAllUser();
    log.debug("Successfully fetched {} users", users.size());
    return ResponseEntity.ok(users);
  }

  @Operation(
      summary = "Get users with pagination",
      description = "Retrieves a paginated list of users. Requires ADMIN role.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved paginated users",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = PagingResult.class))),
        @ApiResponse(responseCode = "400", description = "Invalid pagination parameters"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient privileges")
      })
  @GetMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<PagingResult<CreateUserResponse>> getUsersWithPagination(
      @Parameter(description = "Page number (0-based)", example = "0")
          @RequestParam(defaultValue = "0")
          int page,
      @Parameter(description = "Number of items per page", example = "10")
          @RequestParam(defaultValue = "10")
          int size) {
    log.info("Fetching users with pagination - page: {}, size: {}", page, size);
    Pageable pageable = PageRequest.of(page, size);
    log.debug(
        "Created pageable - page: {}, size: {}, sort: {}",
        pageable.getPageNumber(),
        pageable.getPageSize(),
        pageable.getSort());

    PagingResult<CreateUserResponse> data = adminService.getAllUser(pageable);
    log.debug(
        "Retrieved {} users out of {} total", data.getContent().size(), data.getTotalElements());

    return ResponseEntity.ok(data);
  }

  @Operation(
      summary = "Get user by ID",
      description = "Retrieves a specific user by their ID. Requires ADMIN role.")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved user",
            content =
                @Content(
                    mediaType = "application/json",
                    schema = @Schema(implementation = CreateUserResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient privileges"),
        @ApiResponse(responseCode = "404", description = "User not found")
      })
  @GetMapping(value = "/users/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<CreateUserResponse> getUserById(
      @Parameter(description = "ID of the user to be retrieved", required = true, example = "1")
          @PathVariable
          Long id) {
    log.info("Fetching user by id: {}", id);
    CreateUserResponse user = userService.getUserById(id);
    return ResponseEntity.ok(user);
  }

  @Operation(
      summary = "Delete user by username",
      description = "Deletes a user by their username. Requires ADMIN role.")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "204", description = "User successfully deleted"),
        @ApiResponse(responseCode = "400", description = "Invalid username supplied"),
        @ApiResponse(responseCode = "401", description = "Unauthorized - Authentication required"),
        @ApiResponse(responseCode = "403", description = "Forbidden - Insufficient privileges"),
        @ApiResponse(responseCode = "404", description = "User not found")
      })
  @DeleteMapping("/users/{userName}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteUser(
      @Parameter(
              description = "Username of the user to be deleted",
              required = true,
              example = "john.doe")
          @PathVariable
          String userName) {
    log.info("Attempting to delete user with username: {}", userName);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).<Void>build();
  }
  //  @PutMapping("/users/{id}/role")
  //  @PreAuthorize("hasRole('ADMIN')")
  //  public ResponseEntity<CreateUserResponse> updateUserRole(
  //          @PathVariable Long id,
  //          @RequestParam String role) {
  //    return ResponseEntity.ok(userService.updateUserRole(id, role));
  //  }
  //  @GetMapping("/posts")
  //  @PreAuthorize("hasRole('ADMIN')")
  //  public ResponseEntity<Page<PostDto>> getAllPosts(Pageable pageable) {
  //    return ResponseEntity.ok(postService.getAllPostsForAdmin(pageable));
  //  }

  //  @DeleteMapping("/posts/{id}")
  //  @PreAuthorize("hasRole('ADMIN')")
  //  public ResponseEntity<ApiResponse> deletePost(@PathVariable Long id) {
  //    postService.deletePost(id);
  //    return ResponseEntity.ok(new ApiResponse(true, "Post deleted successfully"));
  //  }
}
