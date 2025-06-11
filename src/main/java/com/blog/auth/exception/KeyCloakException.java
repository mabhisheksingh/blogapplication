package com.blog.auth.exception;

import com.blog.sharedkernel.exception.BaseException;
import org.springframework.http.HttpStatus;

public class KeyCloakException extends BaseException {
  public KeyCloakException(
      String operationName, String fieldName, String userName, HttpStatus httpStatus) {
    super(
        httpStatus,
        "KEYCLOAK_ERROR",
        String.format(
            "Error while performing %s for user: '%s' on field: %s",
            operationName, userName, fieldName));
  }
}
