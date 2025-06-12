# Blog Application API Documentation

This document provides comprehensive documentation for the Blog Application API, including all available endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:9001
```

## Authentication

All endpoints (except public ones) require authentication using JWT tokens from Keycloak. The application uses OAuth2 with the following configuration:

- **Issuer URI**: `http://localhost:9003/realms/fusion-master`
- **Client ID**: `blog-auth-private`
- **Client Secret**: `k94Hna2SQdRmEhgQqedOBh0LqvMxpFH7`
- **Grant Type**: `authorization_code`

### Obtaining an Access Token

1. **Get Authorization Code**
   ```
   GET http://localhost:9003/realms/fusion-master/protocol/openid-connect/auth?
     client_id=blog-auth-private&
     redirect_uri=http://localhost:9003/login/oauth2/code/keycloak&
     response_type=code&
     scope=openid
   ```

2. **Exchange Code for Token**
   ```
   POST http://localhost:9003/realms/fusion-master/protocol/openid-connect/token
   Content-Type: application/x-www-form-urlencoded
   
   grant_type=authorization_code&
   client_id=blog-auth-private&
   client_secret=k94Hna2SQdRmEhgQqedOBh0LqvMxpFH7&
   code=<authorization_code>&
   redirect_uri=http://localhost:9003/login/oauth2/code/keycloak
   ```

### Using the Access Token

Include the token in the `Authorization` header as follows:

```
Authorization: Bearer <your-jwt-token>
```

### Authentication Endpoints

| Method | Endpoint | Description | Authentication Required |
|--------|----------|-------------|-------------------------|
| `POST` | `/api/auth/login` | User login | No |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/refresh-token` | Refresh access token | Yes |
| `POST` | `/api/auth/logout` | Invalidate token | Yes |

## Blog Posts

### Get All Blog Posts

```http
GET /api/posts
```

**Query Parameters:**
- `page` (optional, default: 0)
- `size` (optional, default: 10)
- `sort` (optional, format: `field,asc|desc`)

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Sample Post",
      "content": "This is a sample blog post.",
      "author": "user@example.com",
      "createdAt": "2025-06-12T10:00:00Z",
      "updatedAt": "2025-06-12T10:00:00Z"
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "size": 10,
  "number": 0
}
```

### Get Blog Post by ID

```http
GET /api/posts/{id}
```

**Path Variables:**
- `id` (required): The ID of the blog post

**Response:**
```json
{
  "id": 1,
  "title": "Sample Post",
  "content": "This is a sample blog post.",
  "author": "user@example.com",
  "createdAt": "2025-06-12T10:00:00Z",
  "updatedAt": "2025-06-12T10:00:00Z"
}
```

### Create Blog Post

```http
POST /api/posts
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "Content of the new blog post."
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "title": "New Blog Post",
  "content": "Content of the new blog post.",
  "author": "user@example.com",
  "createdAt": "2025-06-12T11:00:00Z",
  "updatedAt": "2025-06-12T11:00:00Z"
}
```

### Update Blog Post

```http
PUT /api/posts/{id}
```

**Path Variables:**
- `id` (required): The ID of the blog post to update

**Request Body:**
```json
{
  "title": "Updated Blog Post",
  "content": "Updated content of the blog post."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Blog Post",
  "content": "Updated content of the blog post.",
  "author": "user@example.com",
  "createdAt": "2025-06-12T10:00:00Z",
  "updatedAt": "2025-06-12T12:00:00Z"
}
```

### Delete Blog Post

```http
DELETE /api/posts/{id}
```

**Path Variables:**
- `id` (required): The ID of the blog post to delete

**Response (204 No Content)**

## Comments

### Get Comments for Post

```http
GET /api/comments/post/{postId}
```

**Path Variables:**
- `postId` (required): The ID of the post

**Query Parameters:**
- `page` (optional, default: 0)
- `size` (optional, default: 10)

### Create Comment

```http
POST /api/comments
```

**Request Body:**
```json
{
  "postId": 1,
  "content": "This is a comment on the blog post.",
  "parentCommentId": null
}
```

## User Management

### Get Current User

```http
GET /api/users/me
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["ROLE_USER"]
}
```

### Update User

```http
PUT /api/users/{userId}
```

**Path Variables:**
- `userId` (required): The ID of the user to update

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com"
}
```

## Error Handling

All error responses follow this format:

```json
{
  "timestamp": "2025-06-12T13:45:30Z",
  "status": 404,
  "error": "Not Found",
  "message": "Blog post not found with id: 999",
  "path": "/api/posts/999"
}
```

## Rate Limiting

- Public endpoints: 100 requests per minute
- Authenticated endpoints: 1000 requests per minute
- Admin endpoints: 5000 requests per minute

## Versioning

API versioning is done through the URL path (e.g., `/api/v1/...`). The current version is `v1`.

## Testing the API

### Swagger UI
Access the interactive API documentation at:
```
http://localhost:9001/swagger-ui.html
```

### OpenAPI Documentation
View the raw OpenAPI specification at:
```
http://localhost:9001/v3/api-docs
```

### Testing with OAuth2 in Swagger UI

1. Click the "Authorize" button in Swagger UI
2. Enter the following details:
   - Client ID: `blog-auth-private`
   - Client Secret: `k94Hna2SQdRmEhgQqedOBh0LqvMxpFH7`
   - Token URL: `http://localhost:9003/realms/fusion-master/protocol/openid-connect/token`
   - Authorization URL: `http://localhost:9003/realms/fusion-master/protocol/openid-connect/auth`
3. Click "Authorize" and follow the OAuth2 flow

## Support

For support, please contact support@blogapp.com or open an issue in our GitHub repository.
