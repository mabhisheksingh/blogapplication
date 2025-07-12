package com.blog.sharedkernel.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LogEventObject {
  private LogLevel logLevel;
  private Object object;

  public enum LogLevel {
    INFO,
    ERROR,
    DEBUG
  }
}
