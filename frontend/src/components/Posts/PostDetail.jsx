import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import CommentSection from '../Comments/CommentSection';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getPost(id);
      
      if (response.result && response.result.length > 0) {
        setPost(response.result[0]);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await postsAPI.deletePost(id);
      
      if (response.result) {
        navigate('/');
      } else {
        setError('Failed to delete post');
      }
    } catch (err) {
      setError('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
          ← Back to posts
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const isAuthor = user && (user.id === post.authorId || user.id === post.author_id);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Back to posts
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>User #{post.authorId || post.author_id}</span>
              <span>•</span>
              <span>{formatDate(post.createdAt || post.created_at)}</span>
            </div>
          </div>
          
          {isAuthor && (
            <div className="flex space-x-2 ml-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          <div 
            className="text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {post.updatedAt !== post.createdAt && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {formatDate(post.updatedAt || post.updated_at)}
            </p>
          </div>
        )}
      </article>

      <CommentSection postId={id} />
    </div>
  );
};

export default PostDetail;
