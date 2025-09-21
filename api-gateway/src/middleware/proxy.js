const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config/config');

const createRetryProxy = (target, pathRewrite = {}) => {
  return createProxyMiddleware({
    target,
    changeOrigin: config.proxy.changeOrigin,
    timeout: config.proxy.timeout,
    proxyTimeout: config.proxy.proxyTimeout,
    logLevel: config.proxy.logLevel,
    pathRewrite,
    
    onProxyReq: (proxyReq, req, res) => {
      const requestId = req.headers['x-request-id'] || generateRequestId();
      proxyReq.setHeader('x-request-id', requestId);
      proxyReq.setHeader('x-forwarded-by', 'api-gateway');
      
      console.log(`[${requestId}] Proxying ${req.method} ${req.originalUrl} to ${target}`);
    },

    onProxyRes: (proxyRes, req, res) => {
      const requestId = req.headers['x-request-id'] || 'unknown';
      console.log(`[${requestId}] Response from ${target}: ${proxyRes.statusCode}`);
      
      proxyRes.headers['x-proxied-by'] = 'api-gateway';
      proxyRes.headers['x-request-id'] = requestId;
    },

    onError: async (err, req, res) => {
      const requestId = req.headers['x-request-id'] || generateRequestId();
      console.error(`[${requestId}] Proxy error for ${target}:`, err.message);

      const retryCount = req.retryCount || 0;
      
      if (retryCount < config.retry.attempts) {
        req.retryCount = retryCount + 1;
        
        console.log(`[${requestId}] Retrying request (${req.retryCount}/${config.retry.attempts})`);
        
        setTimeout(() => {
          const retryProxy = createProxyMiddleware({
            target,
            changeOrigin: config.proxy.changeOrigin,
            timeout: config.proxy.timeout,
            pathRewrite,
            onError: (retryErr, retryReq, retryRes) => {
              console.error(`[${requestId}] Final proxy error after ${config.retry.attempts} attempts:`, retryErr.message);
              
              if (!retryRes.headersSent) {
                retryRes.status(503).json({
                  success: false,
                  message: 'Service temporarily unavailable',
                  requestId,
                  error: 'PROXY_ERROR'
                });
              }
            }
          });
          
          retryProxy(req, res);
        }, config.retry.delay * retryCount);
        
        return;
      }

      if (!res.headersSent) {
        res.status(503).json({
          success: false,
          message: 'Service temporarily unavailable',
          requestId,
          error: 'SERVICE_UNAVAILABLE'
        });
      }
    }
  });
};

const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const authProxy = createRetryProxy(config.services.auth, {
  '^/auth': '/auth'
});

const postsProxy = createRetryProxy(config.services.posts, {
  '^/posts': '/posts'
});

const commentsProxy = createRetryProxy(config.services.comments, {
  '^/comments': '/comments'
});

module.exports = {
  authProxy,
  postsProxy,
  commentsProxy,
  createRetryProxy
};
