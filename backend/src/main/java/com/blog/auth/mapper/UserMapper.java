package com.blog.auth.mapper;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.request.UpdateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.model.User;
import java.util.Base64;

import org.mapstruct.*;

@Mapper
public interface UserMapper {

  @Mappings({
      @Mapping(target = "userId", source = "id")
  })
  CreateUserResponse toCreateUserResponse(User user);

  User toUser(UpdateUserRequest updateUserRequest);


  CreateUserResponse toCreateUserResponse(CreateUserRequest createUserRequest);

  @Mapping(target = "profileImage", source = "profileImage", qualifiedByName = "stringToByteArray")
  @Mapping(target = "isEnabled",defaultValue = "true")
  @Mapping(target = "isEmailVerified",defaultValue = "false")
  User toUser(CreateUserRequest createUserRequest);

  @Mapping(target = "profileImage", source = "profileImage", qualifiedByName = "stringToByteArray")
  @Mapping(target = "id",source = "userId")
  User toUser(CreateUserResponse createUserResponse);

  @AfterMapping
  default void mapId(CreateUserResponse dto, @MappingTarget User entity) {
    entity.setId(dto.getUserId()); // manually set ID from DTO to BaseEntity field
  }
  @Named("stringToByteArray")
  default byte[] stringToByteArray(String value) {
    if (value == null || value.trim().isEmpty()) {
      return null;
    }
    try {
      return Base64.getDecoder().decode(value);
    } catch (IllegalArgumentException e) {
      // If not valid Base64, try to get bytes directly
      return value.getBytes();
    }
  }

  // helper methods for byte[] <-> String
  default String map(byte[] value) {
    return value != null ? Base64.getEncoder().encodeToString(value) : null;
  }

  default byte[] map(String value) {
    return value != null ? Base64.getDecoder().decode(value) : null;
  }
}
