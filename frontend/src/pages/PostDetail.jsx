import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Container, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { postsAPI } from '../services/api';
import { useKeycloak } from '@react-keycloak/web';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { keycloak, initialized } = useKeycloak();
  const { postsAPI, commentsAPI } = postsAPI();
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
        
        // Only fetch post data if not authenticated
        if (!keycloak.authenticated) {
          const postResponse = await postsAPI.getPostById(id);
          setPost(postResponse.data);
          setLoading(false);
          return;
        }

        // Fetch both post and comments if authenticated
        const [postResponse, commentsResponse] = await Promise.all([
          postsAPI.getPostById(id),
          commentsAPI.getCommentsByPostId(id)
        ]);
        
        setPost(postResponse.data);
        setComments(commentsResponse.data || []);
      } catch (err) {
        setError('Failed to fetch post details. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, initialized, keycloak.authenticated, postsAPI, commentsAPI]);

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

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <Container className="mt-4">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-3">
        &larr; Back to Posts
      </Button>
      
      <Card className="mb-4">
        {post.imageUrl && (
          <Card.Img variant="top" src={post.imageUrl} alt={post.title} />
        )}
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <Card.Title>{post.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}
              </Card.Subtitle>
            </div>
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => navigate(`/posts/${id}/edit`)}
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
          </div>
          <Card.Text className="mt-3">
            {post.content}
          </Card.Text>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>Comments ({comments.length})</Card.Header>
        <Card.Body>
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Add a comment</label>
              <textarea 
                className="form-control" 
                id="comment" 
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
            </div>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isSubmitting || !commentText.trim()}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>

          {comments.length === 0 ? (
            <p className="text-muted">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="comments">
              {comments.map((comment) => (
                <div key={comment.id} className="border-bottom pb-3 mb-3">
                  <div className="d-flex justify-content-between">
                    <strong>{comment.author?.name || 'Anonymous'}</strong>
                    <small className="text-muted">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-0 mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
