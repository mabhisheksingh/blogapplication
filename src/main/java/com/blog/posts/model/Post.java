package com.blog.posts.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;
import lombok.*;
import org.hibernate.annotations.Where;

@Entity
@Table(name = "posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Where(clause = "deleted = false")
public class Post extends BaseEntity {

  @Column(nullable = false)
  private String title;

  @Column(columnDefinition = "TEXT", nullable = false)
  private String content;

  @Column(name = "author_id", nullable = false)
  private String authorId;

  @Column(name = "slug", nullable = false, unique = true)
  private String slug;

  @Column(name = "featured_image")
  private String featuredImage;

  @Column(columnDefinition = "TEXT")
  private String excerpt;

  @Column(nullable = false, columnDefinition = "boolean default false")
  private boolean published = false;

  @Column(columnDefinition = "boolean default false")
  private boolean deleted = false;

  @ManyToMany
  @JoinTable(
      name = "post_categories",
      joinColumns = @JoinColumn(name = "post_id"),
      inverseJoinColumns = @JoinColumn(name = "category_id"))
  private Set<Category> categories = new HashSet<>();

  @ManyToMany
  @JoinTable(
      name = "post_tags",
      joinColumns = @JoinColumn(name = "post_id"),
      inverseJoinColumns = @JoinColumn(name = "tag_id"))
  private Set<Tag> tags = new HashSet<>();
}
