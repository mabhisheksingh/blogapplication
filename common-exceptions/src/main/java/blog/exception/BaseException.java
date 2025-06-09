package blog.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class BaseException extends RuntimeException {
  private final HttpStatus status;
  private final String errorCode;
  private final String message;
  private final Object[] args;

  protected BaseException(HttpStatus status, String errorCode, String message, Object... args) {
    super(String.format(message, args));
    this.status = status;
    this.errorCode = errorCode;
    this.message = message;
    this.args = args;
  }

  protected BaseException(
      Throwable cause, HttpStatus status, String errorCode, String message, Object... args) {
    super(String.format(message, args), cause);
    this.status = status;
    this.errorCode = errorCode;
    this.message = message;
    this.args = args;
  }
}
