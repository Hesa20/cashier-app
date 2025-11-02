const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const keranjangRoutes = require('./keranjangRoutes');
const pesananRoutes = require('./pesananRoutes');
const healthRoutes = require('./healthRoutes');

const routes = [
  // Health check endpoints
  ...healthRoutes,
  
  // API routes
  ...categoryRoutes,
  ...productRoutes,
  ...keranjangRoutes,
  ...pesananRoutes
];

module.exports = routes;
