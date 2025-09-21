require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  services: {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    posts: process.env.POST_SERVICE_URL || 'http://localhost:3002',
    comments: process.env.COMMENT_SERVICE_URL || 'http://localhost:3003'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, 
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },
  proxy: {
    timeout: 30000,
    proxyTimeout: 30000,
    changeOrigin: true,
    logLevel: 'warn'
  },
  retry: {
    attempts: 3,
    delay: 1000
  }
};
