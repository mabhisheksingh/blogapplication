package com.blog.sharedkernel.event;

import java.util.function.Consumer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class LogEventManager {

  @Bean
  public Consumer<LogEventObject> logEvent() {
    return eventObj -> {
      log.info("logEvent called");
      Object obj = eventObj.getObject();
      String message = "NOT FOUND";
      if (obj instanceof String) {
        message = (String) obj;
      } else {
        message = obj.toString();
      }
      LogEventObject.LogLevel logLevel = eventObj.getLogLevel();
      // Use switch for logLevel
      switch (logLevel) {
        case INFO:
          log.info(message);
          break;
        case ERROR:
          log.error(message);
          break;
        case DEBUG:
          log.debug(message);
          break;
      }
    };
  }
}
