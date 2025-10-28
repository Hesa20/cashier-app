require('dotenv').config();
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.server({
    port: process.env.API_PORT || 4000,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'], // For development - restrict in production
        credentials: true,
      },
    },
  });

  // Health check
  server.route({
    method: 'GET',
    path: '/health',
    handler: () => ({ status: 'ok', timestamp: new Date().toISOString() }),
  });

  // Mock Products
  const mockProducts = [
    { id: 1, nama: 'Nasi Goreng', harga: 15000, category: { nama: 'Makanan' }, gambar: 'nasi-goreng-telor.jpg', kode: 'NG-1' },
    { id: 2, nama: 'Es Teh', harga: 5000, category: { nama: 'Minuman' }, gambar: 'es-teh.jpg', kode: 'ET-1' },
    { id: 3, nama: 'Kentang Goreng', harga: 12000, category: { nama: 'Cemilan' }, gambar: 'kentang-goreng.jpg', kode: 'KG-1' },
  ];

  const mockKeranjangs = [];
  const mockPesanans = [];
  let keranjangIdCounter = 1;
  let pesananIdCounter = 1;

  // Products routes
  server.route({
    method: 'GET',
    path: '/products',
    handler: (request, h) => {
      const { 'category.nama': categoryName } = request.query;
      if (categoryName) {
        return mockProducts.filter(p => p.category.nama === categoryName);
      }
      return mockProducts;
    },
  });

  // Keranjangs routes
  server.route({
    method: 'GET',
    path: '/keranjangs',
    handler: (request, h) => {
      const { 'product.id': productId } = request.query;
      if (productId) {
        return mockKeranjangs.filter(k => k.product.id === parseInt(productId));
      }
      return mockKeranjangs;
    },
  });

  server.route({
    method: 'POST',
    path: '/keranjangs',
    handler: (request, h) => {
      const newItem = { id: keranjangIdCounter++, ...request.payload };
      mockKeranjangs.push(newItem);
      return h.response(newItem).code(201);
    },
  });

  server.route({
    method: 'PUT',
    path: '/keranjangs/{id}',
    handler: (request, h) => {
      const id = parseInt(request.params.id);
      const index = mockKeranjangs.findIndex(k => k.id === id);
      if (index !== -1) {
        mockKeranjangs[index] = { id, ...request.payload };
        return mockKeranjangs[index];
      }
      return h.response({ error: 'Not found' }).code(404);
    },
  });

  server.route({
    method: 'DELETE',
    path: '/keranjangs/{id}',
    handler: (request, h) => {
      const id = parseInt(request.params.id);
      const index = mockKeranjangs.findIndex(k => k.id === id);
      if (index !== -1) {
        mockKeranjangs.splice(index, 1);
        return h.response().code(204);
      }
      return h.response({ error: 'Not found' }).code(404);
    },
  });

  // Pesanans routes
  server.route({
    method: 'POST',
    path: '/pesanans',
    handler: (request, h) => {
      const newPesanan = { id: pesananIdCounter++, ...request.payload, created_at: new Date().toISOString() };
      mockPesanans.push(newPesanan);
      return h.response(newPesanan).code(201);
    },
  });

  server.route({
    method: 'GET',
    path: '/pesanans',
    handler: () => mockPesanans,
  });

  await server.start();
  console.log('🚀 Hapi API server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.error(err);
  process.exit(1);
});

init();
