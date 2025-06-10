/**
 * Module containing all post-related functionality including domain model, services, and APIs.
 * 
 * <p>This module depends on the sharedkernel module for common exceptions and utilities.
 */


@org.springframework.modulith.NamedInterface("posts")
@ApplicationModule(allowedDependencies = "sharedkernel::sharedkernel.exception")
package com.blog.posts;

import org.springframework.modulith.ApplicationModule;