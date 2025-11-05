const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const healthRoutes = require('./healthRoutes');

const routes = [
  // Health check endpoints
  ...healthRoutes,
  
  // API routes
  ...categoryRoutes,
  ...productRoutes,
  ...orderRoutes
];

module.exports = routes;
