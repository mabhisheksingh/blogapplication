package com.blog.auth.model;

import com.blog.sharedkernel.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
public class User extends BaseEntity {

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = false)
  private String firstName;

  @Column(nullable = false, unique = true)
  private String keycloakId;

  @Column(nullable = false)
  private String lastName;

  @Column(nullable = false, unique = true)
  private String username;

  @Column(nullable = true)
  private String age;

  @Column(nullable = false)
  private String role;

  @Column(nullable = false)
  private Boolean isEnabled;

  @Lob
  @Column(name = "profile_image", columnDefinition = "TEXT")
  @Basic(fetch = FetchType.LAZY)
  @ToString.Exclude
  private String profileImage;
}
