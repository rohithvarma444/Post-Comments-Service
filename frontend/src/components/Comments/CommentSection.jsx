import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import Comment from './Comment';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentsAPI.getCommentsByPost(postId);
      
      if (response.result) {
        setComments(response.result);
      } else {
        setError('Failed to load comments');
      }
    } catch (err) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
    setShowCommentForm(false);
  };

  const handleCommentUpdated = (updatedComment) => {
    const updateCommentsRecursively = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === updatedComment.id) {
          return updatedComment;
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentsRecursively(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(updateCommentsRecursively(comments));
  };

  const handleCommentDeleted = (deletedCommentId) => {
    const removeCommentRecursively = (commentsList) => {
      return commentsList.filter(comment => {
        if (comment.id === deletedCommentId) {
          return false;
        }
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = removeCommentRecursively(comment.replies);
        }
        return true;
      });
    };

    setComments(removeCommentRecursively(comments));
  };

  const handleReplyAdded = (parentCommentId, newReply) => {
    const addReplyRecursively = (commentsList) => {
      return commentsList.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyRecursively(comment.replies)
          };
        }
        return comment;
      });
    };

    setComments(addReplyRecursively(comments));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({comments.length})
        </h2>
        {user && (
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            {showCommentForm ? 'Cancel' : 'Add Comment'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {showCommentForm && user && (
        <div className="mb-6">
          <CommentForm
            postId={postId}
            onCommentAdded={handleCommentAdded}
            onCancel={() => setShowCommentForm(false)}
          />
        </div>
      )}

      {comments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No comments yet.</p>
          {user && !showCommentForm && (
            <button
              onClick={() => setShowCommentForm(true)}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Be the first to comment
            </button>
          )}
          {!user && (
            <p className="text-gray-500">
              <a href="/login" className="text-indigo-600 hover:text-indigo-800">
                Sign in
              </a>{' '}
              to add a comment
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
              onReplyAdded={handleReplyAdded}
              depth={0}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
