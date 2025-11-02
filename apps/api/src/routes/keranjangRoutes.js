const KeranjangController = require('../controllers/KeranjangController');
const { keranjangSchemas, validate } = require('../config/validation');

const keranjangRoutes = [
  {
    method: 'GET',
    path: '/api/keranjangs',
    handler: KeranjangController.getAll
  },
  {
    method: 'GET',
    path: '/api/keranjangs/{id}',
    handler: KeranjangController.getById
  },
  {
    method: 'POST',
    path: '/api/keranjangs',
    options: {
      pre: [{ method: validate(keranjangSchemas.create) }]
    },
    handler: KeranjangController.create
  },
  {
    method: 'PUT',
    path: '/api/keranjangs/{id}',
    options: {
      pre: [{ method: validate(keranjangSchemas.update) }]
    },
    handler: KeranjangController.update
  },
  {
    method: 'DELETE',
    path: '/api/keranjangs/{id}',
    handler: KeranjangController.delete
  },
  {
    method: 'DELETE',
    path: '/api/keranjangs',
    handler: KeranjangController.clear
  }
];

module.exports = keranjangRoutes;
