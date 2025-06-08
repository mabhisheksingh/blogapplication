package blog.service.impl;

import blog.dto.BlogDTO;
import blog.entity.Blog;
import blog.mapper.BlogMapper;
import blog.repository.BlogRepository;
import blog.service.BlogService;
import blog.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;
    private final BlogMapper blogMapper;

    @Autowired
    public BlogServiceImpl(BlogRepository blogRepository, BlogMapper blogMapper) {
        this.blogRepository = blogRepository;
        this.blogMapper = blogMapper;
    }

    @Override
    public List<BlogDTO> getAllBlogs() {
        List<Blog> blogs = blogRepository.findAll();
        return blogs.stream()
                .map(blogMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BlogDTO getBlogById(Long id) {
        Blog blog = blogRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Blog", "id", id)
        );
        return blogMapper.toDto(blog);
    }
    @Override
    public BlogDTO createBlog(BlogDTO blogDTO) {
        Blog blog = blogMapper.toEntity(blogDTO);
        blog = blogRepository.save(blog);
        return blogMapper.toDto(blog);
    }

    @Override
    public BlogDTO updateBlog(Long id, BlogDTO blogDTO) {
        Blog blog = blogRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Blog", "id", id)
        );
        blogMapper.updateEntityFromDto(blogDTO, blog);
        blog = blogRepository.save(blog);
        return blogMapper.toDto(blog);
    }

    @Override
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }


}
