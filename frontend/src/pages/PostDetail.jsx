import React, { useState, useEffect, useCallback } from 'react';
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
import { postsAPI, commentsAPI, setupInterceptors } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';
import { formatDistanceToNow } from 'date-fns';
import CommentItem from '../components/CommentItem';

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

  const addNewComment = useCallback((newComment) => {
    setComments(prev => [{
      ...newComment,
      content: newComment.comment, // Map comment field to content
      author: {
        id: keycloak.subject,
        name: keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username,
        email: keycloak.tokenParsed?.email || '',
        username: keycloak.tokenParsed?.preferred_username || '',
        avatar: keycloak.tokenParsed?.picture
      },
      authorUserName: keycloak.tokenParsed?.preferred_username,
      authorEmail: keycloak.tokenParsed?.email
    }, ...prev]);
  }, [keycloak]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await commentsAPI.getCommentsByPostId(id, {
        page: 0,
        size: 50,
        sort: 'createdAt,desc'
      });
      
      // The API now returns paginated data with comments in response.data.content
      const commentsData = response.data?.content || [];
      const transformedComments = commentsData.map(comment => ({
        ...comment,
        // Map the API response fields to match our frontend structure
        content: comment.comment, // Map 'comment' field to 'content'
        author: {
          id: comment.authorId || 'unknown',
          name: comment.authorUserName || 'Anonymous',
          email: comment.authorEmail || '',
          username: comment.authorUserName || ''
        },
        // Initialize empty replies array for each comment
        replies: []
      }));
      
      setComments(transformedComments);
      return transformedComments;
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try refreshing the page.');
      return [];
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const [postResponse] = await Promise.all([
        postsAPI.getPostById(id),
        fetchComments()
      ]);
      
      const postData = postResponse.data;
      
      const transformedPost = {
        ...postData,
        imageUrl: postData.featuredImage || postData.imageUrl || '',
        excerpt: postData.excerpt || '',
        categories: Array.isArray(postData.categories) 
          ? postData.categories.map(cat => typeof cat === 'object' ? cat.name : String(cat || ''))
          : [],
        tags: Array.isArray(postData.tags)
          ? postData.tags.map(tag => typeof tag === 'object' ? tag.name : String(tag || ''))
          : []
      };
      
      setPost(transformedPost);
    } catch (err) {
      console.error('Error fetching post:', err);
      setError(err.response?.data?.message || 'Failed to fetch post. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, fetchComments]);

  useEffect(() => {
    if (!initialized) return;
    
    const cleanup = setupInterceptors(keycloak);
    fetchData();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [initialized, keycloak, fetchData]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !keycloak.authenticated) return;

    try {
      setIsSubmitting(true);
      const response = await commentsAPI.addComment(id, {
        content: commentText,
        edited: false
      });
      
      addNewComment(response.data);
      setCommentText('');
      setError('');
    } catch (err) {
      console.error('Error adding comment:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add comment. Please try again.';
      setError(errorMessage);
      
      if (err.response?.status === 401) {
        keycloak.login();
      }
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

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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
        <Button variant="secondary" onClick={() => window.location.reload()} className="mt-3">
          Refresh Page
        </Button>
      </Container>
    );
  }

  if (!post) return null;

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
        
        {error && (
          <Alert variant="danger" className="mb-4">
            {error}
          </Alert>
        )}
        
        {comments.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-chat-square-text fs-1 d-block mb-2"></i>
            <p className="h5">No comments yet</p>
            <p>Be the first to share what you think!</p>
          </div>
        ) : (
          <div className="comments">
            {comments.map(comment => (
              <CommentItem 
                key={comment.id} 
                comment={comment}
                currentUser={keycloak.authenticated ? {
                  id: keycloak.subject,
                  name: keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username,
                  avatar: keycloak.tokenParsed?.picture
                } : null}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
};

export default PostDetail;
