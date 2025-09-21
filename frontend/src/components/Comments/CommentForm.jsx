import React, { useState } from 'react';
import { commentsAPI } from '../../services/api';
import RichTextEditor from '../Common/RichTextEditor';

const CommentForm = ({ 
  postId, 
  parentId = null, 
  onCommentAdded, 
  onCancel,
  placeholder = "Write a comment..." 
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() || content === '<div></div>' || content === '<br>') {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      
      if (parentId) {
        response = await commentsAPI.replyToComment(parentId, {
          content: content.trim(),
          is_rich_text: true
        });
      } else {
        response = await commentsAPI.createComment({
          post_id: parseInt(postId),
          content: content.trim(),
          is_rich_text: true
        });
      }

      if (response.result && response.result.length > 0) {
        const newComment = response.result[0];
        onCommentAdded(newComment);
        setContent('');
      } else if (response.success && response.data && response.data.comment) {
        const newComment = response.data.comment;
        onCommentAdded(newComment);
        setContent('');
      } else {
        setError('Failed to post comment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <RichTextEditor
          value={content}
          onChange={handleContentChange}
          placeholder={placeholder}
          height="120px"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Posting...' : (parentId ? 'Post Reply' : 'Post Comment')}
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;
