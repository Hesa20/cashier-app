const healthRoutes = [
  {
    method: 'GET',
    path: '/health',
    handler: (request, h) => {
      return h.response({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      }).code(200);
    }
  },
  {
    method: 'GET',
    path: '/api/health',
    handler: (request, h) => {
      return h.response({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      }).code(200);
    }
  }
];

module.exports = healthRoutes;
