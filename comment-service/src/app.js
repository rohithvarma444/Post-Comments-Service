const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const database = require('./utils/database');
const authUtils = require('./utils/auth');
const postService = require('./utils/postService');
const commentsRoutes = require('./routes/comments');

const app = express();

app.use(cors(config.cors));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use('/comments', commentsRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});

const startServer = async () => {
  await database.initialize();
  app.listen(config.port, () => {
    console.log(`Comment service running on port ${config.port}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
