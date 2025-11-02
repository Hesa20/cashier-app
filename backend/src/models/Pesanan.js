class Pesanan {
  constructor() {
    // In-memory storage (replace with database later)
    this.pesanans = [];
    this.nextId = 1;
  }

  findAll() {
    return this.pesanans;
  }

  findById(id) {
    return this.pesanans.find(p => p.id === parseInt(id));
  }

  create(data) {
    const newPesanan = {
      id: this.nextId++,
      items: data.items,
      totalHarga: data.totalHarga,
      metodePembayaran: data.metodePembayaran,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    this.pesanans.push(newPesanan);
    return newPesanan;
  }

  update(id, data) {
    const index = this.pesanans.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    
    this.pesanans[index] = {
      ...this.pesanans[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.pesanans[index];
  }

  updateStatus(id, status) {
    const pesanan = this.findById(id);
    if (!pesanan) return null;
    
    pesanan.status = status;
    pesanan.updatedAt = new Date().toISOString();
    return pesanan;
  }

  delete(id) {
    const index = this.pesanans.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    
    this.pesanans.splice(index, 1);
    return true;
  }
}

module.exports = new Pesanan();
