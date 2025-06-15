package com.blog.posts;

import com.blog.posts.model.Category;
import com.blog.posts.repository.CategoryRepository;
import java.util.List;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StartupService {

  private final CategoryRepository categoryRepository;

  public StartupService(CategoryRepository categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  @Bean
  public ApplicationRunner initData() {
    return args -> {

      // Check if data already exists to avoid duplicate inserts
      if (categoryRepository.count() == 0) {
        List<Category> categories =
            List.of(
                new Category("General", "general", "General news and updates"),
                new Category("Politics", "politics", "Political news and updates"),
                new Category("Sports", "sports", "Sports news and updates"),
                new Category("Other", "other", "Other news and updates"),
                new Category("Technology", "technology", "All about technology"),
                new Category("Business", "business", "Business related articles"),
                new Category("Health", "health", "Health tips and articles"),
                new Category("Travel", "travel", "Travel experiences and guides"),
                new Category("Food", "food", "Recipes and food reviews"),
                new Category("Education", "education", "Educational content and tutorials"),
                new Category("Science", "science", "Scientific discoveries and news"),
                new Category("Entertainment", "entertainment", "Movies, shows and more"),
                new Category("Finance", "finance", "Personal finance and investments"));

        categoryRepository.saveAll(categories);
      }
    };
  }
}
