package com.blog.auth.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User extends BaseEntity {

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = false)
  private String role;

  @Column(nullable = false)
  private String password;

  @Column(nullable = true)
  private String age;

  @Lob
  @Column(name = "profile_image", columnDefinition = "TEXT")
  @Basic(fetch = FetchType.LAZY)
  private String profileImage;
}
