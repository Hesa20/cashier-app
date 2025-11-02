require('dotenv').config();
const { validateEnv } = require('./config/env');
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const requestLogger = require('./config/logger');
const { getCorsConfig } = require('./config/cors');

// Validate environment variables before starting server
validateEnv();

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: process.env.HOST || '0.0.0.0',
    routes: {
      cors: getCorsConfig()
    }
  });

  // Register logger plugin
  await server.register(requestLogger);

  // Register routes
  server.route(routes);

  // Error handling & response logging
  server.ext('onPreResponse', (request, h) => {
    const response = request.response;
    const method = request.method.toUpperCase();
    const path = request.path;
    const duration = Date.now() - request.info.received;
    
    // Log response
    const statusCode = response.isBoom ? response.output.statusCode : response.statusCode;
    console.log(`[RESPONSE] ${method} ${path} - Status: ${statusCode} - Duration: ${duration}ms`);
    
    // Handle errors
    if (response.isBoom) {
      return h.response({
        status: 'error',
        message: response.message,
        statusCode: response.output.statusCode
      }).code(response.output.statusCode);
    }
    
    return h.continue;
  });

  await server.start();
  console.log('🚀 Server running on %s', server.info.uri);
  console.log('📝 Environment: %s', process.env.NODE_ENV || 'development');
};

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('SIGINT', () => {
  console.log('\n👋 Server shutting down...');
  process.exit(0);
});

init();
