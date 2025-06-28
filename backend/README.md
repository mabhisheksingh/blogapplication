# Blog Application (DDD Architecture with Spring Modulith)

A modern blog application built with Spring Boot 3.5.0, Spring Modulith, and Domain-Driven Design principles.

## Project Structure

The project follows a modular architecture using Spring Modulith with the following modules:

```
com.blog
├── BlogApplication.java          # Main application class
│
├── sharedkernel/                # Shared kernel module (common components)
│   └── exception/               # Shared exceptions and base classes
│
├── posts/                      # Posts module
│   ├── api/                     # REST controllers
│   ├── dto/                     # Data Transfer Objects
│   ├── model/                   # Domain model
│   ├── repository/              # Data access
│   ├── service/                 # Business logic
│   └── mapper/                  # Object mapping
│
├── auth/                       # Authentication module
│   └── config/                  # Security configuration
│
├── comments/                   # Comments module (future)
└── search/                     # Search module (future)
```

## Version History

| Version | Date       | Description                                                                 |
|---------|------------|-----------------------------------------------------------------------------|
| v1.3.0  | 2025-06-21 | Centralized error handling, user info by username, improved docs             |
|         |            | - Frontend: Global error modal (React Context), user profile fetch by username|
|         |            | - Backend: GET /user/users/{username} endpoint, improved error JSON format   |
|         |            | - Docs: API_README.md and frontend/README.md updated                        |
| v1.2.0  | 2025-06-14 | Enhanced role-based access control and user management                    |
|         |            | - Added role-based access control for blog endpoints                       |
|         |            | - Implemented PublicController for user self-registration                  |
|         |            | - Improved error handling and validation in user management                |
| v1.1.1  | 2025-06-12 | Bug fixes and documentation updates                                        |
|         |            | - Updated README with latest version information                           |
|         |            | - Fixed minor issues in global exception handling                          |
| v1.1.0  | 2025-06-12 | Enhanced authentication and admin features                                  |
|         |            | - Added admin and user management controllers                               |
|         |            | - Implemented user CRUD operations with Keycloak integration               |
|         |            | - Added exception handling for user management                              |
|         |            | - Improved configuration management with IDP settings                       |
| v1.0.0  | 2025-06-10 | Initial stable release with Spring Modulith integration and basic blog features |
|         |            | - Modular architecture with posts, auth, and sharedkernel modules           |
|         |            | - JWT authentication support                                                |
|         |            | - Basic CRUD operations for blog posts                                      |

## Key Features

- **Modular Architecture**: Built with Spring Modulith for clear module boundaries
- **Role-Based Access Control**: Fine-grained access control with USER and ADMIN roles
- **User Management**: Complete user CRUD operations with role-based access control
- **Role field**: User API now returns a `role` field for each user, used for display and access logic in frontend
- **User listing sorting**: Users can be sorted by role and enabled status from the frontend UI
- **Self-Registration**: Public endpoint for user registration with USER role
- **Admin Dashboard**: Dedicated admin interface for user management
- **Keycloak Integration**: Seamless authentication and authorization with Keycloak
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **RESTful API**: Clean, resource-oriented API design
- **OpenAPI Documentation**: Auto-generated API documentation with Swagger UI
- **Comprehensive Exception Handling**: Consistent error responses with proper HTTP status codes

## Email Verification & Custom Keycloak Theme

- **UI & API Changes:**
  - User listing page now shows email verification status ("Verified" or "Verify Email" button)
  - Admins can resend verification emails from the UI
  - Backend exposes `GET /v1/api/admin/users/{username}/resend-email` for this purpose

- **Keycloak Theme:**
  - Place your theme in `backend/data/keycloak-theme/`
  - Includes branded HTML/text templates, CSS, images, and dummy JS
  - Add images in `img/` folder (e.g., `blog-logo.jpg`, `blog-community.jpg`)
  - Volume mapping in Docker Compose:
    ```yaml
    - ./data/keycloak-theme:/opt/keycloak/themes/keycloak-theme
    ```
  - Restart Keycloak container after updates
  - Set the email theme in Keycloak admin console

