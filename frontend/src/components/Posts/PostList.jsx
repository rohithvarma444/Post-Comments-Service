import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;
  const urlSearchQuery = searchParams.get('q') || '';

  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    fetchPosts();
  }, [page, searchQuery]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: 10,
        ...(searchQuery && { q: searchQuery })
      };
      
      const response = await postsAPI.getAllPosts(params);
      
      if (response.result) {
        setPosts(response.result);
        setTotalPages(Math.ceil(response.count / 10));
      } else {
        setError('Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: '1', q: searchQuery });
  };

  const handlePageChange = (newPage) => {
    const params = { page: newPage.toString() };
    if (searchQuery) {
      params.q = searchQuery;
    }
    setSearchParams(params);
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

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        {user && (
          <Link
            to="/create-post"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Create Post
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search posts..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found.</p>
            {user && (
              <Link
                to="/create-post"
                className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              >
                Create the first post
              </Link>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
              <div className="mb-4">
                <Link to={`/posts/${post.id}`} className="block">
                  <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600 transition duration-200">
                    {post.title}
                  </h2>
                </Link>
              </div>
              
              <div className="text-gray-700 mb-4 line-clamp-3 prose max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.length > 200 
                      ? `${post.content.substring(0, 200)}...` 
                      : post.content
                  }}
                />
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  User #{post.authorId || post.author_id}
                </div>
                <div>
                  {formatDate(post.createdAt || post.created_at)}
                </div>
              </div>
              
              <div className="mt-4">
                <Link
                  to={`/posts/${post.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PostList;
