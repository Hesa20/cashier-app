# Cashier App Backend

REST API backend untuk aplikasi kasir menggunakan Hapi.js.

## 📋 Features

- ✅ RESTful API architecture
- ✅ MVC pattern (Model-View-Controller)
- ✅ CORS enabled
- ✅ Input validation with @hapi/joi (UUID support)
- ✅ Error handling
- ✅ Environment configuration
- ✅ Structured logging
- ✅ **Supabase PostgreSQL integration** (production-ready)
- ✅ **Database operations** (categories, products, orders, order_items)
- ✅ **Stock management** (automatic decrement on order creation)
- ✅ **Transaction support** (order + order_items creation)

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

# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Note**: Get your Supabase credentials from: Supabase Dashboard → Project Settings → API

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
apps/api/
├── src/
│   ├── controllers/        # Request handlers & business logic
│   │   ├── CategoryController.js   # CRUD categories (Supabase)
│   │   ├── ProductController.js    # CRUD products (Supabase + JOIN categories)
│   │   └── OrderController.js      # Create orders + order_items (Supabase transactions)
│   ├── models/            # Legacy in-memory models (tidak digunakan)
│   │   ├── Category.js
│   │   └── Product.js
│   ├── routes/            # API routes definition
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── healthRoutes.js
│   │   └── index.js
│   ├── config/            # Configuration files
│   │   ├── env.js        # Environment variables
│   │   ├── cors.js       # CORS settings
│   │   ├── logger.js     # Logging configuration
│   │   ├── validation.js # Joi validation schemas (UUID support)
│   │   └── supabase.js   # Supabase client initialization ✨
│   ├── utils/            # Utility functions
│   │   └── response.js   # Response helpers
│   ├── scripts/          # Debugging & testing scripts
│   │   ├── inspect-schema.js  # Inspect Supabase schema
│   │   └── test-pg.js         # Test PostgreSQL connectivity
│   ├── index.js          # Server initialization
│   └── test-db.js        # Supabase connection test
├── package.json
├── .env
├── .gitignore
├── README.md
├── API_DOCUMENTATION.md   # Detailed API docs
└── DEBUGGING_REPORT.md    # Comprehensive debugging documentation
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
- `GET /api/products` - Get all (with filters: category, is_active)
- `GET /api/products/:id` - Get by ID (with category join)
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete (set is_active=false)
- `PATCH /api/products/:id/stok` - Update stock

### Orders (✨ NEW - replaces /pesanans)
- `POST /api/orders` - Create order (with order_items, auto-decrement stock)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID

### ~~Cart (Keranjang)~~ - DEPRECATED
- ~~`GET /api/keranjangs`~~ - Deprecated, gunakan state management di frontend
- ~~`POST /api/keranjangs`~~ - Deprecated
- ~~`DELETE /api/keranjangs`~~ - Deprecated

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

### Test Create Product
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Nasi Goreng",
    "deskripsi": "Nasi goreng spesial",
    "harga": 15000,
    "stok": 20,
    "gambar": "nasi-goreng.jpg",
    "kategori": "CATEGORY_UUID_HERE"
  }'
```

### Test Create Order
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "keranjangs": [
      {
        "product_id": "PRODUCT_UUID_HERE",
        "jumlah": 2
      }
    ],
    "total_bayar": 30000,
    "uang_dibayar": 50000,
    "catatan": "Pedas sedang"
  }'
```

### Test Database Connection
```bash
node src/test-db.js
# Expected output: "✅ Koneksi ke Supabase berhasil!"
```

## 🔄 Database Integration

✅ **Status**: Fully integrated with **Supabase PostgreSQL**

### Database Schema

The API uses the following Supabase tables:

**categories** (UUID primary key):
- `id` - UUID (Primary Key)
- `name` - VARCHAR
- `description` - TEXT
- `created_at` - TIMESTAMP

**products** (UUID primary key):
- `id` - UUID (Primary Key)
- `name` - VARCHAR
- `description` - TEXT
- `price` - NUMERIC
- `stock` - INTEGER
- `image_url` - VARCHAR
- `category_id` - UUID (Foreign Key → categories.id)
- `is_active` - BOOLEAN (default: true, untuk soft delete)
- `created_at` - TIMESTAMP

