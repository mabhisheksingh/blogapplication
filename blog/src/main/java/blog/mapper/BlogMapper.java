package blog.mapper;

import blog.dto.BlogDTO;
import blog.entity.Blog;
import java.time.LocalDateTime;
import org.mapstruct.*;
import org.springframework.stereotype.Component;

@Mapper(
    componentModel = "spring",
    imports = {LocalDateTime.class})
@Component
public abstract class BlogMapper {

  public BlogDTO toDto(Blog blog) {
    if (blog == null) {
      return null;
    }

    BlogDTO.BlogDTOBuilder blogDTO = BlogDTO.builder();
    blogDTO.id(blog.getId());
    blogDTO.title(blog.getTitle());
    blogDTO.content(blog.getContent());
    blogDTO.createdAt(blog.getCreatedAt());
    blogDTO.updatedAt(blog.getUpdatedAt());

    return blogDTO.build();
  }

  public Blog toEntity(BlogDTO blogDTO) {
    if (blogDTO == null) {
      return null;
    }

    Blog.BlogBuilder blog = Blog.builder();
    blog.title(blogDTO.getTitle());
    blog.content(blogDTO.getContent());
    blog.createdAt(LocalDateTime.now());
    blog.updatedAt(LocalDateTime.now());

    return blog.build();
  }

  public void updateEntityFromDto(BlogDTO blogDTO, Blog blog) {
    if (blogDTO == null) {
      return;
    }

    if (blogDTO.getTitle() != null) {
      blog.setTitle(blogDTO.getTitle());
    }
    if (blogDTO.getContent() != null) {
      blog.setContent(blogDTO.getContent());
    }
    blog.setUpdatedAt(LocalDateTime.now());
  }
}
