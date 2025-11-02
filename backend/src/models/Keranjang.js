class Keranjang {
  constructor() {
    // In-memory storage (replace with database later)
    this.items = [];
    this.nextId = 1;
  }

  findAll() {
    return this.items;
  }

  findById(id) {
    return this.items.find(item => item.id === parseInt(id));
  }

  findByProductId(productId) {
    return this.items.filter(item => item.productId === parseInt(productId));
  }

  create(data) {
    const newItem = {
      id: this.nextId++,
      productId: data.productId,
      jumlah: data.jumlah,
      totalHarga: data.totalHarga,
      keterangan: data.keterangan || '', // Added keterangan field
      createdAt: new Date().toISOString()
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id, data) {
    const index = this.items.findIndex(item => item.id === parseInt(id));
    if (index === -1) return null;
    
    this.items[index] = {
      ...this.items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.items[index];
  }

  delete(id) {
    const index = this.items.findIndex(item => item.id === parseInt(id));
    if (index === -1) return false;
    
    this.items.splice(index, 1);
    return true;
  }

  clear() {
    this.items = [];
    return true;
  }
}

module.exports = new Keranjang();
