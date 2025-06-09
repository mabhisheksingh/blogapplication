package com.blog.auth.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security features
@Slf4j
public class SecurityConfig {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(
            authorize ->
                authorize
                    // Publicly accessible endpoints (no authentication required)
                    .requestMatchers("/blogs1/**")
                    .permitAll() // Example: allow anyone to view posts
                    .requestMatchers("/api/comments", "/api/comments/{id}")
                    .permitAll() // Example: allow anyone to view comments
                    .requestMatchers("/public/**", "/swagger-ui/**", "/v3/api-docs/**")
                    .permitAll() // Common public paths
                    // Endpoints requiring specific roles or authentication
                    .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN") // Only ADMIN role can access admin endpoints
                    .requestMatchers("/api/users/me")
                    .authenticated() // User profile endpoint requires authentication
                    .requestMatchers("/api/comments")
                    .hasRole("USER") // Only authenticated USERs can create comments
                    .anyRequest()
                    .authenticated() // All other requests require authentication
            )
        // Enable OAuth2 Resource Server for JWT token validation
        .oauth2ResourceServer(
            oauth2ResourceServer -> oauth2ResourceServer.jwt(Customizer.withDefaults()));

    // Disable CSRF for API-only applications (common for REST APIs with token-based auth)
    http.csrf(AbstractHttpConfigurer::disable);

    return http.build();
  }
}
