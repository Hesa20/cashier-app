class Category {
  constructor() {
    // In-memory storage (replace with database later)
    this.categories = [
      { id: 1, nama: 'Makanan', createdAt: new Date().toISOString() },
      { id: 2, nama: 'Minuman', createdAt: new Date().toISOString() },
      { id: 3, nama: 'Cemilan', createdAt: new Date().toISOString() }
    ];
    this.nextId = 4;
  }

  findAll() {
    return this.categories;
  }

  findById(id) {
    return this.categories.find(cat => cat.id === parseInt(id));
  }

  create(data) {
    const newCategory = {
      id: this.nextId++,
      nama: data.nama,
      createdAt: new Date().toISOString()
    };
    this.categories.push(newCategory);
    return newCategory;
  }

  update(id, data) {
    const index = this.categories.findIndex(cat => cat.id === parseInt(id));
    if (index === -1) return null;
    
    this.categories[index] = {
      ...this.categories[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    return this.categories[index];
  }

  delete(id) {
    const index = this.categories.findIndex(cat => cat.id === parseInt(id));
    if (index === -1) return false;
    
    this.categories.splice(index, 1);
    return true;
  }
}

module.exports = new Category();
