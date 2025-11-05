const Category = require('../models/Category');
const supabase = require('../config/supabase');

const CategoryController = {
  // GET /categories
  getAll: async (request, h) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, description, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      // Transform untuk frontend (nama field yang diharapkan)
      const categories = data.map(cat => ({
        id: cat.id,
        nama: cat.name,
        description: cat.description,
        createdAt: cat.created_at,
        updatedAt: cat.updated_at
      }));

      return h.response({ status: 'success', data: categories }).code(200);
    } catch (error) {
      console.error('CategoryController.getAll error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // GET /categories/{id}
  getById: async (request, h) => {
    try {
      const { id } = request.params;
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Kategori tidak ditemukan' }).code(404);
        }
        throw new Error(error.message);
      }

      return h.response({
        status: 'success',
        data: {
          id: data.id,
          nama: data.name,
          description: data.description,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        }
      }).code(200);
    } catch (error) {
      console.error('CategoryController.getById error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // POST /categories
  create: async (request, h) => {
    try {
      const { nama, description } = request.payload;
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: nama, description: description || '' }])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return h.response({
        status: 'success',
        message: 'Kategori berhasil ditambahkan',
        data: {
          id: data.id,
          nama: data.name,
          description: data.description
        }
      }).code(201);
    } catch (error) {
      console.error('CategoryController.create error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // PUT /categories/{id}
  update: async (request, h) => {
    try {
      const { id } = request.params;
      const { nama, description } = request.payload;
      
      const updates = {};
      if (nama !== undefined) updates.name = nama;
      if (description !== undefined) updates.description = description;
      
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Kategori tidak ditemukan' }).code(404);
        }
        throw new Error(error.message);
      }

      return h.response({
        status: 'success',
        message: 'Kategori berhasil diupdate',
        data: {
          id: data.id,
          nama: data.name,
          description: data.description
        }
      }).code(200);
    } catch (error) {
      console.error('CategoryController.update error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // DELETE /categories/{id}
  delete: async (request, h) => {
    try {
      const { id } = request.params;
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      return h.response({ status: 'success', message: 'Kategori berhasil dihapus' }).code(200);
    } catch (error) {
      console.error('CategoryController.delete error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }
};

module.exports = CategoryController;
