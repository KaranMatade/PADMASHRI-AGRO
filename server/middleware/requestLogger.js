/**
 * server/middleware/requestLogger.js
 * Logs every incoming API request with timestamp and method
 * Author: Anushka Shete
 */

/**
 * Middleware: Log all API requests to console
 * Shows: method, path, status, response time
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toLocaleTimeString('en-IN', { hour12: true });

  res.on('finish', () => {
    const ms = Date.now() - start;
    const statusEmoji = res.statusCode < 300 ? '✅' : res.statusCode < 400 ? '🔀' : '❌';
    console.log(
      `[${timestamp}] ${statusEmoji} ${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`
    );
  });

  next();
}

/**
 * Middleware: 404 handler for unmatched routes
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    availableRoutes: [
      'GET  /api/health',
      'POST /api/inquiries',
      'GET  /api/inquiries',
      'GET  /api/inquiries/:id',
      'PATCH /api/inquiries/:id/status',
      'GET  /api/products',
      'GET  /api/products/:id',
      'GET  /api/branches',
    ]
  });
}

/**
 * Middleware: Global error handler
 */
export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    path: req.path
  });
}
