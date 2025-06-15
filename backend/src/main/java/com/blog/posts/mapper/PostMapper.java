package com.blog.posts.mapper;

import com.blog.posts.dto.request.PostDTO;
import com.blog.posts.dto.response.ResponsePostDTO;
import com.blog.posts.model.Category;
import com.blog.posts.model.Post;
import com.blog.posts.model.Tag;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

@Mapper(
    componentModel = "spring",
    uses = {CategoryMapper.class, TagMapper.class})
public interface PostMapper {

  @Mapping(target = "categories", source = "categories")
  @Mapping(target = "tags", source = "tags")
  Post toEntity(PostDTO postDTO, @Context CategoryResolver categoryResolver);

  @Mapping(target = "categories", expression = "java(mapCategoryNames(post.getCategories()))")
  @Mapping(target = "tags", expression = "java(mapTagNames(post.getTags()))")
  ResponsePostDTO toDto(Post post);

  default Set<String> mapTagNames(Set<Tag> tags) {
    if (tags == null) return null;
    return tags.stream().map(Tag::getName).collect(Collectors.toSet());
  }

  default Set<String> mapCategoryNames(Set<Category> categories) {
    if (categories == null) return null;
    return categories.stream().map(Category::getName).collect(Collectors.toSet());
  }

  default Set<Long> mapCategoriesToIds(Set<Category> categories) {
    if (categories == null) return null;
    return categories.stream().map(Category::getId).collect(Collectors.toSet());
  }

  default Set<Category> mapCategoryIdsToEntities(
      Set<Long> ids, @Context CategoryResolver categoryResolver) {
    if (ids == null) return null;
    return ids.stream().map(categoryResolver::findById).collect(Collectors.toSet());
  }

  // MapStruct will automatically map tags because we have nested TagDTO

  @BeforeMapping
  default void handleCategories(
      PostDTO dto, @MappingTarget Post entity, @Context CategoryResolver categoryResolver) {
    entity.setCategories(mapCategoryIdsToEntities(dto.getCategories(), categoryResolver));
  }
}
