const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/config');
const { routeAuth } = require('./middleware/auth');
const { authProxy, postsProxy, commentsProxy } = require('./middleware/proxy');

const app = express();


app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.options('*', (req, res) => {
  res.status(200).end();
});
app.use(morgan('combined'));


app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Powered-By', 'API-Gateway');
  next();
});



app.use('/auth', authProxy);
app.use('/posts', routeAuth, postsProxy);
app.use('/comments', routeAuth, commentsProxy);


app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: ['/auth/*', '/posts/*', '/comments/*']
  });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  });
});


const startServer = async () => {
  app.listen(config.port, () => {
    console.log(`API Gateway running on port ${config.port}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
