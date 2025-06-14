package com.blog.comments.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import lombok.*;

/**
 * Entity representing a comment in the blog application. Comments can be either top-level or
 * replies to other comments.
 */
@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(callSuper = true)
public class Comment extends BaseEntity {
  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  @Column(name = "author_id", nullable = false)
  private String authorId;

  @Column(name = "author_name")
  private String authorName;

  @Column(name = "author_email")
  private String authorEmail;

  @Column(name = "post_id", nullable = false)
  private Long postId; // Reference to post in another module

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "parent_id")
  private Comment parent;

  @OneToMany(
      mappedBy = "parent",
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      fetch = FetchType.LAZY)
  @Builder.Default
  private Set<Comment> replies = new HashSet<>();

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Comment comment)) return false;
    if (!super.equals(o)) return false;
    return isApproved() == comment.isApproved()
        && Objects.equals(getContent(), comment.getContent())
        && Objects.equals(getAuthorId(), comment.getAuthorId())
        && Objects.equals(getAuthorName(), comment.getAuthorName())
        && Objects.equals(getAuthorEmail(), comment.getAuthorEmail())
        && Objects.equals(getPostId(), comment.getPostId());
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        super.hashCode(),
        getContent(),
        getAuthorId(),
        getAuthorName(),
        getAuthorEmail(),
        getPostId(),
        isApproved());
  }

  @Column(columnDefinition = "boolean default false")
  private boolean approved = false;
}
