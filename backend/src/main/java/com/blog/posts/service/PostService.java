package com.blog.posts.service;

import com.blog.posts.dto.request.PostDTO;
import com.blog.posts.dto.response.ResponsePostDTO;
import java.util.List;

public interface PostService {
  List<ResponsePostDTO> getAllPosts();

  ResponsePostDTO getPostById(Long id);

  ResponsePostDTO createOrUpdatePost(PostDTO postDTO);

  ResponsePostDTO createOrUpdatePost(Long id, PostDTO postDTO);

  void deleteBlog(Long id);
}
