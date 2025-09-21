require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3002,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'posts_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: false
  },
  services: {
    authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 // limit each IP to 100 requests per windowMs
  },
  pagination: {
    defaultLimit: 10,
    maxLimit: 50
  }
};
