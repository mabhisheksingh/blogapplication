import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import PostForm from './pages/PostForm';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected Route Component
const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ from: window.location.pathname }} replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(role => currentUser.roles?.includes(role))) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          <h4>Access Denied</h4>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/posts/new"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
