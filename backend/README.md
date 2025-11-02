# Cashier App Backend

REST API backend untuk aplikasi kasir menggunakan Hapi.js.

## 📋 Features

- ✅ RESTful API architecture
- ✅ MVC pattern (Model-View-Controller)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Environment configuration
- ✅ In-memory data storage (ready for database integration)

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
```

### Run Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will run on: `http://localhost:4000`

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers & business logic
│   │   ├── CategoryController.js
│   │   ├── ProductController.js
│   │   ├── KeranjangController.js
│   │   └── PesananController.js
│   ├── models/            # Data models (in-memory storage)
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Keranjang.js
│   │   └── Pesanan.js
│   ├── routes/            # API routes definition
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── keranjangRoutes.js
│   │   ├── pesananRoutes.js
│   │   └── index.js
│   └── index.js           # Server initialization
├── package.json
├── .env
├── .env.example
└── API_DOCUMENTATION.md   # Detailed API docs
```

## 📡 API Endpoints

Base URL: `http://localhost:4000/api`

### Categories
- `GET /api/categories` - Get all
- `GET /api/categories/:id` - Get by ID
- `POST /api/categories` - Create
- `PUT /api/categories/:id` - Update
- `DELETE /api/categories/:id` - Delete

### Products
- `GET /api/products` - Get all (with filters)
- `GET /api/products/:id` - Get by ID
- `POST /api/products` - Create
- `PUT /api/products/:id` - Update
- `DELETE /api/products/:id` - Delete
- `PATCH /api/products/:id/stok` - Update stock

### Cart (Keranjang)
- `GET /api/keranjangs` - Get all
- `GET /api/keranjangs/:id` - Get by ID
- `POST /api/keranjangs` - Add to cart
- `PUT /api/keranjangs/:id` - Update item
- `DELETE /api/keranjangs/:id` - Remove item
- `DELETE /api/keranjangs` - Clear cart

### Orders (Pesanan)
- `GET /api/pesanans` - Get all
- `GET /api/pesanans/:id` - Get by ID
- `POST /api/pesanans` - Create order
- `PATCH /api/pesanans/:id/status` - Update status
- `DELETE /api/pesanans/:id` - Delete

📖 **Full API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🧪 Testing

### Test Health Check
```bash
curl http://localhost:4000/api/health
```

### Test Get Products
```bash
curl http://localhost:4000/api/products
```

### Test Get Categories
```bash
curl http://localhost:4000/api/categories
```

## 🔄 Database Integration

Currently using **in-memory storage** for development. To integrate with a real database:

### Option 1: PostgreSQL

1. Install pg:
```bash
npm install pg
```

2. Create `src/config/database.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

module.exports = pool;
```

3. Update models to use database queries instead of in-memory arrays

### Option 2: Supabase

1. Install Supabase client:
```bash
npm install @supabase/supabase-js
```

2. Create `src/config/supabase.js`:
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;
```

3. Update models to use Supabase queries

## 🛠️ Development

### Add New Endpoint

1. **Create Model** (`src/models/YourModel.js`):
```javascript
class YourModel {
  constructor() {
    this.items = [];
  }

  findAll() {
    return this.items;
  }

  // ... other methods
}

module.exports = new YourModel();
```

2. **Create Controller** (`src/controllers/YourController.js`):
```javascript
const YourModel = require('../models/YourModel');

const YourController = {
  getAll: (request, h) => {
    const items = YourModel.findAll();
    return h.response({ status: 'success', data: items }).code(200);
  },
  // ... other methods
};

module.exports = YourController;
```

3. **Create Routes** (`src/routes/yourRoutes.js`):
```javascript
const YourController = require('../controllers/YourController');

const yourRoutes = [
  {
    method: 'GET',
    path: '/api/your-endpoint',
    handler: YourController.getAll
  },
  // ... other routes
];

module.exports = yourRoutes;
```

4. **Register Routes** in `src/routes/index.js`:
```javascript
const yourRoutes = require('./yourRoutes');

const routes = [
  ...yourRoutes,
  // ... other routes
];
```

## 📦 Dependencies

- **@hapi/hapi** - Web framework
- **dotenv** - Environment variables
- **nodemon** (dev) - Auto-reload on file changes

## 🔐 Security Notes

For production:
- [ ] Update CORS settings to specific origins
- [ ] Add authentication & authorization
- [ ] Add input validation (Joi)
- [ ] Add rate limiting
- [ ] Use HTTPS
- [ ] Add request logging
- [ ] Add security headers

## 📝 TODO

- [ ] Implement database (PostgreSQL/Supabase)
- [ ] Add authentication (JWT)
- [ ] Add input validation (Joi)
- [ ] Add request logging (winston/pino)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit tests (Jest)
- [ ] Add integration tests
- [ ] Add CI/CD pipeline

## 📄 License

ISC
