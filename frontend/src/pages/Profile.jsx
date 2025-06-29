import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert, Tab, Tabs, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI, setupInterceptors, authAPI, usersAPI } from '../services/api';
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
    userId: '',
    username: '',
    firstName: '',
    lastName: '',
    keycloakId: '',
    isEnabled: '',
    age: '',
    profileImage: '',
    role: ''
  });
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
        role: currentUser.role || '',
        // Don't reset passwords to avoid losing input
      }));
      
      fetchUserPosts();
    }
  }, [currentUser, initialized, keycloak, fetchUserPosts]);

  useEffect(() => {
    if (!initialized || !keycloak?.authenticated) return;
    // Always fetch user info using username from keycloak token
    const username = keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.username || currentUser?.username;
    if (!username) return;
    usersAPI.getUserByUsername(username)
      .then(res => {
        const user = res.data;
        setFormData(prev => ({
          ...prev,
          userId: user.userId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          keycloakId: user.keycloakId,
          isEnabled: user.isEnabled,
          age: user.age,
          profileImage: user.profileImage,
          role: user.role
        }));
      });
  }, [initialized, keycloak, currentUser]);

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

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG formats are allowed.');
      return;
    }
    if (file.size > 512000) {
      setError('File size must be under 500KB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
      setSuccess('Profile image updated (not yet saved to server).');
      setProfileImageChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileImage = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Always send all profile fields, using updated values or defaults
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        isEnabled: formData.isEnabled,
        role: formData.role,
        profileImage: formData.profileImage
      };
      await usersAPI.updateUser(formData.userId, updateData);
      setSuccess('Profile image saved successfully!');
      setProfileImageChanged(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save profile image');
    } finally {
      setSaving(false);
    }
  };

  const filteredPosts = userPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Card className="mb-4 position-relative">
            <Card.Body>
              <Row>
                <Col md={2} className="text-center">
                  {formData.profileImage ? (
                    <img src={formData.profileImage} alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#eee', display: 'inline-block' }} />
                  )}
                  <Form className="mt-3">
                    <Form.Group>
                      <Form.Label visuallyHidden>Upload Profile Image</Form.Label>
                      <Form.Control type="file" accept="image/jpeg,image/png" onChange={handleProfileImageChange} />
                    </Form.Group>
                  </Form>
                </Col>
                <Col md={10}>
                  <h5>{formData.firstName} {formData.lastName} ({formData.username})</h5>
                  <div>Email: {formData.email}</div>
                  <div>User ID: {formData.userId}</div>
                  <div>Keycloak ID: {formData.keycloakId}</div>
                  <div>Status: {formData.isEnabled ? 'Enabled' : 'Disabled'}</div>
                  <div>Age: {formData.age ?? ''}</div>
                  <div>Role: {formData.role}</div>
                </Col>
              </Row>
              {profileImageChanged && (
                <div style={{ position: 'absolute', right: 30, bottom: 30, zIndex: 10 }}>
                  <Button variant="primary" onClick={handleSaveProfileImage} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="password" title="Change Password">
          <Card className="mt-3">
            <Card.Body>
              <Form onSubmit={(e) => handleProfileSubmit(e)}>
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
              {/* Search Bar for Posts */}
              <Form className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Search my posts..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </Form>
              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-4">
                  <p>You haven't written any posts yet.</p>
                  <Button href="/posts/new" variant="primary">
                    Write Your First Post
                  </Button>
                </div>
              ) : (
                <div className="list-group">
                  {filteredPosts.map((post) => (
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
