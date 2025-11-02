const Keranjang = require('../models/Keranjang');
const Product = require('../models/Product');

const KeranjangController = {
  // GET /keranjangs
  getAll: (request, h) => {
    try {
      const { productId } = request.query;
      let items;
      
      if (productId) {
        items = Keranjang.findByProductId(productId);
      } else {
        items = Keranjang.findAll();
      }
      
      // Populate product data
      const itemsWithProduct = items.map(item => {
        const product = Product.findById(item.productId);
        return {
          ...item,
          product: product || null
        };
      });
      
      return h.response({
        status: 'success',
        data: itemsWithProduct
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // GET /keranjangs/{id}
  getById: (request, h) => {
    try {
      const { id } = request.params;
      const item = Keranjang.findById(id);
      
      if (!item) {
        return h.response({
          status: 'fail',
          message: 'Item tidak ditemukan'
        }).code(404);
      }
      
      const product = Product.findById(item.productId);
      const itemWithProduct = {
        ...item,
        product: product || null
      };
      
      return h.response({
        status: 'success',
        data: itemWithProduct
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // POST /keranjangs
  create: (request, h) => {
    try {
      const { productId, jumlah, totalHarga } = request.payload;
      
      if (!productId || !jumlah || !totalHarga) {
        return h.response({
          status: 'fail',
          message: 'Data tidak lengkap'
        }).code(400);
      }
      
      const item = Keranjang.create({ productId, jumlah, totalHarga });
      
      return h.response({
        status: 'success',
        message: 'Item berhasil ditambahkan ke keranjang',
        data: item
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // PUT /keranjangs/{id}
  update: (request, h) => {
    try {
      const { id } = request.params;
      const item = Keranjang.update(id, request.payload);
      
      if (!item) {
        return h.response({
          status: 'fail',
          message: 'Item tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Item berhasil diupdate',
        data: item
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // DELETE /keranjangs/{id}
  delete: (request, h) => {
    try {
      const { id } = request.params;
      const success = Keranjang.delete(id);
      
      if (!success) {
        return h.response({
          status: 'fail',
          message: 'Item tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Item berhasil dihapus'
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // DELETE /keranjangs
  clear: (request, h) => {
    try {
      Keranjang.clear();
      
      return h.response({
        status: 'success',
        message: 'Keranjang berhasil dikosongkan'
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  }
};

module.exports = KeranjangController;
