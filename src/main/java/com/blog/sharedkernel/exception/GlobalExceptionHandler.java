package com.blog.sharedkernel.exception;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpClientErrorException;

@Slf4j
@RestControllerAdvice
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

  @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
  public ResponseEntity<String> handleUnauthorized(HttpClientErrorException.Unauthorized ex) {
    log.error("Unauthorized request: {}", ex.getMessage(), ex);
    // This catches 401 returned by RestTemplate / Feign etc.
    return new ResponseEntity<>("Unauthorized request", HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
    log.error("AccessDeniedException failed: {}", ex.getMessage(), ex);
    // This catches Spring Security authentication errors
    return new ResponseEntity<>("Authentication failed", HttpStatus.UNAUTHORIZED);
  }

  @ExceptionHandler(AuthenticationException.class)
  public ResponseEntity<String> handleAuthentication(AuthenticationException ex) {
    log.error("Authentication failed: {}", ex.getMessage(), ex);
    // This catches Spring Security authentication errors
    return new ResponseEntity<>("Authentication failed", HttpStatus.UNAUTHORIZED);
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

  @ExceptionHandler(JpaSystemException.class)
  public ResponseEntity<ErrorResponse> handleJpaSystemException(JpaSystemException ex) {
    log.error("JPA system error: {}", ex.getMessage(), ex);
    ErrorResponse errorResponse =
        new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "JPA_SYSTEM_ERROR",
            "An error occurred while processing your request");
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
  }

  @ExceptionHandler(JpaObjectRetrievalFailureException.class)
  public ResponseEntity<ErrorResponse> handleJpaObjectRetrievalFailure(
      JpaObjectRetrievalFailureException ex) {
    log.error("JPA object retrieval failure: {}", ex.getMessage(), ex);
    ErrorResponse errorResponse =
        new ErrorResponse(
            HttpStatus.NOT_FOUND, "ENTITY_NOT_FOUND", "The requested resource was not found");
    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
  }

  @ExceptionHandler({
    OptimisticLockingFailureException.class,
    ObjectOptimisticLockingFailureException.class
  })
  public ResponseEntity<ErrorResponse> handleOptimisticLockingFailure(RuntimeException ex) {
    log.error("Optimistic locking failure: {}", ex.getMessage(), ex);
    ErrorResponse errorResponse =
        new ErrorResponse(
            HttpStatus.CONFLICT,
            "OPTIMISTIC_LOCKING_FAILURE",
            "The data was updated by another user. Please refresh and try again.");
    return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
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
