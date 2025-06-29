package com.blog.sharedkernel.exception;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {
  @Override
  public void handle(
      HttpServletRequest request,
      HttpServletResponse response,
      AccessDeniedException accessDeniedException)
      throws IOException, ServletException {
    log.info("CustomAccessDeniedHandler called ..");
    log.error(
        "AccessDeniedException failed: {}",
        accessDeniedException.getMessage(),
        accessDeniedException);
    // This catches Spring Security authentication errors
    response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access Denied");
  }
}
