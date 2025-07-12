package com.blog.auth.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.Map;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class KeycloakEventWrapper {
  private String eventType;
  private Map<String, Object> event;
}
