// CORS configuration
const corsConfig = {
  development: {
    origin: ['*'], // Allow all in development
    credentials: true,
    additionalHeaders: ['cache-control', 'x-requested-with']
  },
  production: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      // Add more allowed origins as needed
    ],
    credentials: true,
    additionalHeaders: ['cache-control', 'x-requested-with'],
    maxAge: 600 // Cache preflight response for 10 minutes
  }
};

// Get CORS config based on environment
const getCorsConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return corsConfig[env] || corsConfig.development;
};

module.exports = {
  corsConfig,
  getCorsConfig
};
