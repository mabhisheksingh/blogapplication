package com.blog.posts.service.impl;

import com.blog.posts.dto.request.PostDTO;
import com.blog.posts.dto.request.TagDTO;
import com.blog.posts.dto.response.ResponsePostDTO;
import com.blog.posts.mapper.CategoryResolver;
import com.blog.posts.mapper.PostMapper;
import com.blog.posts.model.Category;
import com.blog.posts.model.Post;
import com.blog.posts.model.Tag;
import com.blog.posts.repository.CategoryRepository;
import com.blog.posts.repository.PostRepository;
import com.blog.posts.repository.TagRepository;
import com.blog.posts.service.PostService;
import com.blog.sharedkernel.exception.PostNotFoundException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class PostServiceImpl implements PostService {
  private final CategoryRepository categoryRepository;
  private final PostRepository postRepository;
  private final PostMapper postMapper;
  private final CategoryResolver categoryResolver;
  private final TagRepository tagRepository;

  @Autowired
  public PostServiceImpl(
      TagRepository tagRepository,
      CategoryResolver categoryResolver,
      PostRepository postRepository,
      PostMapper postMapper,
      CategoryRepository categoryRepository) {
    this.postRepository = postRepository;
    this.postMapper = postMapper;
    this.categoryResolver = categoryResolver;
    this.tagRepository = tagRepository;
    this.categoryRepository = categoryRepository;
  }

  @Override
  public List<ResponsePostDTO> getAllPosts() {
    log.info("Fetching all posts");
    List<Post> blogs = postRepository.findAll();
    log.info("Fetched {} blogs", blogs.size());
    return blogs.stream().map(postMapper::toDto).collect(Collectors.toList());
  }

  @Override
  public ResponsePostDTO getPostById(Long id) {
    log.info("Fetching blog by id");
    log.debug("Fetching blog by id: {}", id);
    Post blog =
        postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("Blog", "id", id));
    log.debug("Fetched blog: {}", blog);
    return postMapper.toDto(blog);
  }

  @Override
  @Transactional
  public ResponsePostDTO createOrUpdatePost(PostDTO postDTO) {
    Set<String> tagNames =
        postDTO.getTags().stream().map(TagDTO::getName).collect(Collectors.toSet());
    List<Tag> existingTags = tagRepository.findByNameIn(tagNames);
    Map<String, Tag> existingTagMap =
        existingTags.stream().collect(Collectors.toMap(Tag::getName, Function.identity()));

    Set<Tag> tags = new HashSet<>();
    for (TagDTO tagDTO : postDTO.getTags()) {
      Tag tag = existingTagMap.get(tagDTO.getName());
      if (tag == null) {
        tag = new Tag();
        tag.setName(tagDTO.getName());
        tag.setDescription(tagDTO.getDescription());
        tag.setSlug(tagDTO.getSlug());
        tag = tagRepository.save(tag);
      }
      tags.add(tag);
    }

    Post post = postMapper.toEntity(postDTO, categoryResolver);
    post.setTags(tags);
    postRepository.save(post);
    var updatedPost = postRepository.save(post);

    return postMapper.toDto(updatedPost);
  }

  @Override
  @Transactional
  public ResponsePostDTO createOrUpdatePost(Long id, PostDTO postDTO) {
    log.info("Create or update Post method called");
    Post existingPost =
        postRepository.findById(id).orElseThrow(() -> new PostNotFoundException("id", "id", id));
    if (!Objects.equals(existingPost.getAuthorName(), postDTO.getAuthorUsername())) {
      throw new UnsupportedOperationException("Author name cannot be changed");
    }
    // update fields
    existingPost.setTitle(postDTO.getTitle());
    existingPost.setContent(postDTO.getContent());
    existingPost.setExcerpt(postDTO.getExcerpt());
    existingPost.setSlug(postDTO.getSlug());
    existingPost.setFeaturedImage(postDTO.getFeaturedImage());
    existingPost.setPublished(postDTO.isPublished());
    existingPost.setAuthorName(postDTO.getAuthorUsername());
    Set<Category> set =
        postDTO.getCategories().stream()
                .filter(Objects::nonNull)
            .map(categoryRepository::findById)
            .filter(Optional::isPresent)
            .map(Optional::get)
            .collect(Collectors.toSet());
    existingPost.setCategories(set);

    Set<String> tagNames =
        postDTO.getTags().stream().map(TagDTO::getName).collect(Collectors.toSet());
    List<Tag> existingTags = tagRepository.findByNameIn(tagNames);
    Map<String, Tag> existingTagMap =
        existingTags.stream().collect(Collectors.toMap(Tag::getName, Function.identity()));
    Set<Tag> tags = new HashSet<>();
    for (TagDTO tagDTO : postDTO.getTags()) {
      Tag tag = existingTagMap.get(tagDTO.getName());
      if (tag == null) {
        tag = new Tag();
        tag.setName(tagDTO.getName());
        tag.setDescription(tagDTO.getDescription());
        tag.setSlug(tagDTO.getSlug());
        tag = tagRepository.save(tag);
      }
      tags.add(tag);
    }

    existingPost.setTags(tags);

    Post updatedPost = postRepository.save(existingPost);

    return postMapper.toDto(updatedPost);
  }

  @Override
  public void deleteBlog(Long id) {
    postRepository.deleteById(id);
  }
}
