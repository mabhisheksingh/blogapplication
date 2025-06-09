package blog.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NonNull;

@Data
@Builder
@AllArgsConstructor
public class CreateUserDTO {
  @NotBlank private String firstName;
  @NotBlank private String lastName;
  @Email @NotBlank private String email;

  @NotBlank private String password;
  @NotBlank @NonNull private String userName;
}
