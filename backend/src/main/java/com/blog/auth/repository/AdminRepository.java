package com.blog.auth.repository;

import com.blog.auth.model.User;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<User, Long> {
  Page<User> findAll(Pageable pageable);

  Optional<User> findByUsername(String username);
}
