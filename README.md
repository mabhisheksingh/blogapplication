# Blog Application

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
