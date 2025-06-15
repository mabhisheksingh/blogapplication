package com.blog.posts.repository;

import com.blog.posts.model.Tag;
import java.util.List;
import java.util.Set;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
  List<Tag> findByNameIn(Set<String> tagNames);
}
