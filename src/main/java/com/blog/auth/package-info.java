/** Module containing all authentication and authorization related functionality. */
@org.springframework.modulith.NamedInterface("auth")
@ApplicationModule(
    allowedDependencies = {
      "sharedkernel::sharedkernel.exception",
      "sharedkernel::sharedkernel.dto",
      "sharedkernel::sharedkernel.entity",
      "sharedkernel::sharedkernel.mapper",
      "sharedkernel::sharedkernel.config",
      "sharedkernel::sharedkernel.utils"
    })
package com.blog.auth;

import org.springframework.modulith.ApplicationModule;
