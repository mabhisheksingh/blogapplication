package com.blog.posts.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tags")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag extends BaseEntity {
  @Column(nullable = false, unique = true)
  private String name;

  @Column(unique = true, nullable = false)
  private String slug;

  private String description;
}
