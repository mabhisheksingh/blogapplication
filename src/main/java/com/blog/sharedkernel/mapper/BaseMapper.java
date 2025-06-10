package com.blog.sharedkernel.mapper;

import com.blog.sharedkernel.dto.BaseDto;
import com.blog.sharedkernel.entity.BaseEntity;

public interface BaseMapper<D extends BaseDto, E extends BaseEntity> {
  E toEntity(D dto);

  D toDto(E entity);

  void updateEntityFromDto(D dto, @org.mapstruct.MappingTarget E entity);
}
