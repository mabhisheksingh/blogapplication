package com.blog.sharedkernel.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
  private final LocalDateTime timestamp;
  private final int status;
  private final String error;
  private final String code;
  private final String message;
  private final Map<String, Object> details;

  public ErrorResponse(HttpStatus status, String code, String message, Object... args) {
    this.timestamp = LocalDateTime.now();
    this.status = status.value();
    this.error = status.getReasonPhrase();
    this.code = code;
    this.message = args.length > 0 ? String.format(message, args) : message;
    this.details = null;
  }

  public ErrorResponse(HttpStatus status, String code, String message) {
    this.timestamp = LocalDateTime.now();
    this.status = status.value();
    this.error = status.getReasonPhrase();
    this.code = code;
    this.message = message;
    this.details = null;
  }

  public ErrorResponse(
      HttpStatus status, String code, String message, Map<String, Object> details) {
    this.timestamp = LocalDateTime.now();
    this.status = status.value();
    this.error = status.getReasonPhrase();
    this.code = code;
    this.message = message;
    this.details = details;
  }
}
