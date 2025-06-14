# My API
This is a sample Spring Boot 3.5 API with Swagger

## Version: 1.0

### /v1/api/user/users/{userId}

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

### /v1/api/blog/{id}

#### GET
##### Summary:

Get blog by ID

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

### /v1/api/blog/create

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

### /v1/api/blog

#### GET
##### Summary:

Get all blogs

##### Description:

Retrieves a list of all blog posts

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Successfully retrieved list of blogs |

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