## UI, Backend, and Keycloak Theme Changes and Deployment Steps

### UI Changes

- User listing page now shows email verification status
- Admins can resend verification emails from the UI

### Backend Changes

- Exposes `GET /v1/api/admin/users/{username}/resend-email` for resending verification emails

### Keycloak Theme Changes

- Place your theme in `backend/data/keycloak-theme/`
- Includes branded HTML/text templates, CSS, images, and dummy JS
- Add images in `img/` folder (e.g., `blog-logo.jpg`, `blog-community.jpg`)

### Deployment Steps

1. Update your theme in `backend/data/keycloak-theme/`
2. Ensure Docker Compose has the volume mapping:
   ```yaml
   - ./data/keycloak-theme:/opt/keycloak/themes/keycloak-theme
   ```
3. Restart Keycloak container
4. Set the email theme in Keycloak admin console

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- PostgreSQL 14+
- Keycloak 21+ (for authentication)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-application
   ```

2. **Database Setup**
   The application uses PostgreSQL. Update the following in `application.yml` if needed:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/postgres
       username: postgres
       password: postgres
   ```

3. **Keycloak Configuration**
   The application is pre-configured to work with a Keycloak server running at `http://localhost:9003` with the following settings:
   - Realm: `fusion-master`
   - Client ID: `blog-auth-private`
   - Client Secret: `k94Hna2SQdRmEhgQqedOBh0LqvMxpFH7`
   
   Make sure your Keycloak server is running and the realm is properly configured before starting the application.

4. **Build and Run**
   ```bash
   # Build the application
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```
   The application will start on port `9001`.

## API Endpoints

### Authentication
- `POST /v1/api/public/create-user` - Register a new user (self-registration)
  - Requires: User details in request body
  - Returns: Created user details

### Admin Endpoints (Requires ADMIN role)
- `POST /v1/api/admin/create-user` - Create a new user with ADMIN role
- `GET /v1/api/admin/users` - List all users
- `GET /v1/api/admin/users/{id}` - Get user by ID
- `PUT /v1/api/admin/users/{id}` - Update user
- `DELETE /v1/api/admin/users/{id}` - Delete user

### Blog Endpoints
- `GET /v1/api/blog` - Get all blog posts (Requires USER role)
- `POST /v1/api/blog/create` - Create a new blog post (Requires USER role)
- `PUT /v1/api/blog/{id}` - Update a blog post (Requires USER role)
- `DELETE /v1/api/blog/{id}` - Delete a blog post (Requires ADMIN or USER role)

5. **Access the Application**
   - Application URL: http://localhost:9001
   - API Documentation: http://localhost:9001/swagger-ui.html
   - OpenAPI Specification: http://localhost:9001/v3/api-docs
   - Keycloak Admin Console: http://localhost:9003/admin

## Development

### Database
- Hibernate is configured with `ddl-auto: create-drop` for development
- SQL logging is enabled with formatted output
- Uses PostgreSQL dialect

### Logging
- Spring Framework: DEBUG
- Hibernate SQL: DEBUG
- SQL parameter binding: TRACE

### Development Tools
- Spring DevTools enabled for automatic application restart
- Docker Compose lifecycle management enabled

## Development

### Code Style

This project uses Google Java Format. To format your code:

```bash
mvn spotless:apply
```

### Testing

Run tests with:

```bash
mvn test
```

## Architecture

### Domain Layer
- Contains the core business logic and rules
- Includes entities, value objects, and domain services
- No dependencies on other layers

### Application Layer
- Orchestrates the flow of data between the domain and infrastructure layers
- Implements use cases
- Defines DTOs for data transfer

### Infrastructure Layer
- Handles technical concerns like:
  - Persistence (JPA repositories)
  - Web (REST controllers)
  - Security
  - External services

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
