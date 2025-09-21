const axios = require('axios');
const config = require('../config/config');

class AuthUtils {
  constructor() {
    this.authServiceUrl = config.services.authService;
  }

  async validateToken(token) {
    try {
      const response = await axios.post(`${this.authServiceUrl}/auth/validate`, {
        token
      }, {
        timeout: 5000
      });

      if (response.data.success) {
        return {
          valid: true,
          user: response.data.data.user,
          decoded: response.data.data.decoded
        };
      }

      return { valid: false, error: 'Token validation failed' };
    } catch (error) {
      console.error('Token validation error:', error.message);
      
      if (error.response && error.response.data) {
        return { 
          valid: false, 
          error: error.response.data.message || 'Token validation failed' 
        };
      }

      return { valid: false, error: 'Auth service unavailable' };
    }
  }

  async getUserInfo(userId) {
    try {
      const response = await axios.get(`${this.authServiceUrl}/auth/user/${userId}`, {
        timeout: 5000
      });

      if (response.data.success) {
        return {
          success: true,
          user: response.data.data.user
        };
      }

      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Get user info error:', error.message);
      
      if (error.response && error.response.data) {
        return { 
          success: false, 
          error: error.response.data.message || 'Failed to get user info' 
        };
      }

      return { success: false, error: 'Auth service unavailable' };
    }
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }

    return parts[1];
  }

}

module.exports = new AuthUtils();
