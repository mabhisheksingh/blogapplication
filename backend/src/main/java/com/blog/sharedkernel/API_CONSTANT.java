package com.blog.sharedkernel;

public enum API_CONSTANT {
  V1("/api/v1"),
  V2("/api/v2");

  private final String value;

  API_CONSTANT(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
