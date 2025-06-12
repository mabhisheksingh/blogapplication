package com.blog.auth.exception;

import com.blog.sharedkernel.exception.BaseException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends BaseException {
  public UserNotFoundException(String userName) {
    super(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "User not found with %s:", userName);
  }
}
