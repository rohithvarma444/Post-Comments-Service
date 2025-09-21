require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3003,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'comments_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: false
  },
  services: {
    authService: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    postService: process.env.POST_SERVICE_URL || 'http://localhost:3002'
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  },
  richText: {
    sanitize: true
  },
  pagination: {
    defaultLimit: 20,
    maxLimit: 100
  }
};
