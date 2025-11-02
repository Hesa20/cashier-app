const Product = require('../models/Product');
const Category = require('../models/Category');

const ProductController = {
  // GET /products
  getAll: (request, h) => {
    try {
      const { categoryId, search } = request.query;
      const products = Product.findAll({ categoryId, search });
      
      // Populate category data
      const productsWithCategory = products.map(product => {
        const category = Category.findById(product.categoryId);
        return {
          ...product,
          category: category ? { id: category.id, nama: category.nama } : null
        };
      });
      
      return h.response({
        status: 'success',
        data: productsWithCategory
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // GET /products/{id}
  getById: (request, h) => {
    try {
      const { id } = request.params;
      const product = Product.findById(id);
      
      if (!product) {
        return h.response({
          status: 'fail',
          message: 'Produk tidak ditemukan'
        }).code(404);
      }
      
      const category = Category.findById(product.categoryId);
      const productWithCategory = {
        ...product,
        category: category ? { id: category.id, nama: category.nama } : null
      };
      
      return h.response({
        status: 'success',
        data: productWithCategory
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // POST /products
  create: (request, h) => {
    try {
      const { nama, harga, categoryId, gambar, kode, stok } = request.payload;
      
      // Validasi
      if (!nama || !harga || !categoryId || !kode) {
        return h.response({
          status: 'fail',
          message: 'Data tidak lengkap'
        }).code(400);
      }
      
      // Cek apakah kode sudah ada
      const existingProduct = Product.findByKode(kode);
      if (existingProduct) {
        return h.response({
          status: 'fail',
          message: 'Kode produk sudah digunakan'
        }).code(400);
      }
      
      const product = Product.create({ nama, harga, categoryId, gambar, kode, stok });
      
      return h.response({
        status: 'success',
        message: 'Produk berhasil ditambahkan',
        data: product
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // PUT /products/{id}
  update: (request, h) => {
    try {
      const { id } = request.params;
      const product = Product.update(id, request.payload);
      
      if (!product) {
        return h.response({
          status: 'fail',
          message: 'Produk tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Produk berhasil diupdate',
        data: product
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // DELETE /products/{id}
  delete: (request, h) => {
    try {
      const { id } = request.params;
      const success = Product.delete(id);
      
      if (!success) {
        return h.response({
          status: 'fail',
          message: 'Produk tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Produk berhasil dihapus'
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // PATCH /products/{id}/stok
  updateStok: (request, h) => {
    try {
      const { id } = request.params;
      const { jumlah } = request.payload;
      
      if (jumlah === undefined) {
        return h.response({
          status: 'fail',
          message: 'Jumlah harus diisi'
        }).code(400);
      }
      
      const product = Product.updateStok(id, jumlah);
      
      if (!product) {
        return h.response({
          status: 'fail',
          message: 'Produk tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Stok berhasil diupdate',
        data: product
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  }
};

module.exports = ProductController;
