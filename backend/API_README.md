# Blog Application API

This is the backend API for the Blog Application, built with Spring Boot 3.5 and secured with Keycloak.

## Base URL
`http://localhost:9001/v1/api`

## Authentication
All endpoints except `/public/**` require authentication. Include a valid JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

## Version: 1.0

## Table of Contents
- [Posts API](#posts-api)
- [Categories API](#categories-api)
- [User Management](#user-management)
- [Authentication](#authentication)

## Posts API

### Get All Posts
`GET /post`

**Description**: Retrieves a list of all blog posts

**Authentication**: Required (USER, ADMIN, or ROOT role)

**Query Parameters**:
- `page` - Page number (default: 0)
- `size` - Number of items per page (default: 10)
- `sort` - Sort by field (e.g., `createdAt,desc`)

**Response**:
```json
[
  {
    "id": 1,
    "title": "Sample Post",
    "summary": "A brief summary",
    "content": "Full post content...",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z",
    "authorUsername": "user1",
    "categories": ["Technology", "Programming"],
    "tags": ["java", "spring"]
  }
]
```

### Get Post by ID
`GET /post/{id}`

**Description**: Retrieves a specific blog post by its ID

**Parameters**:
- `id` (path, required): The ID of the post to retrieve

**Authentication**: Public (comments require authentication)

**Response**:
```json
{
  "id": 1,
  "title": "Sample Post",
  "summary": "A brief summary",
  "content": "Full post content...",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2023-01-01T00:00:00Z",
  "updatedAt": "2023-01-01T00:00:00Z",
  "authorUsername": "user1",
  "categories": ["Technology", "Programming"],
  "tags": ["java", "spring"]
}
```

### Create Post
`POST /post/create`

**Description**: Creates a new blog post

**Authentication**: Required (USER role or higher)

**Request Body**:
```json
{
  "title": "New Post",
  "summary": "A brief summary",
  "content": "Full post content...",
  "imageUrl": "https://example.com/image.jpg",
  "published": true,
  "categories": ["Technology"],
  "tags": ["java"]
}
```

**Response**:
```json
{
  "id": 1,
  "title": "New Post",
  "summary": "A brief summary",
  "content": "Full post content...",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2023-01-01T00:00:00Z",
  "authorUsername": "currentUser"
}
```

### Update Post
`PUT /post/{id}`

**Description**: Updates an existing blog post

**Authentication**: Required (must be the post author or ADMIN/ROOT)

**Parameters**:
- `id` (path, required): The ID of the post to update

**Request Body**: Same as Create Post

**Response**: Updated post details

### Delete Post
`DELETE /post/{id}`

**Description**: Deletes a blog post

**Authentication**: Required (must be the post author or ADMIN/ROOT)

**Parameters**:
- `id` (path, required): The ID of the post to delete

**Response**: 204 No Content

## Categories API

### Get All Categories
`GET /post/categories`

**Description**: Retrieves a list of all available categories

**Authentication**: Public

**Response**:
```json
[
  "Technology",
  "Programming",
  "Lifestyle",
  "Travel"
]
```

## User Management

### Get Current User
`GET /user/me`

**Description**: Gets the currently authenticated user's details

**Authentication**: Required

**Response**:
```json
{
  "id": 1,
  "username": "user1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["USER"],
  "enabled": true
}
```

### Update User
`PUT /user/users/{userId}`

**Description**: Updates a user's information

**Authentication**: Required (must be the same user or ADMIN/ROOT)

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "new.email@example.com"
}
```

## Authentication

### Login
`POST /auth/login`

**Description**: Authenticates a user and returns JWT tokens

**Request Body**:
```json
{
  "username": "user1",
  "password": "password123"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "token_type": "bearer"
}
```

### Refresh Token
`POST /auth/refresh`

**Description**: Refreshes an access token using a refresh token

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**: Same as Login response

#### GET
##### Summary:

Get user by ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | path |  | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

#### PUT
##### Summary:

Update user info

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /v1/api/post/{id}

#### GET
##### Summary:

Get post by ID

##### Description:

Retrieves a specific blog post by its ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of the blog post to be retrieved | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved blog post |
| 404 | Blog post not found |

#### PUT
##### Summary:

Update a blog post

##### Description:

Updates an existing blog post

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of the blog post to be updated | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Blog post updated successfully |
| 404 | Blog post not found |

#### DELETE
##### Summary:

Delete a blog post

##### Description:

Deletes a specific blog post by its ID

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of the blog post to be deleted | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Blog post deleted successfully |
| 404 | Blog post not found |

### /api/comments/{id}

#### PUT
##### Summary:

Update a comment

##### Description:

Updates an existing comment by ID. Only the comment owner or admin can update a comment.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of the comment to update | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Comment updated successfully |
| 400 | Invalid input |
| 404 | Comment not found |

#### DELETE
##### Summary:

Delete a comment

##### Description:

Deletes a comment by ID. Only the comment owner or admin can delete a comment.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of the comment to delete | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | Comment deleted successfully |
| 404 | Comment not found |

### /v1/api/public/create-user

#### POST
##### Summary:

Create user info

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /v1/api/post/create

#### POST
##### Summary:

Create a new blog post

##### Description:

Creates a new blog post

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Blog post created successfully |

### /v1/api/admin/create-user

#### POST
##### Summary:

Create user info

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /api/comments

#### POST
##### Summary:

Create a new comment

##### Description:

Creates a new comment on a blog post. Can be either a top-level comment or a reply to an existing comment.

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | Comment created successfully |
| 400 | Invalid input |

### /v1/api/post

#### GET
##### Summary:

Get all posts

##### Description:

Retrieves a list of all blog posts

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved list of blogs |

### /v1/api/post/categories

#### GET
##### Summary:

Get all categories

##### Description:

Retrieves a list of all categories

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved list of categories |

### /v1/api/admin/users

#### GET
##### Summary:

Get users with pagination

##### Description:

Retrieves a paginated list of users. Requires ADMIN role.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| page | query | Page number (0-based) | No | integer |
| size | query | Number of items per page | No | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved paginated users |
| 400 | Invalid pagination parameters |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient privileges |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /v1/api/admin/users/{id}

#### GET
##### Summary:

Get user by ID

##### Description:

Retrieves a specific user by their ID. Requires ADMIN role.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| id | path | ID of the user to be retrieved | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved user |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient privileges |
| 404 | User not found |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /v1/api/admin/users-without-page

#### GET
##### Summary:

Get all users without pagination

##### Description:

Retrieves a list of all users without pagination. Requires ADMIN role.

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved list of users |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient privileges |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |

### /api/comments/post/{postId}

#### GET
##### Summary:

Get paginated comments for a post

##### Description:

Retrieves a paginated list of comments for a specific blog post.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| postId | path | ID of the post to retrieve comments for | Yes | long |
| pageable | query | Pagination and sorting parameters | Yes | [Pageable](#Pageable) |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved comments |
| 400 | Invalid post ID |

### /api/comments/post/{postId}/tree

#### GET
##### Summary:

Get comment tree for a post

##### Description:

Retrieves all comments for a post in a hierarchical tree structure with replies nested under their parent comments.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| postId | path | ID of the post to retrieve comment tree for | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved comment tree |

### /api/comments/post/{postId}/count

#### GET
##### Summary:

Get comment count for a post

##### Description:

Returns the total number of comments for a specific blog post.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| postId | path | ID of the post to get comment count for | Yes | long |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved comment count |

### /v1/api/admin/users/{userName}

#### DELETE
##### Summary:

Delete user by username

##### Description:

Deletes a user by their username. Requires ADMIN role.

##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userName | path | Username of the user to be deleted | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 204 | User successfully deleted |
| 400 | Invalid username supplied |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient privileges |
| 404 | User not found |

##### Security

| Security Schema | Scopes |
| --- | --- |
| bearerAuth | |
