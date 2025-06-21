import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { usersAPI } from '../services/api';
import { Row, Col } from 'react-bootstrap';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    profileImage: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPhotoSizeError, setShowPhotoSizeError] = useState(false);
  const [showAgeError, setShowAgeError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPG and PNG formats are allowed.');
      return;
    }
    if (file.size > 512000) {
      setError('File size must be under 500KB.');
      setShowPhotoSizeError(true);
      return;
    }
    setShowPhotoSizeError(false);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, profileImage: reader.result }));
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }
    if (!formData.firstName) errors.firstName = 'First name is required.';
    if (!formData.username) {
      errors.username = 'Username is required.';
    } else if (!/^[a-zA-Z0-9._-]{3,255}$/.test(formData.username)) {
      errors.username = 'Username must be 3-255 characters, only letters, numbers, dot, underscore, or hyphen.';
    }
    if (!formData.password) errors.password = 'Password is required.';
    if (!formData.confirmPassword) errors.confirmPassword = 'Confirm password is required.';
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    if (formData.age && (parseInt(formData.age) < 1 || parseInt(formData.age) > 100)) {
      errors.age = 'Age must be between 1 and 100.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below.');
      return;
    }
    setError('');
    setShowAgeError(false);
    setLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      await usersAPI.createUserPublic(userData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="mt-5">
        <Alert variant="success">
          <h4 className="alert-heading">Registration Successful!</h4>
          <p>You will be redirected to the home page shortly...</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Create an Account</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required isInvalid={!!fieldErrors.email} />
                  {fieldErrors.email && <Form.Text style={{ color: 'red' }}>{fieldErrors.email}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control name="firstName" value={formData.firstName} onChange={handleChange} required isInvalid={!!fieldErrors.firstName} />
                  {fieldErrors.firstName && <Form.Text style={{ color: 'red' }}>{fieldErrors.firstName}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control name="lastName" value={formData.lastName} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control name="username" value={formData.username} onChange={handleChange} required isInvalid={!!fieldErrors.username} />
                  {fieldErrors.username && <Form.Text style={{ color: 'red' }}>{fieldErrors.username}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required isInvalid={!!fieldErrors.password} />
                  {fieldErrors.password && <Form.Text style={{ color: 'red' }}>{fieldErrors.password}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required isInvalid={!!fieldErrors.confirmPassword} />
                  {fieldErrors.confirmPassword && <Form.Text style={{ color: 'red' }}>{fieldErrors.confirmPassword}</Form.Text>}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" name="age" value={formData.age} onChange={handleChange} min="1" max="100" isInvalid={!!fieldErrors.age} />
                  {fieldErrors.age && <Form.Text style={{ color: 'red' }}>{fieldErrors.age}</Form.Text>}
                  {showAgeError && (
                    <Form.Text style={{ color: 'red', marginTop: 4 }}>
                      Age must be between 1 and 100.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Profile Image</Form.Label>
                  <Form.Control type="file" accept="image/jpeg,image/png" onChange={handleFileChange} ref={fileInputRef} />
                  {showPhotoSizeError && (
                    <Form.Text style={{ color: 'red' }}>
                      Profile image must be JPG/PNG and under 500KB.
                    </Form.Text>
                  )}
                  {formData.profileImage && (
                    <img src={formData.profileImage} alt="Preview" style={{ width: 80, height: 80, marginTop: 8, borderRadius: '50%' }} />
                  )}
                </Form.Group>
                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                    className="mt-3"
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Creating Account...
                      </>
                    ) : (
                      'Register'
                    )}
                  </Button>
                </div>
              </Form>
              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{' '}
                  <a href="#" onClick={e => { e.preventDefault(); window.location.href = '/login'; }}>Login</a>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
