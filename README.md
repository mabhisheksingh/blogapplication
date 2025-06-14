# Blog Application

A full-stack blog application with React frontend and Spring Boot backend.

## Project Structure

```
blogapplication/
├── backend/              # Spring Boot backend
│   ├── src/              # Source code
│   ├── pom.xml           # Maven configuration
│   └── mvnw              # Maven wrapper
└── frontend/             # React frontend
    ├── public/           # Static files
    ├── src/              # React source code
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   ├── utils/        # Utility functions
    │   ├── App.js        # Main App component
    │   └── index.js      # Entry point
    ├── package.json      # NPM dependencies
    └── README.md         # Frontend documentation
```

## Prerequisites

- Java 17 or higher
- Node.js 16.x or higher
- npm 8.x or higher
- MySQL 8.0 or higher (or your preferred database)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure your database in `src/main/resources/application.properties`

3. Build and run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

   The backend will be available at `http://localhost:8080`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Available Scripts

In the frontend directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Features

- User authentication (login/register)
- Create, read, update, and delete blog posts
- Comment on posts
- Responsive design
- Modern UI with React Bootstrap

## API Documentation

The API documentation is available at `http://localhost:8080/swagger-ui.html` when the backend is running.

## Deployment

### Backend

The backend can be deployed as a standard Spring Boot application. You can build a JAR file with:

```bash
./mvnw clean package
java -jar target/your-app-name.jar
```

### Frontend

To create a production build of the frontend:

```bash
npm run build
```

This will create a `build` directory with production-ready static files that can be served by any web server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
