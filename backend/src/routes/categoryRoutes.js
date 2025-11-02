const CategoryController = require('../controllers/CategoryController');
const { categorySchemas, validate } = require('../config/validation');

const categoryRoutes = [
  {
    method: 'GET',
    path: '/api/categories',
    handler: CategoryController.getAll
  },
  {
    method: 'GET',
    path: '/api/categories/{id}',
    handler: CategoryController.getById
  },
  {
    method: 'POST',
    path: '/api/categories',
    options: {
      pre: [{ method: validate(categorySchemas.create) }]
    },
    handler: CategoryController.create
  },
  {
    method: 'PUT',
    path: '/api/categories/{id}',
    options: {
      pre: [{ method: validate(categorySchemas.update) }]
    },
    handler: CategoryController.update
  },
  {
    method: 'DELETE',
    path: '/api/categories/{id}',
    handler: CategoryController.delete
  }
];

module.exports = categoryRoutes;
