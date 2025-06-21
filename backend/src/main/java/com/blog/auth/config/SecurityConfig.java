package com.blog.auth.config;

import com.blog.sharedkernel.exception.CustomAccessDeniedHandler;
import com.blog.sharedkernel.exception.CustomAuthenticationEntryPoint;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFilter;

@Configuration
@EnableWebSecurity // Enables Spring Security's web security features
@EnableMethodSecurity // Enables Spring Security's method-level security
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
    // Disable CSRF for API-only applications (common for REST APIs with token-based auth)
    http.csrf(AbstractHttpConfigurer::disable);
    http.cors(AbstractHttpConfigurer::disable);
    http.authorizeHttpRequests(
        authorize ->
            authorize
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll() // allow OPTIONS for CORS
                // Publicly accessible endpoints (no authentication required)
                .requestMatchers("/v1/api/public/**", "/v1/api/post/categories")
                .permitAll()
                .requestMatchers("/public/**", "/swagger-ui/**", "/v3/api-docs/**")
                .permitAll()
                // Comment endpoints - require authentication
                .requestMatchers(HttpMethod.GET, "/v1/api/comment/**", "/v1/api/post")
                .permitAll() // Allow reading comments without authentication
                // Admin endpoints
                .requestMatchers("/v1/api/admin/**")
                .hasAnyRole("ADMIN", "ROOT")
                .anyRequest()
                .authenticated() // All other requests require authentication
        );

    // ✅ Register your custom filter before Spring Security's auth filter
//    http.addFilterBefore(new AuthFilter(), AuthenticationFilter.class);// Enable to debug only
    // Enable custom authentication entry point and access denied handler
    http.exceptionHandling(
            ex ->
                ex.authenticationEntryPoint(customAuthenticationEntryPoint)
                    .accessDeniedHandler(customAccessDeniedHandler));
    // Enable OAuth2 Resource Server for JWT token validation
    http.oauth2ResourceServer(
        oauth -> oauth.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter())));

    return http.build();
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
    jwtConverter.setJwtGrantedAuthoritiesConverter(SecurityConfig::getGrantedAuthorities);
    return jwtConverter;
  }

  private static Collection<GrantedAuthority> getGrantedAuthorities(Jwt jwt) {
    Collection<GrantedAuthority> authorities = new ArrayList<>();
    Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get("realm_access");
    if (realmAccess != null && realmAccess.containsKey("roles")) {
      List<String> roles = (List<String>) realmAccess.get("roles");
      // Map all roles as-is (no ROLE_ prefix)
      authorities.addAll(
          roles.stream().map(role -> new SimpleGrantedAuthority("ROLE_" + role)).toList());
    }
    return authorities;
  }
}
