import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { postsAPI, setupInterceptors } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';
import { useAuth } from '../context/AuthContext.jsx';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const PostForm = ({ isEditMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const { currentUser } = useAuth();
  
  // Initialize form data with all required fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    imageUrl: '',
    published: true,
    categories: [], // This will store category IDs
    tags: []
  });
  
  // Debug effect to log form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [tagInput, setTagInput] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  // Fetch available categories on component mount
  useEffect(() => {
    let isMounted = true;
    let cleanup;
    
    const fetchCategories = async () => {
      cleanup = setupInterceptors(keycloak);
      
      try {
        setLoadingCategories(true);
        const response = await postsAPI.getCategories();
        
        if (!isMounted) return;
        
        // Transform categories to {value, label} format for react-select
        const formattedCategories = response.data
          .filter(cat => cat && cat.id) // Ensure we only have valid categories
          .map(cat => ({
            value: cat.id,
            label: cat.name || `Category ${cat.id}`
          }));
          
        setAvailableCategories(formattedCategories);
        
        // If we're in edit mode, we'll handle post data in the other effect
        if (isEditMode && id) {
          return;
        }
        
        // For new posts, ensure we have empty selected categories
        setSelectedCategories([]);
        
      } catch (err) {
        console.error('Error fetching categories:', err);
        if (isMounted) {
          setError('Failed to load categories. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();
    
    return () => {
      isMounted = false;
    };
  }, [isEditMode]);

  // Load post data when in edit mode and categories are available
  useEffect(() => {
    if (!isEditMode || !id || availableCategories.length === 0) return;
    
    let isMounted = true;
    const cleanup = setupInterceptors(keycloak);
    
    const fetchPostData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch the post data
        const response = await postsAPI.getPostById(id);
        if (!isMounted) return;
        
        const post = response.data;
        console.log('Fetched post data:', post);
        
        // Verify if the current user is the author or admin
        if (post.authorUsername !== currentUser.username && !currentUser.roles?.includes('ROLE_ADMIN')) {
          navigate('/unauthorized', { replace: true });
          return;
        }
        
        // Get category IDs from the post
        const postCategoryIds = [];
        const postCategories = [];
        
        if (Array.isArray(post.categories)) {
          post.categories.forEach(cat => {
            if (typeof cat === 'object' && cat.id) {
              // Handle case where category is an object with id and name
              const numId = Number(cat.id);
              if (!isNaN(numId) && numId > 0) {
                postCategoryIds.push(numId);
                const foundCat = availableCategories.find(c => Number(c.value) === numId);
                if (foundCat) {
                  postCategories.push(foundCat);
                }
              }
            } else if (typeof cat === 'string') {
              // Handle case where category is a string (name)
              const foundCat = availableCategories.find(ac => ac.label === cat);
              if (foundCat) {
                const numId = Number(foundCat.value);
                if (!postCategoryIds.includes(numId)) {
                  postCategoryIds.push(numId);
                  postCategories.push(foundCat);
                }
              }
            } else if (typeof cat === 'number') {
              // Handle case where category is a number (ID)
              const numId = Number(cat);
              if (!isNaN(numId) && numId > 0 && !postCategoryIds.includes(numId)) {
                postCategoryIds.push(numId);
                const foundCat = availableCategories.find(c => Number(c.value) === numId);
                if (foundCat) {
                  postCategories.push(foundCat);
                }
              }
            }
          });
        }
        
        console.log('Setting form data with categories:', {
          originalCategories: post.categories,
          postCategories,
          postCategoryIds,
          availableCategories: availableCategories.map(c => ({value: c.value, label: c.label}))
        });
        
        // Create a complete form data object with all fields
        console.log("excerpt : "+ post.title)
        console.log("excerpt : "+ Object.keys(post))
        const formDataUpdate = {
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          featuredImage: post.featuredImage || post.imageUrl || '',
          imageUrl: post.imageUrl || post.featuredImage || '',
          published: post.published !== undefined ? post.published : true,
          categories: postCategoryIds,
          tags: Array.isArray(post.tags) 
            ? post.tags.map(tag => typeof tag === 'object' ? tag.name : tag)
            : []
        };
        
        console.log('Updating form data with:', formDataUpdate);
        
        // Update the form state in a single batch
        setFormData(formDataUpdate);
        setSelectedCategories(postCategories);
        
        if (post.imageUrl || post.featuredImage) {
          setPreview(post.imageUrl || post.featuredImage);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    
   return () => {
      isMounted = false;
      if (cleanup) cleanup();
    }; 
  }, [isEditMode, id, availableCategories, currentUser, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    const selected = Array.isArray(selectedOptions) ? selectedOptions : [];
    
    // Ensure we only have valid category objects with value and label
    const validCategories = selected
      .filter(option => option && option.value)
      .map(option => {
        const value = Number(option.value);
        return {
          value: value,
          label: option.label || `Category ${value}`
        };
      });
    
    console.log('Selected categories changed:', validCategories);
    
    // Update the selected categories for the UI
    setSelectedCategories(validCategories);
    
    // Update the form data with just the category IDs
    setFormData(prev => ({
      ...prev,
      categories: validCategories.map(opt => opt.value).filter(id => id > 0)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, etc.)');
      return;
    }
    
    // Check file size (500KB = 500 * 1024 bytes)
    const MAX_FILE_SIZE = 500 * 1024; // 500KB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError('Image size should not exceed 500KB');
      // Clear the file input
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    
    reader.onloadstart = () => {
      setLoading(true);
    };
    
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setPreview(imageUrl);
      setFormData(prev => ({
        ...prev,
        featuredImage: imageUrl
      }));
      setLoading(false);
      setError('');
    };
    
    reader.onerror = () => {
      setError('Error reading image file. Please try again.');
      setLoading(false);
      e.target.value = ''; // Clear the file input
    };
    
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }
    
    // Ensure user is authenticated
    if (!keycloak.authenticated) {
      keycloak.login();
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Get the original post data if in edit mode
      let originalPost = null;
      if (isEditMode && id) {
        const response = await postsAPI.getPostById(id);
        originalPost = response.data;
      }
      
      // Get all available categories to map names to IDs if needed
      const categoriesResponse = await postsAPI.getCategories();
      const categoryNameToId = {};
      categoriesResponse.data.forEach(cat => {
        if (cat && cat.id && cat.name) {
          categoryNameToId[cat.name] = cat.id;
        }
      });
      
      // Function to convert category to ID
      const getCategoryId = (cat) => {
        if (typeof cat === 'number') return cat;
        if (typeof cat === 'object' && cat.id) return Number(cat.id);
        if (categoryNameToId[cat]) return categoryNameToId[cat];
        return null;
      };
      
      // Prepare post data for submission
      const postData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt || '',
        featuredImage: formData.featuredImage || formData.imageUrl || '',
        published: formData.published,
        // Convert category names to IDs
        categories: (() => {
          // If we have selected categories, use those
          if (formData.categories && formData.categories.length > 0) {
            return formData.categories
              .map(cat => getCategoryId(cat))
              .filter(id => id !== null);
          }
          // Otherwise, if we're editing and have original categories, use those
          if (isEditMode && originalPost?.categories) {
            return originalPost.categories
              .map(cat => getCategoryId(cat))
              .filter(id => id !== null);
          }
          return [];
        })(),
        tags: formData.tags.map(tag => ({
          name: tag,
          slug: tag.toLowerCase().replace(/\\s+/g, '-').replace(/[^\\w-]+/g, ''),
          description: ''
        }))
      };
      
      console.log('Submitting post data:', JSON.stringify(postData, null, 2));
      
      if (isEditMode && id) {
        await postsAPI.updatePost(id, postData);
      } else {
        await postsAPI.createPost(postData);
      }
      
      // Navigate to the post list after successful submission
      navigate('/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      setError(err.response?.data?.message || 'Failed to save post. Please try again.');
      
      // If token is invalid, force login
      if (err.response?.status === 401) {
        keycloak.login();
      }
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

            <Form.Group className="mb-3" controlId="slug">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="post-url-slug"
                required
              />
              <Form.Text className="text-muted">
                The URL-friendly version of the title. Auto-generated if left blank.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="excerpt">
              <Form.Label>Excerpt</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="A brief excerpt of your post"
                required
              />
              <Form.Text className="text-muted">
                A short excerpt that will appear in post previews.
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
                name="featuredImage"
                value={formData.featuredImage}
                onChange={handleChange}
                placeholder="Paste image URL here"
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
              />
              <Form.Text className="d-block text-muted mt-1">
                {loading ? (
                  <span className="text-primary">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Uploading image...
                  </span>
                ) : (
                  'Upload a featured image for your post (Max 500KB)'
                )}
              </Form.Text>
              {error && error.includes('size') && (
                <Form.Text className="text-danger d-block">
                  {error}
                </Form.Text>
              )}
              {preview && (
                <div className="mt-3">
                  <Image 
                    src={preview} 
                    alt="Preview" 
                    fluid 
                    style={{ maxHeight: '200px' }} 
                    className="img-thumbnail"
                  />
                  <div className="mt-2">
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => {
                        setPreview('');
                        setFormData(prev => ({ ...prev, featuredImage: '' }));
                      }}
                      disabled={loading}
                    >
                      Remove Image
                    </Button>
                  </div>
                </div>
              )}
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="published">
                  <Form.Check 
                    type="checkbox" 
                    label="Published" 
                    name="published"
                    checked={formData.published}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="categories">
              <Form.Label>Categories</Form.Label>
              {loadingCategories ? (
                <div className="d-flex align-items-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Loading categories...</span>
                </div>
              ) : availableCategories.length > 0 ? (
                <>
                  <Select
                    isMulti
                    options={availableCategories}
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    placeholder="Select categories..."
                    closeMenuOnSelect={false}
                    components={animatedComponents}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    noOptionsMessage={() => "No categories found"}
                    isClearable={true}
                    isSearchable={true}
                  />
                  <Form.Text className="text-muted">
                    {selectedCategories.length > 0 
                      ? `${selectedCategories.length} categories selected` 
                      : 'No categories selected. Select one or more categories for your post.'}
                  </Form.Text>
                </>
              ) : (
                <Alert variant="warning">No categories available. Please create categories first.</Alert>
              )}
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Add tags (press Enter to add)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <div className="mt-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} bg="secondary" className="me-2 mb-2 p-2">
                    {tag}
                    <Button 
                      variant="link" 
                      className="text-light p-0 ms-2"
                      onClick={() => removeTag(tag)}
                    >
                      ×
                    </Button>
                  </Badge>
                ))}
              </div>
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
