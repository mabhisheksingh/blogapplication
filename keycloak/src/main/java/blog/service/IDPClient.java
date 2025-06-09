package blog.service;

import blog.dto.CreateUserDTO;

public interface IDPClient {

  CreateUserDTO createUser(CreateUserDTO createUserDTO);
}
