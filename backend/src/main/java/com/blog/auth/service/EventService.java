package com.blog.auth.service;

import com.blog.auth.dto.response.KeycloakEventWrapper;
import java.util.Map;

/**
 * Service for handling Keycloak events.
 */
public interface EventService {
  
  /**
   * Process a Keycloak event.
   *
   * @param eventJson The raw event JSON string
   * @return The processed event as a string
   */
  String processEvent(String eventJson);
  
  /**
   * Process a user event.
   *
   * @param event The user event data
   */
  void processUserEvent(Map<String, Object> event);
  
  /**
   * Process an admin event.
   *
   * @param event The admin event data
   */
  void processAdminEvent(Map<String, Object> event);
}
