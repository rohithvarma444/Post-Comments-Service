const axios = require('axios');
const config = require('../config/config');

class PostServiceUtils {
  constructor() {
    this.postServiceUrl = process.env.API_GATEWAY_URL || 'http://api-gateway:8080';
  }

  async postExists(postId) {
    try {
      const response = await axios.get(`${this.postServiceUrl}/posts/${postId}`, {
        timeout: 5000
      });

      return response.status === 200 && response.data.success;
    } catch (error) {
      console.error('Post existence check error:', error.message);
      
      if (error.response && error.response.status === 404) {
        return false;
      }
      return true;
    }
  }

  async getPostInfo(postId) {
    try {
      const response = await axios.get(`${this.postServiceUrl}/posts/${postId}`, {
        timeout: 5000
      });

      if (response.data.success) {
        return {
          success: true,
          post: response.data.data.post
        };
      }

      return { success: false, error: 'Post not found' };
    } catch (error) {
      console.error('Get post info error:', error.message);
      
      if (error.response && error.response.data) {
        return { 
          success: false, 
          error: error.response.data.message || 'Failed to get post info' 
        };
      }

      return { success: false, error: 'Post service unavailable' };
    }
  }

}

module.exports = new PostServiceUtils();
