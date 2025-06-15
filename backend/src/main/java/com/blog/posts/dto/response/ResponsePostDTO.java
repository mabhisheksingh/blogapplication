package com.blog.posts.dto.response;

import com.blog.sharedkernel.dto.BaseDto;
import java.util.Set;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class ResponsePostDTO extends BaseDto {
  private String title;
  private String content;
  private String excerpt;
  private String slug;
  private String featuredImage;
  private boolean published;
  private String authorUsername;
  private Set<String> categories; // Simplified to names or ids if needed
  private Set<String> tags; // Simplified to names or ids if needed
  private int commentCount;
}
