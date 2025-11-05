const OrderController = require('../controllers/OrderController');
const { validateOrder, validateOrderStatus } = require('../config/validation');

const orderRoutes = [
  {
    method: 'GET',
    path: '/api/orders',
    handler: OrderController.getAll
  },
  {
    method: 'GET',
    path: '/api/orders/{id}',
    handler: OrderController.getById
  },
  {
    method: 'POST',
    path: '/api/orders',
    handler: OrderController.create,
    options: {
      validate: validateOrder
    }
  },
  {
    method: 'PATCH',
    path: '/api/orders/{id}/status',
    handler: OrderController.updateStatus,
    options: {
      validate: validateOrderStatus
    }
  },
  {
    method: 'DELETE',
    path: '/api/orders/{id}',
    handler: OrderController.delete
  }
];

module.exports = orderRoutes;
