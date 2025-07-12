package com.blog.auth.service.impl;

import com.blog.auth.dto.response.KeycloakEventWrapper;
import com.blog.auth.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.events.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Implementation of the EventService for handling Keycloak events.
 */
@Slf4j
@Service
public class EventServiceImpl implements EventService {

  private final ObjectMapper objectMapper;

  @Autowired
  public EventServiceImpl(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  @Override
  public String processEvent(String eventJson) {
    log.info("EventServiceImpl.processEvent called");
    log.debug("Processing event payload: {}", eventJson);
    
    try {
      // Parse the event wrapper
      KeycloakEventWrapper wrapper = objectMapper.readValue(eventJson, KeycloakEventWrapper.class);
      log.debug("Parsed event wrapper: {}", wrapper);

      // Check the event type
      if ("USER_EVENT".equals(wrapper.getEventType())) {
        Map<String, Object> event = wrapper.getEvent();
        String eventType = (String) event.get("type");
        String userId = (String) event.get("userId");
        String realmId = (String) event.get("realmId");
        
        log.info("EventServiceImpl.processEvent received USER event: type={}, userId={}, realmId={}", 
            eventType, userId, realmId);
        log.debug("Full user event details: {}", event);

        // Process user event
        processUserEvent(event);
      } else if ("ADMIN_EVENT".equals(wrapper.getEventType())) {
        Map<String, Object> event = wrapper.getEvent();
        String operationType = (String) event.get("operationType");
        String resourcePath = (String) event.get("resourcePath");
        String realmId = (String) event.get("realmId");
        
        log.info("EventServiceImpl.processEvent received ADMIN event: operationType={}, resourcePath={}, realmId={}", 
            operationType, resourcePath, realmId);
        log.debug("Full admin event details: {}", event);

        // Process admin event
        processAdminEvent(event);
      } else {
        log.warn("EventServiceImpl.processEvent unknown event type: {}", wrapper.getEventType());
        log.debug("Unknown event details: {}", wrapper.getEvent());
      }
      log.info("EventServiceImpl.processEvent completed successfully");
      return eventJson;
    } catch (Exception e) {
      log.error("EventServiceImpl.processEvent error: {}", e.getMessage(), e);
      return "Event received but processing failed: " + e.getMessage();
    }
  }

  @Override
  public void processUserEvent(Map<String, Object> event) {
    // Implement user event processing logic here
    // For example:
    // - Store in database
    // - Send notifications
    // - Update user status
    String eventType = (String) event.get("type");
    String userId = (String) event.get("userId");

    log.info("EventServiceImpl.processUserEvent called: type={} for user={}", eventType, userId);
    log.debug("Full user event data: {}", event);

    // Handle specific event types
    if (EventType.LOGIN.toString().equals(eventType)) {
      log.info("EventServiceImpl.processUserEvent: User {} logged in", userId);
      // Update last login time, etc.
    } else if (EventType.LOGOUT.toString().equals(eventType)) {
      log.info("EventServiceImpl.processUserEvent: User {} logged out", userId);
      // Update session info, etc.
    } else if (EventType.REGISTER.toString().equals(eventType)) {
      log.info("EventServiceImpl.processUserEvent: User {} registered", userId);
      // Send welcome email, etc.
    } else if (EventType.UPDATE_PASSWORD.toString().equals(eventType)) {
      log.info("EventServiceImpl.processUserEvent: User {} updated password", userId);
      // Update password info, etc.
    } else if (EventType.CODE_TO_TOKEN.toString().equals(eventType)) {
      log.info("EventServiceImpl.processUserEvent: User {} code to token", userId);
      // Handle token exchange
    } else {
      log.warn("EventServiceImpl.processUserEvent: Unknown user event type: {}", eventType);
      log.debug("Unknown user event details: {}", event);
    }
    log.info("EventServiceImpl.processUserEvent completed for event type: {}", eventType);
  }

  @Override
  public void processAdminEvent(Map<String, Object> event) {
    // Implement admin event processing logic here
    String operationType = (String) event.get("operationType");
    String resourcePath = (String) event.get("resourcePath");

    log.info("EventServiceImpl.processAdminEvent called: operationType={} on resource={}", 
        operationType, resourcePath);
    log.debug("Full admin event data: {}", event);

    // Handle specific admin operations
    if ("CREATE".equals(operationType) && resourcePath.contains("users")) {
      log.info("EventServiceImpl.processAdminEvent: New user created via admin console");
      // Sync with your user database, etc.
    } else if ("UPDATE".equals(operationType) && resourcePath.contains("users")) {
      log.info("EventServiceImpl.processAdminEvent: User updated via admin console");
      // Update user info in your database, etc.
    }
    log.info("EventServiceImpl.processAdminEvent completed for operation: {}", operationType);
  }
}
