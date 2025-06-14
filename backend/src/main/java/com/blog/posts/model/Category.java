package com.blog.posts.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {
  @Column(nullable = false, unique = true)
  private String name;

  private String description;

  @Column(unique = true, nullable = false)
  private String slug;
}
