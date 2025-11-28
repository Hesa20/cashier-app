# Cashier App Backend

REST API backend menggunakan Hapi.js.

## Features

- RESTful API architecture
- MVC pattern (Model-View-Controller)
- CORS enabled
- Input validation with @hapi/joi (UUID support)
- Error handling
- Environment configuration
- Structured logging
- **Supabase PostgreSQL integration** (production-ready)
- **Database operations** (categories, products, orders, order_items)
- **Stock management** (automatic decrement on order creation)
- **Transaction support** (order + order_items creation)

## Struktur Backend

> **Lokasi**: `apps/api/`

### Routes (`apps/api/src/routes/`)
Mendefinisikan endpoint dan mapping ke controller
- `categoryRoutes.js` - Category endpoints
- `productRoutes.js` - Product endpoints
- `orderRoutes.js` - Order endpoints (menggantikan keranjangRoutes & pesananRoutes)
- `healthRoutes.js` - Health check endpoint

### Controllers (`apps/api/src/controllers/`)
Business logic dan request handling (menggunakan Supabase client)
- `CategoryController.js` - Supabase integrated
- `ProductController.js` - Supabase integrated
- `OrderController.js` - Supabase integrated (menggantikan Pesanan & Keranjang)

### Models (`apps/api/src/models/`)
Model in-memory legacy (deprecated) — sudah tidak digunakan; gunakan Supabase untuk semua operasi database (contoh: `Category.js`).
- `Product.js` - Deprecated (gunakan Supabase)

### Config (`apps/api/src/config/`)
Server configuration dan utilities
- `env.js` - Environment variables validation
- `cors.js` - CORS configuration
- `logger.js` - Logging setup
- `validation.js` - Input validation rules (Joi schemas)
- `supabase.js` - Supabase client initialization

## Quick Start

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
> Catatan: Ambil kredensial Supabase dari: Supabase Dashboard → Project Settings → API

### Menjalankan Server
```bash
# Dev (auto-reload)
npm run dev

# Production
npm start
```
Server: http://localhost:4000

## Tes Singkat
- Health: curl http://localhost:4000/api/health
- Get Products: curl http://localhost:4000/api/products
- Create Product / Order: gunakan contoh JSON di README untuk curl POST
- Supabase test: node src/test-db.js


## Database Schema

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  image_url VARCHAR(500),
  category_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cash',
  paid_amount NUMERIC NOT NULL CHECK (paid_amount >= 0),
  change_amount NUMERIC NOT NULL CHECK (change_amount >= 0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### order_items
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL CHECK (price >= 0),
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Catatan Database
Tabel utama: categories, products, orders, order_items. Semua menggunakan UUID PK. Produk pakai is_active untuk soft-delete. Order menurunkan stok dan menyimpan snapshot produk pada order_items.

Contoh kolom penting:
- products: id, name, price, stock, category_id, is_active
- orders: id, order_number, total_amount, paid_amount, change_amount, status
- order_items: id, order_id, product_id, product_name, quantity, price, subtotal

## Env (wajib)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
```
## Pengembangan Cepat
- Tambah controller & route, daftar di src/routes/index.js
- Gunakan validation (Joi) dan supabase client untuk DB

## Dependensi Utama
- @hapi/hapi, @hapi/joi, @supabase/supabase-js, dotenv, pg
- Dev: nodemon

## Keamanan & TODO Singkat
- Sudah: CORS, validation, env config, Supabase integration
- Belum: Auth, RLS, rate limiting, request logging, CI/CD, unit/integration tests