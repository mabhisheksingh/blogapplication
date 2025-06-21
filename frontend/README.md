# Blog Application Frontend

This is the React frontend for the Blog Application. It interacts with a Spring Boot backend secured by Keycloak.

## Features
- User authentication with Keycloak
- Role-based access control (USER, ADMIN, ROOT)
- User listing and management (enable/disable, edit)
- Profile page with live user info from backend
- Global error handling with modal popup
- Modern UI with React Bootstrap

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm 8.x or higher

### Setup
```bash
cd frontend
npm install
```

### Configuration
Copy `.env.example` to `.env` and set your backend API URL (e.g. `VITE_API_URL=http://localhost:9001`)

### Running the App
```bash
npm run dev
```
The app will be available at http://localhost:5173

## Project Structure
```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # UI components (GlobalErrorModal, Navigation, etc.)
│   ├── context/      # Context providers (AuthContext, ErrorContext)
│   ├── pages/        # Pages (UserList, Profile, Posts, etc.)
│   ├── services/     # API service layer
│   └── App.jsx       # Main app component
├── package.json      # NPM dependencies
└── vite.config.js    # Vite config
```

## Key Files
- `src/pages/UserList.jsx`: User listing and management
- `src/pages/Profile.jsx`: Profile page, fetches user info by username
- `src/services/api.js`: API service with axios interceptors and user API methods
- `src/context/ErrorContext.jsx`: Global error handling
- `src/components/GlobalErrorModal.jsx`: Shows API errors in a modal

## Notes
- All API errors are shown in a global modal for consistent UX.
- User info on the profile page is always fetched from the backend using the username from the Keycloak token.
- Backend API must support `GET /v1/api/user/users/{username}` for user info fetch.

---
For backend/API docs, see the main project README and `backend/API_README.md`.
