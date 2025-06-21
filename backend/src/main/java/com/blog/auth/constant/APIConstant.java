package com.blog.auth.constant;

import java.util.Set;

public class APIConstant {

    private APIConstant() {}

    public static final String API_VERSION = "v1";
    public static final String AUTH_API = "/api/" + API_VERSION + "/auth";
    public static final String ROOT_USER_NAME = "root";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_USER = "USER";
    public static final String ROLE_ROOT = "ROOT";
    public static final String ROLE_NOT_FOUND = "Role not found";
    public static final Set<String> ALLOWED_ROLES = Set.of(ROLE_ADMIN, ROLE_USER, ROLE_ROOT);
}
