package com.blog.posts.exception;

import com.blog.sharedkernel.exception.BaseException;
import org.springframework.http.HttpStatus;

public class BlogNotFoundException extends BaseException {
  public BlogNotFoundException(String blogName, String fieldName, Object fieldValue) {
    super(
        HttpStatus.NOT_FOUND,
        "BLOG_NOT_FOUND",
        String.format("%s not found with %s: '%s'", blogName, fieldName, fieldValue));
  }
}
