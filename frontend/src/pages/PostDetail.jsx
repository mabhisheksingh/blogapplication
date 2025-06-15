import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Container, 
  Spinner, 
  Alert, 
  Badge, 
  Image, 
  Form 
} from 'react-bootstrap';
import { postsAPI, commentsAPI,setupInterceptors } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';
import { formatDistanceToNow } from 'date-fns';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!initialized) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Always fetch the post data
        const postResponse = await postsAPI.getPostById(id);
        const postData = postResponse.data;
        
        // If authenticated, also fetch comments
        if (keycloak.authenticated) {
          try {
            const commentsResponse = await commentsAPI.getCommentsByPostId(id);
            // Ensure we always set an array, even if response.data is undefined or null
            const commentsData = Array.isArray(commentsResponse?.data) 
              ? commentsResponse.data 
              : [];
            setComments(commentsData);
          } catch (commentErr) {
            console.error('Error fetching comments:', commentErr);
            // Set empty array on error to prevent map errors
            setComments([]);
          }
        } else {
          // Ensure comments is always an array, even for non-authenticated users
          setComments([]);
        }
        
        // Transform post data to match our expected format
        const transformedPost = {
          ...postData,
          // Handle both imageUrl and featuredImage
          imageUrl: postData.featuredImage || postData.imageUrl || '',
          // Handle excerpt (use excerpt if available, otherwise use empty string)
          excerpt: postData.excerpt || '',
          // Ensure categories is an array of strings
          categories: Array.isArray(postData.categories) 
            ? postData.categories.map(cat => typeof cat === 'object' ? cat.name : String(cat || ''))
            : [],
          // Ensure tags is an array of strings
          tags: Array.isArray(postData.tags)
            ? postData.tags.map(tag => typeof tag === 'object' ? tag.name : String(tag || ''))
            : []
        };
        
        console.log('Transformed post data:', transformedPost);
        
        setPost(transformedPost);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.message || 'Failed to fetch post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    // Set up interceptors with keycloak
    const cleanup = setupInterceptors(keycloak);
    fetchData();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [id, initialized, keycloak, postsAPI, commentsAPI]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !keycloak.authenticated) return;

    try {
      setIsSubmitting(true);
      const response = await commentsAPI.addComment(id, { content: commentText });
      setComments(prev => [...prev, response.data]);
      setCommentText('');
      setError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(id);
        navigate('/posts');
      } catch (err) {
        console.error('Error deleting post:', err);
        setError('Failed to delete post. Please try again.');
      }
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

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!post) return null;

  // Format date to relative time (e.g., "2 days ago")
  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        onClick={() => navigate(-1)} 
        className="mb-4"
      >
        &larr; Back to Posts
      </Button>

      <article>
        {(post.imageUrl || post.featuredImage) && (
          <div className="mb-4" style={{ maxHeight: '500px', overflow: 'hidden', borderRadius: '8px' }}>
            <Image 
              src={post.imageUrl || post.featuredImage} 
              fluid 
              className="w-100" 
              style={{ objectFit: 'cover', maxHeight: '500px' }}
              alt={post.title}
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </div>
        )}

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="display-5 fw-bold mb-2">{post.title}</h1>
            <div className="d-flex align-items-center text-muted mb-3 flex-wrap">
              <span>By {post.authorUsername || post.author?.username || 'Unknown'}</span>
              <span className="mx-2">•</span>
              <span>{post.createdAt ? formatDate(post.createdAt) : 'Unknown date'}</span>
              {post.updatedAt && post.updatedAt !== post.createdAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
            </div>
          </div>
          
          {keycloak.authenticated && 
            (keycloak.tokenParsed?.preferred_username === post.authorUsername || 
             keycloak.hasRealmRole('ROLE_ADMIN') || 
             keycloak.hasRealmRole('ROLE_ROOT')) && (
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => navigate(`/posts/${post.id}/edit`)}
              >
                Edit
              </Button>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={handleDeletePost}
              >
                Delete
              </Button>
            </div>
          )}
        </div>

        {post.categories?.length > 0 && (
          <div className="mb-4">
            {post.categories.map((category, idx) => (
              <Badge key={idx} bg="info" className="me-2 mb-2 fs-6">
                {category}
              </Badge>
            ))}
          </div>
        )}

        {post.excerpt && (
          <div className="lead mb-4 text-muted">
            {post.excerpt}
          </div>
        )}

        <div className="post-content mb-5" style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
          {post.content ? (
            post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-3">{paragraph}</p>
            ))
          ) : (
            <Alert variant="warning">No content available for this post.</Alert>
          )}
        </div>

        {post.tags?.length > 0 && (
          <div className="mb-5">
            <h5 className="mb-3">Tags</h5>
            <div>
              {post.tags.map((tag, idx) => (
                <Badge key={idx} bg="secondary" className="me-2 mb-2 p-2 fs-6">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>

      <section className="mt-5 pt-4 border-top">
        <h3 className="mb-4">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>

        {keycloak.authenticated ? (
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group controlId="comment" className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                    style={{ resize: 'none' }}
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        ) : (
          <Alert variant="light" className="text-center py-4">
            <p className="mb-2">Want to join the discussion?</p>
            <Button 
              variant="outline-primary" 
              onClick={() => keycloak.login()}
            >
              Sign in to comment
            </Button>
          </Alert>
        )}
        
        {(!comments || comments.length === 0) ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat-square-text fs-1 d-block mb-2"></i>
            <p className="h5">No comments yet</p>
            <p>Be the first to share what you think!</p>
          </div>
        ) : (
          <div className="comments">
            {comments.map(comment => (
              <Card key={comment.id} className="mb-3 border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      <div 
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                        style={{ width: '32px', height: '32px', fontSize: '14px' }}
                      >
                        {comment.author?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="ms-2">
                        <strong className="d-block">{comment.author?.name || 'Anonymous'}</strong>
                      </div>
                    </div>
                    <small className="text-muted">
                      {formatDate(comment.createdAt)}
                    </small>
                  </div>
                  <div className="ms-4 ps-3 border-start">
                    <p className="mb-0">{comment.content}</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
};

export default PostDetail;
