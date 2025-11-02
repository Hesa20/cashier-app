const Pesanan = require('../models/Pesanan');
const Product = require('../models/Product');
const Keranjang = require('../models/Keranjang');

const PesananController = {
  // GET /pesanans
  getAll: (request, h) => {
    try {
      const pesanans = Pesanan.findAll();
      
      return h.response({
        status: 'success',
        data: pesanans
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // GET /pesanans/{id}
  getById: (request, h) => {
    try {
      const { id } = request.params;
      const pesanan = Pesanan.findById(id);
      
      if (!pesanan) {
        return h.response({
          status: 'fail',
          message: 'Pesanan tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        data: pesanan
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // POST /pesanans
  create: (request, h) => {
    try {
      const { items, totalHarga, metodePembayaran } = request.payload;
      
      if (!items || !totalHarga || !metodePembayaran) {
        return h.response({
          status: 'fail',
          message: 'Data tidak lengkap'
        }).code(400);
      }
      
      // Validasi stok
      for (const item of items) {
        const product = Product.findById(item.productId);
        if (!product) {
          return h.response({
            status: 'fail',
            message: `Produk dengan ID ${item.productId} tidak ditemukan`
          }).code(404);
        }
        
        if (product.stok < item.jumlah) {
          return h.response({
            status: 'fail',
            message: `Stok ${product.nama} tidak mencukupi`
          }).code(400);
        }
      }
      
      // Kurangi stok
      for (const item of items) {
        Product.updateStok(item.productId, -item.jumlah);
      }
      
      const pesanan = Pesanan.create({ items, totalHarga, metodePembayaran });
      
      // Kosongkan keranjang
      Keranjang.clear();
      
      return h.response({
        status: 'success',
        message: 'Pesanan berhasil dibuat',
        data: pesanan
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // PATCH /pesanans/{id}/status
  updateStatus: (request, h) => {
    try {
      const { id } = request.params;
      const { status } = request.payload;
      
      if (!status) {
        return h.response({
          status: 'fail',
          message: 'Status harus diisi'
        }).code(400);
      }
      
      const pesanan = Pesanan.updateStatus(id, status);
      
      if (!pesanan) {
        return h.response({
          status: 'fail',
          message: 'Pesanan tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Status pesanan berhasil diupdate',
        data: pesanan
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // DELETE /pesanans/{id}
  delete: (request, h) => {
    try {
      const { id } = request.params;
      const success = Pesanan.delete(id);
      
      if (!success) {
        return h.response({
          status: 'fail',
          message: 'Pesanan tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Pesanan berhasil dihapus'
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  }
};

module.exports = PesananController;
