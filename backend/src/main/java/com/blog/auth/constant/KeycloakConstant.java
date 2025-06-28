package com.blog.auth.constant;

public final class KeycloakConstant {
    private KeycloakConstant() {}

    // Keycloak constants
    public static final String KEYCLOAK_REALM = "blog";
    public static final String KEYCLOAK_CLIENT = "blog-client";
    public static final String VERIFY_EMAIL = "VERIFY_EMAIL";
    public static final String UPDATE_PROFILE = "UPDATE_PROFILE";
    public static final String CONFIGURE_TOTP = "CONFIGURE_TOTP";
    public static final String UPDATE_PASSWORD = "UPDATE_PASSWORD";
    public static final String TERMS_AND_CONDITIONS = "TERMS_AND_CONDITIONS";
    public static final String DELETE_ACCOUNT = "DELETE_ACCOUNT";
    public static final String DELETE_CREDENTIAL = "DELETE_CREDENTIAL";
    public static final String UPDATE_USER_LOCALE = "UPDATE_USER_LOCALE";
    public static final String UPDATE_EMAIL = "UPDATE_EMAIL";
    public static final String CONFIGURE_RECOVERY_AUTHN_CODES = "CONFIGURE_RECOVERY_AUTHN_CODES";
    public static final String WEBAUTHN_REGISTER = "WEBAUTHN_REGISTER";
    public static final String WEBAUTHN_PASSWORDLESS_REGISTER = "WEBAUTHN_PASSWORDLESS_REGISTER";
    public static final String VERIFY_USER_PROFILE = "VERIFY_USER_PROFILE";
}


//Here's a breakdown of the Keycloak required actions enum:
//VERIFY_EMAIL: Requires the user to verify their email address.
//UPDATE_PROFILE: Forces the user to update their profile information (e.g., name, email, etc.).
//CONFIGURE_TOTP: Prompts the user to configure a one-time password (OTP) authenticator.
//UPDATE_PASSWORD: Requires the user to change their password.
//        TERMS_AND_CONDITIONS: Forces the user to accept the terms and conditions.
//        DELETE_ACCOUNT: Allows the user to delete their account.
//        DELETE_CREDENTIAL: Allows the user to delete a credential.
//        UPDATE_USER_LOCALE: Allows the user to update their locale.
//        UPDATE_EMAIL: Allows the user to update their email.
//        CONFIGURE_RECOVERY_AUTHN_CODES: Allows the user to configure recovery authentication codes.
//WEBAUTHN_REGISTER: Requires the user to register a WebAuthn authenticator.
//WEBAUTHN_PASSWORDLESS_REGISTER: Requires the user to register a WebAuthn passwordless authenticator.
//        VERIFY_USER_PROFILE: Allows the user to verify their profile.
//Customizing KeyCloak using Required Actions: A Top Security ...
