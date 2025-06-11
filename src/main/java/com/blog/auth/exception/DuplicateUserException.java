package com.blog.auth.exception;

import com.blog.sharedkernel.exception.BaseException;
import org.springframework.http.HttpStatus;

public class DuplicateUserException extends BaseException {
  public DuplicateUserException(String userName) {
    super(
        HttpStatus.CONFLICT, "DUPLICATE_USER", String.format("Duplicate user with %s:", userName));
  }
}
