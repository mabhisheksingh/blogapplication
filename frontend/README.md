# Blog Application Frontend

This is the React frontend for the Blog Application. It interacts with a Spring Boot backend secured by Keycloak.

## Features
- User authentication with Keycloak (login, logout, registration)
- Role-based access control (USER, ADMIN, ROOT)
- User listing and management:
  - View all users with sorting (by role, enabled status, email verification)
  - Enable/disable users (with permission checks)
  - Delete users (with confirmation)
  - View and sort by email verification status
  - Resend email verification (admin only)
  - Visual status: green "Verified" or yellow "Verify Email" button
- Profile page:
  - View and edit profile details (name, email, bio, profile image, age)
  - Change password
  - View own posts
- Registration page:
  - Custom registration form with validation (email, password, age, profile image upload)
  - JPG/PNG profile image upload with size/type validation
- Modern UI with React Bootstrap
- Global error handling with modal popup
- Loading and error states for all major actions
- Responsive design for desktop and mobile

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
- `src/pages/UserList.jsx`: User listing and management (sort by role and enabled status)
- `src/pages/Profile.jsx`: Profile page, fetches user info by username (shows role)
- `src/services/api.js`: API service with axios interceptors and user API methods
- `src/context/ErrorContext.jsx`: Global error handling
- `src/components/GlobalErrorModal.jsx`: Shows API errors in a modal

## Email Verification UI
- User listing page displays email verification status ("Verified" or "Verify Email" button)
- Admins can resend verification emails directly from the UI
- Loading and error handling for resend actions
- Sorting by email verification status is supported

## Backend Integration
- Calls `GET /v1/api/admin/users/{username}/resend-email` to trigger verification email
- See backend docs for more details

## Notes
- All API errors are shown in a global modal for consistent UX.
- User info on the profile page is always fetched from the backend using the username from the Keycloak token.
- Backend API must support `GET /v1/api/user/users/{username}` for user info fetch.

---
For backend/API docs, see the main project README and `backend/API_README.md`.
