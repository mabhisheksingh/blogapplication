package com.blog;

import static org.assertj.core.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class BlogApplicationTest {

  @Test
  void verifyModularStructure() {
    // This will throw if there are any module violations
    ApplicationModules modules = ApplicationModules.of(BlogApplication.class);

    // Print all modules for debugging
    System.out.println("Detected modules:");
    modules.forEach(
        module -> {
          System.out.println("  - " + module.getName());
        });

    // This will throw if there are any violations
    modules.verify();
  }
}
