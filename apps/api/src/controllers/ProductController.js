const Product = require('../models/Product');
const supabase = require('../config/supabase');

const ProductController = {
  // GET /products
  getAll: async (request, h) => {
    try {
      const { categoryId, search } = request.query;
      
      let query = supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true);

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw new Error(error.message);

      const products = data.map(prod => ({
        id: prod.id,
        nama: prod.name,
        deskripsi: prod.description,
        harga: parseFloat(prod.price),
        stok: prod.stock,
        gambar: prod.image_url || 'default.png', // Default image if null
        categoryId: prod.category_id,
        category: prod.categories ? { nama: prod.categories.name } : null
      }));

      return h.response({ status: 'success', data: products }).code(200);
    } catch (error) {
      console.error('ProductController.getAll error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // GET /products/{id}
  getById: async (request, h) => {
    try {
      const { id } = request.params;
      
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Produk tidak ditemukan' }).code(404);
        }
        throw new Error(error.message);
      }

      const product = {
        id: data.id,
        nama: data.name,
        deskripsi: data.description,
        harga: parseFloat(data.price),
        stok: data.stock,
        gambar: data.image_url || 'default.png', // Default image if null
        categoryId: data.category_id,
        category: data.categories ? { nama: data.categories.name } : null
      };

      return h.response({ status: 'success', data: product }).code(200);
    } catch (error) {
      console.error('ProductController.getById error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // POST /products
  create: async (request, h) => {
    try {
      const { nama, deskripsi, harga, stok, gambar, categoryId } = request.payload;
      
      if (!nama || !harga) {
        return h.response({ status: 'fail', message: 'Nama dan harga harus diisi' }).code(400);
      }

      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: nama,
          description: deskripsi || '',
          price: harga,
          stock: stok || 0,
          image_url: gambar || null,
          category_id: categoryId || null,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);

      return h.response({
        status: 'success',
        message: 'Produk berhasil ditambahkan',
        data: {
          id: data.id,
          nama: data.name,
          deskripsi: data.description,
          harga: parseFloat(data.price),
          stok: data.stock,
          gambar: data.image_url || 'default.png', // Default image if null
          categoryId: data.category_id
        }
      }).code(201);
    } catch (error) {
      console.error('ProductController.create error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // PUT /products/{id}
  update: async (request, h) => {
    try {
      const { id } = request.params;
      const { nama, deskripsi, harga, stok, gambar, categoryId } = request.payload;
      
      const updates = {};
      if (nama !== undefined) updates.name = nama;
      if (deskripsi !== undefined) updates.description = deskripsi;
      if (harga !== undefined) updates.price = harga;
      if (stok !== undefined) updates.stock = stok;
      if (gambar !== undefined) updates.image_url = gambar;
      if (categoryId !== undefined) updates.category_id = categoryId;

      if (Object.keys(updates).length === 0) {
        return h.response({ status: 'fail', message: 'Tidak ada field yang diupdate' }).code(400);
      }

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .eq('is_active', true)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Produk tidak ditemukan' }).code(404);
        }
        throw new Error(error.message);
      }

      return h.response({
        status: 'success',
        message: 'Produk berhasil diupdate',
        data: {
          id: data.id,
          nama: data.name,
          deskripsi: data.description,
          harga: parseFloat(data.price),
          stok: data.stock,
          gambar: data.image_url || 'default.png', // Default image if null
          categoryId: data.category_id
        }
      }).code(200);
    } catch (error) {
      console.error('ProductController.update error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // DELETE /products/{id}
  delete: async (request, h) => {
    try {
      const { id } = request.params;
      
      // Soft delete
      const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw new Error(error.message);

      return h.response({ status: 'success', message: 'Produk berhasil dihapus' }).code(200);
    } catch (error) {
      console.error('ProductController.delete error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // PATCH /products/{id}/stok
  updateStok: async (request, h) => {
    try {
      const { id } = request.params;
      const { jumlah } = request.payload;
      
      if (!jumlah) {
        return h.response({ status: 'fail', message: 'Jumlah harus diisi' }).code(400);
      }

      // Get current stock
      const { data: currentData, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Produk tidak ditemukan' }).code(404);
        }
        throw new Error(fetchError.message);
      }

      const newStock = currentData.stock + jumlah;

      const { data, error } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', id)
        .select('stock')
        .single();

      if (error) throw new Error(error.message);

      return h.response({
        status: 'success',
        message: 'Stok berhasil diupdate',
        data: { stok: data.stock }
      }).code(200);
    } catch (error) {
      console.error('ProductController.updateStok error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }
};

module.exports = ProductController;
