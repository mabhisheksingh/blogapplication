package com.blog.posts.mapper;

import com.blog.posts.dto.request.TagDTO;
import com.blog.posts.model.Tag;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface TagMapper {
  Tag toEntity(TagDTO dto);

  TagDTO toDto(Tag entity);

  @Named("mapTagToString")
  default String mapTagToString(Tag tag) {
    if (tag == null) return null;
    return tag.getName();
  }

  default Set<String> mapTagsToStrings(Set<Tag> tags) {
    if (tags == null) return null;
    return tags.stream().map(this::mapTagToString).collect(Collectors.toSet());
  }
}
