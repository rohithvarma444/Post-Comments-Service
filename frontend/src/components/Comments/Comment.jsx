import React, { useState } from 'react';
import { commentsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from './CommentForm';
import RichTextEditor from '../Common/RichTextEditor';

const Comment = ({ 
  comment, 
  onCommentUpdated, 
  onCommentDeleted, 
  onReplyAdded, 
  depth = 0 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const maxDepth = 3;

  const isAuthor = user && (user.id === comment.authorId || user.id === comment.author_id);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleEditContentChange = (newContent) => {
    setEditContent(newContent);
  };

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === '<div></div>' || editContent === '<br>') {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await commentsAPI.updateComment(comment.id, {
        content: editContent.trim(),
        is_rich_text: true
      });

      if (response.result && response.result.length > 0) {
        onCommentUpdated(response.result[0]);
        setIsEditing(false);
      } else {
        setError('Failed to update comment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await commentsAPI.deleteComment(comment.id);

      if (response.result) {
        onCommentDeleted(comment.id);
      } else {
        setError('Failed to delete comment');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete comment';
      
      if (err.response?.data?.hasReplies) {
        setError(`${errorMessage} This comment has ${err.response.data.replyCount} replies. Please delete the replies first.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReplyAdded = (newReply) => {
    onReplyAdded(comment.id, newReply);
    setShowReplyForm(false);
  };

  const marginLeft = Math.min(depth * 2, maxDepth * 2);

  return (
    <div className={`${depth > 0 ? `ml-${marginLeft} border-l-2 border-gray-200 pl-4` : ''}`}>
      <div className="bg-gray-50 rounded-lg p-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mb-3">
            {error}
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">User #{comment.authorId || comment.author_id}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(comment.createdAt || comment.created_at)}</span>
            {(comment.updatedAt !== comment.createdAt || 
              comment.updated_at !== comment.created_at) && (
              <>
                <span className="mx-2">•</span>
                <span className="italic">edited</span>
              </>
            )}
          </div>

          {isAuthor && !isEditing && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <RichTextEditor
              value={editContent}
              onChange={handleEditContentChange}
              placeholder="Edit your comment..."
              height="120px"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(comment.content);
                  setError('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-gray-800 mb-3 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: comment.content }} />
            </div>

            <div className="flex items-center space-x-4 text-sm">
              {user && depth < maxDepth && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {showReplyForm ? 'Cancel Reply' : 'Reply'}
                </button>
              )}
              
              {comment.replies && comment.replies.length > 0 && (
                <span className="text-gray-500">
                  {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>
          </>
        )}

        {showReplyForm && user && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <CommentForm
              postId={comment.postId || comment.post_id}
              parentId={comment.id}
              onCommentAdded={handleReplyAdded}
              onCancel={() => setShowReplyForm(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onCommentUpdated={onCommentUpdated}
              onCommentDeleted={onCommentDeleted}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
