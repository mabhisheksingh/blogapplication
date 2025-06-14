import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, Tab, Tabs, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI, setupInterceptors, authAPI } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';
import { useAuth } from '../context/AuthContext.jsx';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const { keycloak, initialized } = useKeycloak();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  // Set up API interceptors when component mounts
  useEffect(() => {
    if (!initialized) return;
    
    // Set up API interceptors with keycloak
    const cleanup = setupInterceptors(keycloak);
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [keycloak, initialized]);

  // Memoize the fetch function to prevent recreation on each render
  const fetchUserPosts = useCallback(async () => {
    if (!keycloak.authenticated || !keycloak.tokenParsed?.sub) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the postsAPI directly - the interceptor will handle the token
      const response = await postsAPI.getAllPosts({ authorId: keycloak.tokenParsed.sub });
      setUserPosts(Array.isArray(response?.data) ? response.data : []);
      
    } catch (err) {
      console.error('Error fetching user posts:', err);
      
      // If we get 401, the interceptor should handle token refresh
      // If we still get here, it means refresh failed and we should redirect to login
      if (err.response?.status === 401) {
        keycloak.login();
        return;
      }
      
      setError('Failed to fetch your posts. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser, keycloak, postsAPI]);

  useEffect(() => {
    if (!initialized) return;
    
    // Redirect to login if not authenticated
    if (!keycloak.authenticated) {
      keycloak.login();
      return;
    }

    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        bio: currentUser.bio || '',
        // Don't reset passwords to avoid losing input
      }));
      
      fetchUserPosts();
    }
  }, [currentUser, initialized, keycloak, fetchUserPosts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        bio: formData.bio
      };

      // Only include password fields if they're being changed
      if (formData.currentPassword && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      // Get a fresh token before making the request
      try {
        await keycloak.updateToken(30);
      } catch (tokenError) {
        console.error('Failed to refresh token:', tokenError);
        keycloak.login();
        return;
      }

      // Call the update API
      const response = await authAPI.updateUser(currentUser.id, updateData);
      
      // Update the auth context with the new user data
      updateUser(response.data);
      
      // Show success message
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
    } catch (err) {
      console.error('Error updating profile:', err);
      
      // Handle token expiration
      if (err.response?.status === 401) {
        try {
          await keycloak.updateToken(30);
          // Retry the request
          return handleSubmit(e);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          keycloak.login();
          return;
        }
      }
      
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }


  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Profile</h1>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="profile" title="Profile">
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={handleProfileSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    disabled
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="bio">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="password" title="Change Password">
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={handlePasswordSubmit}>
                <Form.Group className="mb-3" controlId="currentPassword">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button variant="primary" type="submit" disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Tab>


        <Tab eventKey="posts" title="My Posts">
          <Card className="mt-3">
            <Card.Body>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : userPosts.length === 0 ? (
                <div className="text-center py-4">
                  <p>You haven't written any posts yet.</p>
                  <Button href="/posts/new" variant="primary">
                    Write Your First Post
                  </Button>
                </div>
              ) : (
                <div className="list-group">
                  {userPosts.map((post) => (
                    <div key={post.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{post.title}</h5>
                          <small className="text-muted">
                            {new Date(post.createdAt).toLocaleDateString()} • 
                            {post.published ? 'Published' : 'Draft'}
                          </small>
                        </div>
                        <div>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="me-2"
                            href={`/posts/${post.id}/edit`}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            href={`/posts/${post.id}`}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default Profile;
