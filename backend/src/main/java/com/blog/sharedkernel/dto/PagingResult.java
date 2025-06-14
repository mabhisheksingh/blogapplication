package com.blog.sharedkernel.dto;

import java.util.List;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PagingResult<T> {
  private List<T> content;
  private int totalPages;
  private long totalElements;
  private int size;
  private int page;
  private boolean empty;
}
