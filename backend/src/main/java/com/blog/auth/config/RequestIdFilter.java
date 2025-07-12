package com.blog.auth.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
@Order(-100)
public class RequestIdFilter extends OncePerRequestFilter {

  private static final String REQUEST_ID_HEADER = "X-Request-Id";

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    String requestId = request.getHeader(REQUEST_ID_HEADER);
    if (requestId == null || requestId.isEmpty()) {
      requestId = UUID.randomUUID().toString();
    }
    // Add to response header
    response.setHeader(REQUEST_ID_HEADER, requestId);
    // Optionally, set in request attribute for downstream use
    request.setAttribute(REQUEST_ID_HEADER, requestId);
    // Put requestId in MDC for logging
    MDC.put(REQUEST_ID_HEADER, requestId);
    try {
      filterChain.doFilter(request, response);
    } finally {
      MDC.remove(REQUEST_ID_HEADER); // Clean up after request
    }
  }
}
