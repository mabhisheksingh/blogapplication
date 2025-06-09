# Common Exceptions Module

This module provides shared exception handling and error response structures for the blog application.

## Features

- Global exception handling with `@ControllerAdvice`
- Custom exception classes
- Standardized error response format
- Validation error handling

## Exception Classes

### BaseException
Base class for all custom exceptions with status code and error code support.

### ResourceNotFoundException
Thrown when a requested resource is not found (HTTP 404).

## Error Response Format

All error responses follow this structure:

```json
{
  "status": 404,
  "error": "NOT_FOUND",
  "message": "The requested resource was not found",
  "path": "/api/posts/123",
  "timestamp": "2025-06-09T06:23:12.123456Z"
}
```

## Usage

### Throwing Custom Exceptions

```java
throw new ResourceNotFoundException("Post", "id", postId);
```

### Handling Validation Errors

Validation errors are automatically handled and return a 400 Bad Request with details:

```json
{
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title cannot be blank"
    },
    {
      "field": "content",
      "message": "Content cannot be empty"
    }
  ]
}
```

## Dependencies

- Spring Boot Starter Web
- Spring Boot Starter Validation
- Lombok
