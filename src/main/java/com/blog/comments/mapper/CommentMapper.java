package com.blog.comments.mapper;

import com.blog.comments.dto.CommentDto;
import com.blog.comments.model.Comment;
import com.blog.sharedkernel.mapper.BaseMapper;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(
    componentModel = "spring",
    nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
    uses = {},
    builder = @Builder(disableBuilder = true))
public interface CommentMapper extends BaseMapper<CommentDto, Comment> {

  @Override
  @Mapping(target = "id", source = "id")
  @Mapping(target = "createdAt", source = "createdAt")
  @Mapping(target = "updatedAt", source = "updatedAt")
  @Mapping(target = "replies", ignore = true)
  @Mapping(target = "parent", ignore = true) // Will be set manually in service
  Comment toEntity(CommentDto dto);

  @Override
  @Mapping(target = "parentId", source = "parent.id")
  @Mapping(target = "replies", ignore = true) // Will be set manually in service
  CommentDto toDto(Comment entity);

  @Override
  @Mapping(target = "id", ignore = true)
  @Mapping(target = "createdAt", ignore = true)
  @Mapping(target = "updatedAt", ignore = true)
  @Mapping(target = "replies", ignore = true)
  @Mapping(target = "parent", ignore = true) // Will be set manually in service
  void updateEntityFromDto(CommentDto dto, @MappingTarget Comment entity);

  /**
   * Creates a CommentMapper instance
   *
   * @return CommentMapper instance
   */
  static CommentMapper getInstance() {
    return Mappers.getMapper(CommentMapper.class);
  }
}
