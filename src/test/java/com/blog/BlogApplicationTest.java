package com.blog;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

import static org.assertj.core.api.Assertions.*;

class BlogApplicationTest {

    @Test
    void verifyModularStructure() {
        // This will throw if there are any module violations
        ApplicationModules modules = ApplicationModules.of(BlogApplication.class);
        
        // Print all modules for debugging
        System.out.println("Detected modules:");
        modules.forEach(module -> {
            System.out.println("  - " + module.getName());
        });
        
        // This will throw if there are any violations
        modules.verify();
    }
}