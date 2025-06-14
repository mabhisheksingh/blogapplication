package com.blog.sharedkernel.exception;

import org.springframework.http.HttpStatus;

public class PostNotFoundException extends BaseException {
  public PostNotFoundException(String blogName, String fieldName, Object fieldValue) {
    super(
        HttpStatus.NOT_FOUND,
        "BLOG_NOT_FOUND",
        String.format("%s not found with %s: '%s'", blogName, fieldName, fieldValue));
  }
}
