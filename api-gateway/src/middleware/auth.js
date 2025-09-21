const jwtUtils = require('../utils/jwt');

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }
    const decoded = jwtUtils.verifyToken(token);
    
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    if (error.message.includes('Token expired') || error.message.includes('Invalid token')) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication service error'
    });
  }
};

const tryAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = jwtUtils.extractTokenFromHeader(authHeader);

    if (token) {
      try {
        const decoded = jwtUtils.verifyToken(token);
      } catch (tokenError) {
        console.warn('Optional authentication failed:', tokenError.message);
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication middleware error:', error);
    next();
  }
};

const protectedRoutes = [
  { method: 'POST', path: /^\/posts/ },
  { method: 'POST', path: /^\/comments/ },
  
  { method: 'PUT', path: /^\/posts/ },
  { method: 'PUT', path: /^\/comments/ },
  
  { method: 'DELETE', path: /^\/posts/ },
  { method: 'DELETE', path: /^\/comments/ }
];

const publicRoutes = [
  { method: 'POST', path: /^\/auth\/register/ },
  { method: 'POST', path: /^\/auth\/login/ },
  
  { method: 'GET', path: /^\/posts/ },
  { method: 'GET', path: /^\/comments/ }
];

const isProtectedRoute = (method, path) => {
  const isPublic = publicRoutes.some(route => 
    route.method === method && route.path.test(path)
  );
  
  if (isPublic) return false;

  const isProtected = protectedRoutes.some(route => 
    route.method === method && route.path.test(path)
  );

  return isProtected;
};

const routeAuth = (req, res, next) => {
  const method = req.method;
  const path = req.path;

  if (isProtectedRoute(method, path)) {
    return requireAuth(req, res, next);
  } else {
    return tryAuth(req, res, next);
  }
};

module.exports = {
  requireAuth,
  tryAuth,
  routeAuth,
  isProtectedRoute
};
