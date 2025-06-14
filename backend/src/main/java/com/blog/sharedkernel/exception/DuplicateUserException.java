package com.blog.sharedkernel.exception;

import org.springframework.http.HttpStatus;

public class DuplicateUserException extends BaseException {
  public DuplicateUserException(String userName) {
    super(
        HttpStatus.CONFLICT, "DUPLICATE_USER", String.format("Duplicate user with %s:", userName));
  }
}
