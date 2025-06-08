package blog.service;

import blog.dto.BlogDTO;

import java.util.List;

public interface BlogService {
    List<BlogDTO> getAllBlogs();
    
    BlogDTO getBlogById(Long id);
    
    BlogDTO createBlog(BlogDTO blogDTO);
    
    BlogDTO updateBlog(Long id, BlogDTO blogDTO);
    
    void deleteBlog(Long id);
}