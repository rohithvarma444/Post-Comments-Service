const authUtils = require('../utils/auth');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const validation = await authUtils.validateToken(token);

    if (!validation.valid) {
      return res.status(401).json({
        success: false,
        message: validation.error || 'Invalid token'
      });
    }

    req.user = validation.user;
    req.token = validation.decoded;
    
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service error'
    });
  }
};

const tryAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authUtils.extractTokenFromHeader(authHeader);

    if (token) {
      const validation = await authUtils.validateToken(token);
      
      if (validation.valid) {
        req.user = validation.user;
        req.token = validation.decoded;
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next();
  }
};

module.exports = {
  requireAuth,
  tryAuth
};
