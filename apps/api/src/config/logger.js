// Request logging middleware
const requestLogger = {
  name: 'request-logger',
  version: '1.0.0',
  register: async (server, options) => {
    // Log incoming requests
    server.ext('onRequest', (request, h) => {
      const timestamp = new Date().toISOString();
      const method = request.method.toUpperCase();
      const path = request.path;
      const ip = request.info.remoteAddress;
      
      console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);
      
      return h.continue;
    });
  }
};

module.exports = requestLogger;
