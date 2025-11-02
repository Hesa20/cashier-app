class Product {
  constructor() {
    // In-memory storage (replace with database later)
    this.products = [
      // Makanan (8 products)
      { id: 1, nama: 'Nasi Goreng', harga: 15000, categoryId: 1, gambar: 'nasi-goreng-telor.jpg', kode: 'NG-1', stok: 100 },
      { id: 2, nama: 'Mie Goreng', harga: 13000, categoryId: 1, gambar: 'mie-goreng.jpg', kode: 'MG-1', stok: 100 },
      { id: 3, nama: 'Ayam Goreng', harga: 18000, categoryId: 1, gambar: 'nasi-ayam-geprek.jpg', kode: 'AG-1', stok: 50 },
      { id: 4, nama: 'Sate Ayam', harga: 20000, categoryId: 1, gambar: 'sate-ayam.jpg', kode: 'SA-1', stok: 50 },
      { id: 5, nama: 'Nasi Uduk', harga: 12000, categoryId: 1, gambar: 'nasi-rames.jpg', kode: 'NU-1', stok: 80 },
      { id: 6, nama: 'Bakso', harga: 14000, categoryId: 1, gambar: 'bakso.jpg', kode: 'BS-1', stok: 60 },
      { id: 7, nama: 'Mie Ayam Bakso', harga: 16000, categoryId: 1, gambar: 'mie-ayam-bakso.jpg', kode: 'MAB-1', stok: 70 },
      { id: 8, nama: 'Lontong Opor', harga: 14000, categoryId: 1, gambar: 'lontong-opor-ayam.jpg', kode: 'LO-1', stok: 60 },
      
      // Minuman (4 products)
      { id: 9, nama: 'Es Teh', harga: 5000, categoryId: 2, gambar: 'es-teh.jpg', kode: 'ET-1', stok: 200 },
      { id: 10, nama: 'Es Jeruk', harga: 6000, categoryId: 2, gambar: 'es-jeruk.jpg', kode: 'EJ-1', stok: 150 },
      { id: 11, nama: 'Kopi', harga: 8000, categoryId: 2, gambar: 'coffe-late.jpg', kode: 'KP-1', stok: 100 },
      { id: 12, nama: 'Teh Hangat', harga: 4000, categoryId: 2, gambar: 'teh-hangat.jpg', kode: 'TH-1', stok: 120 },
      
      // Cemilan (3 products)
      { id: 13, nama: 'Kentang Goreng', harga: 12000, categoryId: 3, gambar: 'kentang-goreng.jpg', kode: 'KG-1', stok: 90 },
      { id: 14, nama: 'Burger', harga: 15000, categoryId: 3, gambar: 'cheese-burger.jpg', kode: 'BG-1', stok: 100 },
      { id: 15, nama: 'Pangsit', harga: 8000, categoryId: 3, gambar: 'pangsit.jpg', kode: 'PG-1', stok: 120 }
    ];
    this.nextId = 16;
  }

  findAll(filters = {}) {
    let results = [...this.products];
    
    if (filters.categoryId) {
      results = results.filter(p => p.categoryId === parseInt(filters.categoryId));
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(p => 
        p.nama.toLowerCase().includes(searchLower) || 
        p.kode.toLowerCase().includes(searchLower)
      );
    }
    
    return results;
  }

  findById(id) {
    return this.products.find(p => p.id === parseInt(id));
  }

  findByKode(kode) {
    return this.products.find(p => p.kode === kode);
  }

  create(data) {
    const newProduct = {
      id: this.nextId++,
      nama: data.nama,
      harga: data.harga,
      categoryId: data.categoryId,
      gambar: data.gambar || 'default.png',
      kode: data.kode,
      stok: data.stok || 0,
      createdAt: new Date().toISOString()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id, data) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.products[index];
  }

  delete(id) {
    const index = this.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    this.products.splice(index, 1);
    return true;
  }

  updateStok(id, jumlah) {
    const product = this.findById(id);
    if (!product) return null;
    
    product.stok += jumlah;
    product.updatedAt = new Date().toISOString();
    return product;
  }
}

module.exports = new Product();
