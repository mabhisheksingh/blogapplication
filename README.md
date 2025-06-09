# Blog Application (DDD Architecture)

A modern blog application built with Spring Boot 3.5.0 and Domain-Driven Design principles.

## Project Structure

The project follows Domain-Driven Design (DDD) principles with the following structure:

```
src/main/java/com/blog/
├── BlogApplication.java          # Main application class
│
├── domain/                       # Domain layer (business logic)
│   ├── model/                    # Domain entities and value objects
│   ├── repository/                # Domain repository interfaces
│   └── service/                  # Domain services
│
├── application/                 # Application layer (use cases)
│   ├── dto/                      # Data Transfer Objects
│   ├── service/                  # Application services
│   ├── command/                  # Command objects
│   └── query/                    # Query objects
│
└── infrastructure/              # Infrastructure layer
    ├── config/                   # Configuration classes
    ├── exception/                # Exception handling
    ├── persistence/              # Persistence implementation
    │   └── mapper/               # Object mappers (e.g., MapStruct)
    └── web/                      # Web controllers and REST endpoints
```

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

A modular blog application built with Spring Boot 3.5.0 and Java 17.

## Project Structure

This is a multi-module Maven project with the following modules:

1. **blog** - Main application module containing core blog functionality
2. **common-exceptions** - Shared exception handling and error responses
3. **keycloak** - Keycloak integration for authentication and authorization

## Prerequisites

- Java 17 or higher
- Maven 3.6.3 or higher
- PostgreSQL
- Keycloak (for authentication)

## Getting Started

1. Clone the repository
2. Configure your database in `application.yml`
3. Set up Keycloak and update the configuration
4. Run `mvn clean install` from the root directory
5. Start the application using `mvn spring-boot:run` in the blog module

## Features

- RESTful API for blog management
- JWT-based authentication with Keycloak
- Input validation
- Global exception handling
- OpenAPI documentation

## API Documentation

Once the application is running, you can access:
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/v3/api-docs

## Build & Run

```bash
mvn clean install
cd blog
mvn spring-boot:run
```
