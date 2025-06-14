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
import {useKeycloak} from '@react-keycloak/web'

// Protected Route Component
const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.some(role => currentUser.roles?.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return children;
};
const { keycloak,initialized } = useKeycloak();
console.log(keycloak);
console.log(initialized);

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          
          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/new"
            element={
              <PrivateRoute requiredRoles={['USER', 'ADMIN','ROOT']}>
                <PostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute requiredRoles={['USER', 'ADMIN','ROOT']}>
                <PostForm isEditMode={true} />
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
