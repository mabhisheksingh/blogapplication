package com.blog.posts.mapper;

import com.blog.posts.dto.BlogDTO;
import com.blog.posts.model.Blog;
import org.mapstruct.*;

@Mapper
public interface BlogMapper {

  BlogDTO toDto(Blog blog);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  Blog toEntity(BlogDTO blogDTO);

  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  void updateEntityFromDto(BlogDTO blogDTO, @MappingTarget Blog blog);
}
