const PesananController = require('../controllers/PesananController');
const { pesananSchemas, validate } = require('../config/validation');

const pesananRoutes = [
  {
    method: 'GET',
    path: '/api/pesanans',
    handler: PesananController.getAll
  },
  {
    method: 'GET',
    path: '/api/pesanans/{id}',
    handler: PesananController.getById
  },
  {
    method: 'POST',
    path: '/api/pesanans',
    options: {
      pre: [{ method: validate(pesananSchemas.create) }]
    },
    handler: PesananController.create
  },
  {
    method: 'PATCH',
    path: '/api/pesanans/{id}/status',
    options: {
      pre: [{ method: validate(pesananSchemas.updateStatus) }]
    },
    handler: PesananController.updateStatus
  },
  {
    method: 'DELETE',
    path: '/api/pesanans/{id}',
    handler: PesananController.delete
  }
];

module.exports = pesananRoutes;
