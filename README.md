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
- **User Management**: Complete user CRUD operations with role-based access control
- **Admin Dashboard**: Dedicated admin interface for user management
- **Keycloak Integration**: Seamless authentication and authorization with Keycloak
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **RESTful API**: Clean, resource-oriented API design
- **OpenAPI Documentation**: Auto-generated API documentation
- **Exception Handling**: Consistent error responses with proper HTTP status codes

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
