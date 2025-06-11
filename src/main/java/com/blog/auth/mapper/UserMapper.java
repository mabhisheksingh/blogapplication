package com.blog.auth.mapper;

import com.blog.auth.dto.request.CreateUserRequest;
import com.blog.auth.dto.response.CreateUserResponse;
import com.blog.auth.model.User;
import java.util.Base64;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper
public interface UserMapper {

  //  @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
  //  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  // @Mapping(target = "profileImage", expression =
  // "java(Base64.getDecoder().decode(dto.getProfileImageBase64()))")
  CreateUserResponse toCreateUserResponse(User user);

  //  @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
  //  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  // @Mapping(target = "profileImage", expression =
  // "java(Base64.getDecoder().decode(dto.getProfileImageBase64()))")
  CreateUserResponse toCreateUserResponse(CreateUserRequest createUserRequest);

  @Mapping(target = "profileImage", source = "profileImage", qualifiedByName = "stringToByteArray")
  User toUser(CreateUserRequest createUserRequest);

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
