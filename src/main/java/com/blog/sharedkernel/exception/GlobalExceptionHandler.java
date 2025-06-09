package com.blog.sharedkernel.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler({BaseException.class})
  public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex) {
    log.error("Business exception occurred: {}", ex.getMessage(), ex);
    ErrorResponse errorResponse =
        new ErrorResponse(ex.getStatus(), ex.getErrorCode(), ex.getMessage(), ex.getArgs());
    return ResponseEntity.status(ex.getStatus()).body(errorResponse);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ErrorResponse> resourceNotFoundException(ResourceNotFoundException ex) {
    log.error("Resource not found: {}", ex.getMessage(), ex);
    ErrorResponse errorResponse =
        new ErrorResponse(ex.getStatus(), ex.getErrorCode(), ex.getMessage(), ex.getArgs());
    return ResponseEntity.status(ex.getStatus()).body(errorResponse);
  }

  @ExceptionHandler({ConstraintViolationException.class})
  public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex) {
    log.error("Constraint violation: {}", ex.getMessage(), ex);
    Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
    String message =
        violations.stream()
            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
            .collect(java.util.stream.Collectors.joining(", "));

    ErrorResponse errorResponse =
        new ErrorResponse(HttpStatus.BAD_REQUEST, "CONSTRAINT_VIOLATION", message);
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
  }

  @ExceptionHandler({RuntimeException.class})
  public ResponseEntity<Object> handleRuntimeException(RuntimeException exception) {
    log.error("Unexpected error occurred: {}", exception.getMessage(), exception);
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
  }

  @ExceptionHandler({Exception.class})
  public ResponseEntity<ErrorResponse> handleAllUncaughtException(Exception ex) {
    log.error("Unexpected error occurred: {}", ex.getMessage(), ex);
    ErrorResponse errorResponse =
        new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "INTERNAL_SERVER_ERROR",
            "An unexpected error occurred");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }
}
