package com.blog.posts.mapper;

import com.blog.posts.model.Category;
import com.blog.posts.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoryResolver {

  @Autowired private CategoryRepository categoryRepository;

  public Category findById(Long id) {
    return categoryRepository
        .findById(id)
        .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
  }
}
