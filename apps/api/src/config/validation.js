const Joi = require('@hapi/joi');

// Category validation schemas
const categorySchemas = {
  create: Joi.object({
    nama: Joi.string().min(3).max(50).required()
      .messages({
        'string.empty': 'Nama kategori tidak boleh kosong',
        'string.min': 'Nama kategori minimal 3 karakter',
        'string.max': 'Nama kategori maksimal 50 karakter',
        'any.required': 'Nama kategori wajib diisi'
      })
  }),
  
  update: Joi.object({
    nama: Joi.string().min(3).max(50)
      .messages({
        'string.min': 'Nama kategori minimal 3 karakter',
        'string.max': 'Nama kategori maksimal 50 karakter'
      })
  })
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    nama: Joi.string().min(3).max(100).required()
      .messages({
        'string.empty': 'Nama produk tidak boleh kosong',
        'string.min': 'Nama produk minimal 3 karakter',
        'string.max': 'Nama produk maksimal 100 karakter',
        'any.required': 'Nama produk wajib diisi'
      }),
    deskripsi: Joi.string().max(500).allow('').optional(),
    harga: Joi.number().min(0).required()
      .messages({
        'number.base': 'Harga harus berupa angka',
        'number.min': 'Harga tidak boleh negatif',
        'any.required': 'Harga wajib diisi'
      }),
    categoryId: Joi.string().uuid().optional().allow(null)
      .messages({
        'string.guid': 'Category ID harus berupa UUID yang valid'
      }),
    gambar: Joi.string().max(255).optional().allow(null, '')
      .messages({
        'string.max': 'Nama file gambar terlalu panjang'
      }),
    stok: Joi.number().integer().min(0).default(0)
      .messages({
        'number.base': 'Stok harus berupa angka',
        'number.min': 'Stok tidak boleh negatif'
      })
  }),
  
  update: Joi.object({
    nama: Joi.string().min(3).max(100),
    deskripsi: Joi.string().max(500).allow(''),
    harga: Joi.number().min(0),
    categoryId: Joi.string().uuid().allow(null),
    gambar: Joi.string().max(255).allow(null, ''),
    stok: Joi.number().integer().min(0)
  }).min(1).messages({
    'object.min': 'Minimal satu field harus diisi untuk update'
  }),
  
  updateStok: Joi.object({
    jumlah: Joi.number().integer().required()
      .messages({
        'number.base': 'Jumlah harus berupa angka',
        'any.required': 'Jumlah wajib diisi'
      })
  })
};

// Keranjang validation schemas
const keranjangSchemas = {
  create: Joi.object({
    productId: Joi.number().integer().required()
      .messages({
        'number.base': 'Product ID harus berupa angka',
        'any.required': 'Product ID wajib diisi'
      }),
    jumlah: Joi.number().integer().min(1).required()
      .messages({
        'number.base': 'Jumlah harus berupa angka',
        'number.min': 'Jumlah minimal 1',
        'any.required': 'Jumlah wajib diisi'
      }),
    totalHarga: Joi.number().integer().min(0).required()
      .messages({
        'number.base': 'Total harga harus berupa angka',
        'number.min': 'Total harga tidak boleh negatif',
        'any.required': 'Total harga wajib diisi'
      }),
    keterangan: Joi.string().max(255).allow('').optional().default('')
      .messages({
        'string.max': 'Keterangan maksimal 255 karakter'
      })
  }),
  
  update: Joi.object({
    jumlah: Joi.number().integer().min(1),
    totalHarga: Joi.number().integer().min(0),
    keterangan: Joi.string().max(255).allow('').optional()
      .messages({
        'string.max': 'Keterangan maksimal 255 karakter'
      })
  }).min(1).messages({
    'object.min': 'Minimal satu field harus diisi untuk update'
  })
};

// Pesanan validation schemas
const pesananSchemas = {
  create: Joi.object({
    items: Joi.array().min(1).items(
      Joi.object({
        productId: Joi.string().uuid().required(),
        jumlah: Joi.number().integer().min(1).required()
      })
    ).required()
      .messages({
        'array.min': 'Minimal harus ada 1 item',
        'any.required': 'Items wajib diisi'
      }),
    totalAmount: Joi.number().min(0).required()
      .messages({
        'number.base': 'Total harga harus berupa angka',
        'number.min': 'Total harga tidak boleh negatif',
        'any.required': 'Total harga wajib diisi'
      }),
    paymentMethod: Joi.string().valid('cash', 'debit', 'credit', 'ewallet').required()
      .messages({
        'any.only': 'Metode pembayaran harus salah satu dari: cash, debit, credit, ewallet',
        'any.required': 'Metode pembayaran wajib diisi'
      }),
    paidAmount: Joi.number().min(0).optional(),
    notes: Joi.string().max(255).allow('').optional()
  }),
  
  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'processing', 'completed', 'cancelled').required()
      .messages({
        'any.only': 'Status harus salah satu dari: pending, processing, completed, cancelled',
        'any.required': 'Status wajib diisi'
      })
  })
};

// Order validation (alias untuk pesanan, mengikuti schema Supabase)
const orderSchemas = pesananSchemas;

// Validation middleware
const validate = (schema) => {
  return (request, h) => {
    const { error, value } = schema.validate(request.payload, {
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return h.response({
        status: 'fail',
        message: 'Validasi gagal',
        errors
      }).code(400).takeover();
    }
    
    // Replace request.payload with validated and sanitized data
    request.payload = value;
    return h.continue;
  };
};

module.exports = {
  categorySchemas,
  productSchemas,
  keranjangSchemas,
  pesananSchemas,
  orderSchemas,
  validate,
  // Export validations yang siap pakai
  validateCategory: { payload: categorySchemas.create },
  validateCategoryUpdate: { payload: categorySchemas.update },
  validateProduct: { payload: productSchemas.create },
  validateProductUpdate: { payload: productSchemas.update },
  validateProductStok: { payload: productSchemas.updateStok },
  validateOrder: { payload: orderSchemas.create },
  validateOrderStatus: { payload: orderSchemas.updateStatus }
};
