package com.blog.posts.service.impl;

import com.blog.posts.dto.response.CategoryDTO;
import com.blog.posts.mapper.CategoryMapper;
import com.blog.posts.repository.CategoryRepository;
import com.blog.posts.service.CategoriesService;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class CategoriesServiceImpl implements CategoriesService {

  private final CategoryRepository categoryRepository;
  private final CategoryMapper categoryMapper;

  @Autowired
  public CategoriesServiceImpl(
      CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
    this.categoryRepository = categoryRepository;
    this.categoryMapper = categoryMapper;
  }

  @Override
  @Transactional
  public List<CategoryDTO> getAllCategories() {
    log.info("Fetching all categories");
    return categoryRepository.findAll().stream().map(categoryMapper::toDto).toList();
  }
}
