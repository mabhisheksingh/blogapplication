package blog.exception;

import jakarta.validation.ConstraintViolation;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;

public class ValidationException extends BaseException {
  private final Set<String> validationErrors;

  public ValidationException(Set<? extends ConstraintViolation<?>> constraintViolations) {
    super(HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", "Validation failed");
    this.validationErrors =
        constraintViolations.stream()
            .map(cv -> String.format("%s: %s", cv.getPropertyPath(), cv.getMessage()))
            .collect(Collectors.toSet());
  }

  public Set<String> getValidationErrors() {
    return validationErrors;
  }
}
