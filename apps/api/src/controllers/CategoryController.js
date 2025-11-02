const Category = require('../models/Category');

const CategoryController = {
  // GET /categories
  getAll: (request, h) => {
    try {
      const categories = Category.findAll();
      return h.response({
        status: 'success',
        data: categories
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // GET /categories/{id}
  getById: (request, h) => {
    try {
      const { id } = request.params;
      const category = Category.findById(id);
      
      if (!category) {
        return h.response({
          status: 'fail',
          message: 'Kategori tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        data: category
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // POST /categories
  create: (request, h) => {
    try {
      const category = Category.create(request.payload);
      return h.response({
        status: 'success',
        message: 'Kategori berhasil ditambahkan',
        data: category
      }).code(201);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // PUT /categories/{id}
  update: (request, h) => {
    try {
      const { id } = request.params;
      const category = Category.update(id, request.payload);
      
      if (!category) {
        return h.response({
          status: 'fail',
          message: 'Kategori tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Kategori berhasil diupdate',
        data: category
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  },

  // DELETE /categories/{id}
  delete: (request, h) => {
    try {
      const { id } = request.params;
      const success = Category.delete(id);
      
      if (!success) {
        return h.response({
          status: 'fail',
          message: 'Kategori tidak ditemukan'
        }).code(404);
      }
      
      return h.response({
        status: 'success',
        message: 'Kategori berhasil dihapus'
      }).code(200);
    } catch (error) {
      return h.response({
        status: 'error',
        message: error.message
      }).code(500);
    }
  }
};

module.exports = CategoryController;
