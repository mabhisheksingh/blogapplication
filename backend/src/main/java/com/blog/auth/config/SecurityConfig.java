package com.blog.auth.config;

import com.blog.sharedkernel.exception.CustomAccessDeniedHandler;
import com.blog.sharedkernel.exception.CustomAuthenticationEntryPoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security features
@Slf4j
public class SecurityConfig {

  CustomAuthenticationEntryPoint customAuthenticationEntryPoint;
  CustomAccessDeniedHandler customAccessDeniedHandler;

  @Autowired
  public SecurityConfig(
      CustomAuthenticationEntryPoint customAuthenticationEntryPoint,
      CustomAccessDeniedHandler customAccessDeniedHandler) {
    this.customAuthenticationEntryPoint = customAuthenticationEntryPoint;
    this.customAccessDeniedHandler = customAccessDeniedHandler;
  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    log.info("Configuring SecurityFilterChain.");
    http.authorizeHttpRequests(
            authorize ->
                authorize
                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                    .permitAll() // allow OPTIONS for CORS
                    // Publicly accessible endpoints (no authentication required)
                    .requestMatchers("/v1/api/public/**")
                    .permitAll() // Example: allow anyone to view posts
                    .requestMatchers("/api/comments", "/api/comments/{id}")
                    .permitAll() // Example: allow anyone to view comments
                    .requestMatchers("/public/**", "/swagger-ui/**", "/v3/api-docs/**")
                    .permitAll() // Common public paths
                    // Endpoints requiring specific roles or authentication
                    .requestMatchers("/v1/api/admin/**")
                    .hasAnyRole(
                        "ADMIN", "ROOT") // Only ADMIN and ROOT role can access admin endpoints
                    .anyRequest()
                    .authenticated() // All other requests require authentication
            )
        .exceptionHandling(
            ex ->
                ex.authenticationEntryPoint(customAuthenticationEntryPoint)
                    .accessDeniedHandler(customAccessDeniedHandler))
        // Enable OAuth2 Resource Server for JWT token validation
        .oauth2ResourceServer(
            oauth2ResourceServer -> oauth2ResourceServer.jwt(Customizer.withDefaults()));

    // Disable CSRF for API-only applications (common for REST APIs with token-based auth)
    http.csrf(AbstractHttpConfigurer::disable);
    http.cors(cors -> cors.disable());

    return http.build();
  }
}
