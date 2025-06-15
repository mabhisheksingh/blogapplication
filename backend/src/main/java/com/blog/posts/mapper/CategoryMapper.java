package com.blog.posts.mapper;

import com.blog.posts.dto.response.CategoryDTO;
import com.blog.posts.model.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
  CategoryDTO toDto(Category category);

  Category toEntity(CategoryDTO dto);
}
