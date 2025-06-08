package blog.service;

import blog.dto.CreateUserDTO;
import lombok.Data;

public interface IDPClient {

    CreateUserDTO createUser(CreateUserDTO createUserDTO);
}
