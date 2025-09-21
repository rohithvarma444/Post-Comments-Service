import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  validateToken: async (token) => {
    const response = await api.post('/auth/validate', { token });
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/auth/user/${userId}`);
    return response.data;
  }
};

export const postsAPI = {
  getAllPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },

  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },

  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  getPostsByAuthor: async (authorId, params = {}) => {
    const response = await api.get(`/posts/author/${authorId}`, { params });
    return response.data;
  }
};

export const commentsAPI = {
  getCommentsByPost: async (postId, params = {}) => {
    const response = await api.get(`/comments/post/${postId}`, { params });
    return response.data;
  },

  createComment: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  updateComment: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  replyToComment: async (id, replyData) => {
    const response = await api.post(`/comments/${id}/reply`, replyData);
    return response.data;
  },

  getCommentsByAuthor: async (authorId, params = {}) => {
    const response = await api.get(`/comments/author/${authorId}`, { params });
    return response.data;
  }
};

export default api;
