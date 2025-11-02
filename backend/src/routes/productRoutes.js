const ProductController = require('../controllers/ProductController');
const { productSchemas, validate } = require('../config/validation');

const productRoutes = [
  {
    method: 'GET',
    path: '/api/products',
    handler: ProductController.getAll
  },
  {
    method: 'GET',
    path: '/api/products/{id}',
    handler: ProductController.getById
  },
  {
    method: 'POST',
    path: '/api/products',
    options: {
      pre: [{ method: validate(productSchemas.create) }]
    },
    handler: ProductController.create
  },
  {
    method: 'PUT',
    path: '/api/products/{id}',
    options: {
      pre: [{ method: validate(productSchemas.update) }]
    },
    handler: ProductController.update
  },
  {
    method: 'DELETE',
    path: '/api/products/{id}',
    handler: ProductController.delete
  },
  {
    method: 'PATCH',
    path: '/api/products/{id}/stok',
    options: {
      pre: [{ method: validate(productSchemas.updateStok) }]
    },
    handler: ProductController.updateStok
  }
];

module.exports = productRoutes;
