const supabase = require('../config/supabase');

const OrderController = {
  // GET /orders
  getAll: async (request, h) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw new Error(error.message);

      const orders = data.map(order => ({
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: parseFloat(order.total_amount),
        status: order.status,
        paymentMethod: order.payment_method,
        paidAmount: order.paid_amount ? parseFloat(order.paid_amount) : null,
        changeAmount: order.change_amount ? parseFloat(order.change_amount) : null,
        notes: order.notes,
        createdAt: order.created_at
      }));

      return h.response({ status: 'success', data: orders }).code(200);
    } catch (error) {
      console.error('OrderController.getAll error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // GET /orders/{id}
  getById: async (request, h) => {
    try {
      const { id } = request.params;
      
      // Get order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) {
        if (orderError.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Order tidak ditemukan' }).code(404);
        }
        throw new Error(orderError.message);
      }

      // Get order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', id);

      if (itemsError) throw new Error(itemsError.message);

      return h.response({
        status: 'success',
        data: {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          paymentMethod: order.payment_method,
          paidAmount: order.paid_amount ? parseFloat(order.paid_amount) : null,
          changeAmount: order.change_amount ? parseFloat(order.change_amount) : null,
          notes: order.notes,
          createdAt: order.created_at,
          items: items.map(item => ({
            id: item.id,
            productId: item.product_id,
            productName: item.product_name,
            jumlah: item.quantity,
            harga: parseFloat(item.price),
            subtotal: parseFloat(item.subtotal)
          }))
        }
      }).code(200);
    } catch (error) {
      console.error('OrderController.getById error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // POST /orders
  create: async (request, h) => {
    try {
      const { items, totalAmount, paymentMethod, paidAmount, notes } = request.payload;
      
      if (!items || !totalAmount || !paymentMethod) {
        return h.response({
          status: 'fail',
          message: 'Data tidak lengkap (items, totalAmount, paymentMethod diperlukan)'
        }).code(400);
      }

      // Generate order number
      const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const { count, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .like('order_number', `ORD-${dateStr}%`);

      if (countError) throw new Error(countError.message);

      const orderNumber = `ORD-${dateStr}-${String((count || 0) + 1).padStart(4, '0')}`;
      const changeAmount = paidAmount ? paidAmount - totalAmount : 0;

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          order_number: orderNumber,
          total_amount: totalAmount,
          status: 'completed',
          payment_method: paymentMethod,
          paid_amount: paidAmount || totalAmount,
          change_amount: changeAmount,
          notes: notes || null
        }])
        .select()
        .single();

      if (orderError) throw new Error(orderError.message);

      // Process each item
      for (const item of items) {
        // Get product info
        const { data: product, error: prodError } = await supabase
          .from('products')
          .select('name, price, stock')
          .eq('id', item.productId)
          .single();

        if (prodError) {
          // Rollback order (delete it)
          await supabase.from('orders').delete().eq('id', order.id);
          return h.response({
            status: 'fail',
            message: `Produk dengan ID ${item.productId} tidak ditemukan`
          }).code(404);
        }

        if (product.stock < item.jumlah) {
          // Rollback order
          await supabase.from('orders').delete().eq('id', order.id);
          return h.response({
            status: 'fail',
            message: `Stok ${product.name} tidak mencukupi (tersedia: ${product.stock})`
          }).code(400);
        }

        // Update stock
        const { error: stockError } = await supabase
          .from('products')
          .update({ stock: product.stock - item.jumlah })
          .eq('id', item.productId);

        if (stockError) {
          await supabase.from('orders').delete().eq('id', order.id);
          throw new Error(stockError.message);
        }

        // Insert order item
        const subtotal = parseFloat(product.price) * item.jumlah;
        const { error: itemError } = await supabase
          .from('order_items')
          .insert([{
            order_id: order.id,
            product_id: item.productId,
            product_name: product.name,
            quantity: item.jumlah,
            price: product.price,
            subtotal: subtotal
          }]);

        if (itemError) {
          await supabase.from('orders').delete().eq('id', order.id);
          throw new Error(itemError.message);
        }
      }

      return h.response({
        status: 'success',
        message: 'Order berhasil dibuat',
        data: {
          id: order.id,
          orderNumber: order.order_number,
          totalAmount: parseFloat(order.total_amount),
          status: order.status,
          paymentMethod: order.payment_method
        }
      }).code(201);
    } catch (error) {
      console.error('OrderController.create error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // PATCH /orders/{id}/status
  updateStatus: async (request, h) => {
    try {
      const { id } = request.params;
      const { status } = request.payload;
      
      if (!status) {
        return h.response({ status: 'fail', message: 'Status harus diisi' }).code(400);
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select('id, order_number, status')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return h.response({ status: 'fail', message: 'Order tidak ditemukan' }).code(404);
        }
        throw new Error(error.message);
      }

      return h.response({
        status: 'success',
        message: 'Status order berhasil diupdate',
        data: {
          id: data.id,
          orderNumber: data.order_number,
          status: data.status
        }
      }).code(200);
    } catch (error) {
      console.error('OrderController.updateStatus error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  },

  // DELETE /orders/{id}
  delete: async (request, h) => {
    try {
      const { id } = request.params;
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      return h.response({ status: 'success', message: 'Order berhasil dihapus' }).code(200);
    } catch (error) {
      console.error('OrderController.delete error:', error.message);
      return h.response({ status: 'error', message: error.message }).code(500);
    }
  }
};

module.exports = OrderController;
