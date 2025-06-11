package com.blog.sharedkernel.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "idp")
@Data
public class IDPConfigProperties {
  @NotBlank private String clientId;
  @NotBlank private String clientSecret;
  @NotBlank private String serverUri;
  @NotBlank private String realm;
  @NotBlank private String idpName;
  @NotBlank private String authorizationGrantType;
}
