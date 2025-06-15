package com.blog.comments.mapper;

import com.blog.comments.dto.request.CreateCommentDTO;
import com.blog.comments.dto.response.ResponseCommentDTO;
import com.blog.comments.model.Comment;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface CommentMapper {

  CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

  // Map from CreateCommentDTO → CommentEntity (for saving)
  @Mappings({
    @Mapping(target = "authorUserName", ignore = true),
    @Mapping(target = "authorEmail", ignore = true),
    @Mapping(target = "createdAt", ignore = true),
    @Mapping(target = "updatedAt", ignore = true),
    @Mapping(target = "isEdited", constant = "false")
  })
  Comment toEntity(CreateCommentDTO dto);

  // Map from CommentEntity → ResponseCommentDTO (for returning response)
  ResponseCommentDTO toResponseDto(Comment entity);
}
