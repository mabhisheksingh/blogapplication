package com.blog.sharedkernel.event;

public enum TopicNames {
  LOG_EVENT_OUT("logEvent-out-0"),
  KEYCLOAK_EVENT_OUT("keycloakEvent-out-0"),

  KEYCLOAK_EVENT_IN("keycloakEvent-in-0"), //    keycloakEvent-in-0;
  LOG_EVENT_IN("logEvent-in-0"); //    logEvent-in-0

  private final String topicName;

  TopicNames(String topicName) {
    this.topicName = topicName;
  }

  public String getTopicName() {
    return topicName;
  }
}
