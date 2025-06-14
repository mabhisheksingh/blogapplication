import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    published: true,
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await postsAPI.getPostById(id);
          const post = response.data;
          
          // Verify if the current user is the author or admin
          if (post.author.id !== currentUser.id && !currentUser.roles?.includes('ROLE_ADMIN')) {
            navigate('/unauthorized', { replace: true });
            return;
          }
          
          setFormData({
            title: post.title,
            summary: post.summary,
            content: post.content,
            imageUrl: post.imageUrl || '',
            published: post.published,
          });
          
          if (post.imageUrl) {
            setPreview(post.imageUrl);
          }
        } catch (err) {
          console.error('Error fetching post:', err);
          setError('Failed to load post. Please try again.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchPost();
    }
  }, [id, isEditMode, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const postData = {
        ...formData,
        authorId: currentUser.id,
      };

      if (isEditMode) {
        await postsAPI.updatePost(id, postData);
      } else {
        await postsAPI.createPost(postData);
      }
      
      navigate('/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.response?.data?.message || 'Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }


  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate(-1)}
        >
          Cancel
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="summary">
              <Form.Label>Summary</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="A brief summary of your post"
                required
              />
              <Form.Text className="text-muted">
                A short summary that will appear in post previews.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your post content here..."
                required
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Featured Image</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="Paste image URL here"
              />
              <Form.Text className="text-muted">
                Or upload an image:
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="mt-2"
                />
              </Form.Text>
            </Form.Group>

            {preview && (
              <div className="mb-3">
                <p>Image Preview:</p>
                <img 
                  src={preview} 
                  alt="Preview" 
                  style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }} 
                />
              </div>
            )}

            <Form.Group className="mb-4" controlId="published">
              <Form.Check
                type="checkbox"
                name="published"
                label="Publish this post"
                checked={formData.published}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update Post' : 'Create Post'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostForm;
