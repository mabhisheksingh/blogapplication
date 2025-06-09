# Keycloak Integration Module

This module contains the Keycloak configuration and security setup for the blog application.

## Features

- JWT-based authentication
- Role-based access control (RBAC)
- User management integration
- Secure API endpoints

## Configuration

### Keycloak Server Setup

1. Download and run Keycloak
2. Create a new realm (or use the master realm)
3. Create a new client with the following settings:
   - Client ID: `blog-client`
   - Client Protocol: `openid-connect`
   - Access Type: `confidential`
   - Valid Redirect URIs: `http://localhost:8080/*`
   - Web Origins: `*` (for development only)

### Application Properties

Update `application.yml` with your Keycloak configuration:

```yaml
keycloak:
  auth-server-url: http://localhost:8081/auth
  realm: blog-realm
  resource: blog-client
  credentials:
    secret: your-client-secret
  ssl-required: external
  use-resource-role-mappings: true
  bearer-only: true
```

## Security Configuration

The security configuration is set up to:
- Protect all API endpoints by default
- Allow public access to Swagger UI and API docs
- Enable CORS for development
- Validate JWT tokens
- Map Keycloak roles to Spring Security authorities

## Roles

- `ROLE_USER` - Regular authenticated user
- `ROLE_ADMIN` - Administrator with full access

## Testing Authentication

1. Get an access token:
```bash
curl -X POST 'http://localhost:8081/auth/realms/blog-realm/protocol/openid-connect/token' \
  --header 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'client_id=blog-client' \
  --data-urlencode 'grant_type=password' \
  --data-urlencode 'username=user' \
  --data-urlencode 'password=password' \
  --data-urlencode 'client_secret=your-client-secret'
```

2. Use the access token in API requests:
```
Authorization: Bearer <access_token>
```

## Development Notes

- For development, you can disable security by setting `keycloak.enabled=false`
- Always use HTTPS in production
- Rotate client secrets regularly
