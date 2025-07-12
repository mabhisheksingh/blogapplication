package com.blog.auth.api;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.response.KeycloakEventWrapper;
import com.blog.auth.service.EventService;
import com.blog.auth.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/v1/api/public")
@Tag(name = "Public", description = "APIs for public operations")
public class PublicController {
  private final UserService userService;
  private final EventService eventService;
  private final ObjectMapper objectMapper;

  @Autowired
  public PublicController(UserService userService, EventService eventService, ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
    this.userService = userService;
    this.eventService = eventService;
  }

  @PostMapping("/create-user")
  @Operation(summary = "Create user info")
  public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
    log.info("PublicController.createUser called");
    log.info("PublicController.createUser request: {}", createUserRequest);

    createUserRequest.setRole("USER");
    return ResponseEntity.ok(userService.createUser(createUserRequest));
  }

  @PostMapping("/handle-event")
  @Operation(
      summary = "Handle Keycloak events",
      description = "Processes events from Keycloak including user events (login, logout, registration, etc.) and admin events"
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "200",
          description = "Event processed successfully",
          content = @Content(mediaType = "application/json", schema = @Schema(implementation = String.class))
      ),
      @ApiResponse(
          responseCode = "400",
          description = "Invalid event format",
          content = @Content
      )
  })
  public ResponseEntity<String> handleEvent(@RequestBody String eventJson) {
    log.info("PublicController.handleEvent called");
    log.debug("Received event payload: {}", eventJson);
    
    try {
      // Parse the event wrapper to log the type before processing
      KeycloakEventWrapper wrapper = objectMapper.readValue(eventJson, KeycloakEventWrapper.class);
      log.info("PublicController.handleEvent processing event of type: {}", wrapper.getEventType());
      
      String result = eventService.processEvent(eventJson);
      log.info("PublicController.handleEvent completed successfully");
      return ResponseEntity.ok(result);
    } catch (Exception e) {
      log.error("PublicController.handleEvent error processing event: {}", e.getMessage(), e);
      return ResponseEntity.ok("Event received but processing failed: " + e.getMessage());
    }
  }
}
