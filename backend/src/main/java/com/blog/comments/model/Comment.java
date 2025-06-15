package com.blog.comments.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a comment in the blog application. Comments can be either top-level or
 * replies to other comments.
 */
@Entity
@Table(name = "comments")
@Data
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class Comment extends BaseEntity {
  @Column(columnDefinition = "TEXT", nullable = false)
  private String comment;

  @Column(name = "author_username", nullable = false)
  private String authorUserName;

  @Column(name = "author_email")
  private String authorEmail;

  @Column(name = "post_id", nullable = false)
  private Long postId; // Reference to post in another module

  @Column(name = "is_edited", nullable = false)
  private Boolean isEdited;
}
