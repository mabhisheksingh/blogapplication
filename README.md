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
| v1.0.0  | 2025-06-10 | Initial stable release with Spring Modulith integration and basic blog features |
|         |            | - Modular architecture with posts, auth, and sharedkernel modules           |
|         |            | - JWT authentication support                                                |
|         |            | - Basic CRUD operations for blog posts                                      |

## Key Features

- **Modular Architecture**: Built with Spring Modulith for clear module boundaries
- **JWT Authentication**: Secure API endpoints with JWT tokens
- **RESTful API**: Clean, resource-oriented API design
- **OpenAPI Documentation**: Auto-generated API documentation
- **Exception Handling**: Consistent error responses with proper HTTP status codes

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- PostgreSQL
- Keycloak (for authentication)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-application
   ```

2. **Configure the database**
   Update `application.yml` with your database credentials:
   ```yaml
   spring:
     datasource:
       url: jdbc:postgresql://localhost:5432/blogdb
       username: postgres
       password: yourpassword
   ```

3. **Set up Keycloak**
   - Run Keycloak server
   - Create a new realm and client
   - Update `application.yml` with your Keycloak configuration

4. **Build and run the application**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Access the application**
   - API Documentation: http://localhost:8080/swagger-ui.html
   - API Spec: http://localhost:8080/v3/api-docs

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
