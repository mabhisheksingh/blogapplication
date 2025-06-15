import React from 'react';
import { Card } from 'react-bootstrap';
import { formatDistanceToNow } from 'date-fns';

const CommentItem = ({ comment, currentUser }) => {

  return (
    <div className="mb-3">
      <Card className="border-0 shadow-sm">
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
                <small className="text-muted">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </small>
              </div>
            </div>
          </div>
          
          <div className="ms-4 ps-3">
            <p className="mb-0">{comment.content}</p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CommentItem;
