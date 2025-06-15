package com.blog.posts.service;

import com.blog.posts.dto.response.CategoryDTO;
import java.util.List;

public interface CategoriesService {
  List<CategoryDTO> getAllCategories();
}
