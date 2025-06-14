package com.blog.comments.repository;

import com.blog.comments.model.Comment;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
  Page<Comment> findByPostId(Long postId, Pageable pageable);

  List<Comment> findByPostIdAndParentIsNull(Long postId);

  Long countByPostId(Long postId);

  Long countByPostIdAndApprovedTrue(Long postId);
}
