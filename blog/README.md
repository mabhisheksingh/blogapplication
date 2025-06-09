# Blog Module

The main application module containing core blog functionality.

## Features

- Blog post management (CRUD operations)
- Category management
- Comment system
- User authentication and authorization
- RESTful API endpoints
- Input validation
- Global exception handling

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/{id}` - Get post by ID
- `POST /api/posts` - Create new post (requires authentication)
- `PUT /api/posts/{id}` - Update post (requires ownership or admin role)
- `DELETE /api/posts/{id}` - Delete post (requires ownership or admin role)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}/posts` - Get posts by category

## Configuration

### Required Environment Variables
```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/blogdb
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=yourpassword
KEYCLOAK_AUTH_SERVER_URL=http://localhost:8081/auth
KEYCLOAK_REALM=blog-realm
KEYCLOAK_RESOURCE=blog-client
```

## Running the Application

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will be available at `http://localhost:8080`
