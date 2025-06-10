/**
 * Module containing all comment-related functionality. This includes comment management,
 * moderation, and tree structure.
 */
@org.springframework.modulith.NamedInterface("comments")
@ApplicationModule(
    allowedDependencies = {
      "sharedkernel::sharedkernel.exception",
      "sharedkernel::sharedkernel.dto",
      "sharedkernel::sharedkernel.entity",
      "sharedkernel::sharedkernel.mapper"
    })
package com.blog.comments;

import org.springframework.modulith.ApplicationModule;