**orders** (UUID primary key):
- `id` - UUID (Primary Key)
- `order_number` - VARCHAR (auto-generated: ORD-YYYYMMDD-XXXX)
- `total_amount` - NUMERIC
- `status` - VARCHAR (default: 'pending')
- `payment_method` - VARCHAR (default: 'cash')
- `paid_amount` - NUMERIC
- `change_amount` - NUMERIC
- `notes` - TEXT
- `created_at` - TIMESTAMP

**order_items** (UUID primary key):
- `id` - UUID (Primary Key)
- `order_id` - UUID (Foreign Key → orders.id)
- `product_id` - UUID (Foreign Key → products.id)
- `product_name` - VARCHAR (snapshot saat order dibuat)
- `quantity` - INTEGER
- `price` - NUMERIC (snapshot saat order dibuat)
- `subtotal` - NUMERIC
- `created_at` - TIMESTAMP

### Migration Notes

The backend has been migrated from in-memory storage to Supabase:

- **Database Client**: `@supabase/supabase-js` (v2.79.0)
- **Connection Method**: REST API over HTTPS (bypasses direct PostgreSQL connection issues)
- **Primary Keys**: All tables use UUID (not SERIAL integers)
- **Column Mapping**: Database columns (snake_case) mapped to frontend format (camelCase/Indonesian)
  - `name` → `nama`
  - `price` → `harga`
  - `stock` → `stok`
  - etc.

### Debugging Tools

**Inspect Supabase Schema**:
```bash
node src/scripts/inspect-schema.js
# Shows all tables, columns, types, constraints
```

**Test PostgreSQL Connection**:
```bash
node src/scripts/test-pg.js
# Tests direct pg connection (for debugging)
```

**Test Supabase Client**:
```bash
node src/test-db.js
# Validates Supabase client connection
```

### Environment Variables

Required in `.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> ⚠️ **Security**: Never commit `.env` file. Use service role key for backend only (not public anon key).

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

### Production Dependencies
- **@hapi/hapi** (^21.3.2) - Web framework
- **@hapi/joi** (^17.1.1) - Input validation (with UUID support)
- **@supabase/supabase-js** (^2.79.0) - Supabase client for database operations
- **dotenv** (^16.3.1) - Environment variables

### Development Dependencies
- **nodemon** (^3.0.1) - Auto-reload during development

### Testing/Debugging Tools (not in package.json)
- `src/test-db.js` - Test Supabase connection
- `src/scripts/inspect-schema.js` - Inspect database schema
- `src/scripts/test-pg.js` - Test direct PostgreSQL connection

## 🔐 Security Notes

For production:
- [x] CORS configuration (configurable via `src/config/cors.js`)
- [x] Input validation with @hapi/joi (UUID validation)
- [x] Environment-based configuration (dotenv)
- [x] Supabase service role key (server-side only)
- [ ] Add authentication & authorization (Supabase Auth + RLS)
- [ ] Add rate limiting (hapi-rate-limit)
- [ ] Use HTTPS (handled by deployment platform)
- [ ] Add request logging (winston/pino)
- [ ] Add security headers (@hapi/helmet)
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Add API key authentication untuk internal services

## 📝 TODO

- [x] Implement database (Supabase PostgreSQL) ✅
- [x] UUID primary keys & validation ✅
- [x] Order creation with order_items ✅
- [x] Stock management (auto-decrement) ✅
- [ ] Add authentication (Supabase Auth)
- [ ] Add Row Level Security (RLS) policies
- [ ] Add request logging (winston/pino)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit tests (Jest)
- [ ] Add integration tests
- [ ] Add CI/CD pipeline
- [ ] Add rate limiting middleware
- [ ] Add caching layer (Redis/Supabase Edge Caching)
- [ ] Add receipt generation (PDF)
- [ ] Add order status update endpoint
- [ ] Add order history/reporting endpoints

## 📄 License

ISC
