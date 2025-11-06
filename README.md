# Cashier App (kasir-app)

Aplikasi kasir (POS) full-stack dengan Next.js (Frontend) dan Hapi.js (Backend REST API).

## 📋 Deskripsi

Aplikasi kasir modern dengan arsitektur terpisah antara frontend dan backend, **terintegrasi dengan Supabase** (PostgreSQL database + REST API).

## 🏗️ Arsitektur

**Struktur Mono-Repo** (npm workspaces):

```
cashier-app/
├── apps/
│   └── api/             # Backend API (Hapi.js) - dipindah dari backend/
│       ├── src/
│       │   ├── controllers/
│       │   ├── models/
│       │   ├── routes/
│       │   ├── config/
│       │   └── index.js
│       ├── package.json
│       └── README.md
│
├── packages/
│   └── common/          # Shared code (validation, types, utils)
│       ├── package.json
│       ├── index.js
│       └── README.md
│
├── app/                 # Next.js App Router (Frontend - masih di root)
│   ├── page.js         # Kasir interface
│   ├── sukses/         # Success page
│   └── test/           # Test page
│
├── src/                 # Frontend source (masih di root)
│   ├── components/     # React components
│   ├── lib/           # API client (axios)
│   ├── styles/        # CSS
│   └── utils/         # Helpers
│
├── public/             # Static assets (masih di root)
│   └── assets/images/ # Product images
│
└── package.json        # Root workspace config
```

> 📖 **Detail struktur**: Lihat [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md) untuk penjelasan lengkap struktur mono-repo, fase migrasi, dan rencana ke depan.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 atau lebih tinggi)
- npm atau yarn
- Supabase account (untuk database & backend API)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd cashier-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**

Frontend (.env.local):
```bash
cp .env.example .env.local
```

Backend (apps/api/.env):
```bash
cd apps/api
cp .env.example .env
cd ../..
```

Edit file `.env.local` dan `apps/api/.env` sesuai kebutuhan.

4. **Run development servers**
```bash
npm run dev
```

Ini akan menjalankan:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend & backend (development) |
| `npm run dev:web` | Run frontend only |
| `npm run dev:api` | Run backend API only |
| `npm run build` | Build frontend for production |
| `npm start` | Start production server |

## 📡 API Endpoints

Base URL: `http://localhost:4000/api`

### Health Check
```
GET /api/health
```

### Products
```
GET    /api/products              # Get all products
GET    /api/products?categoryId=1 # Filter by category ID
GET    /api/products/:id          # Get by ID
POST   /api/products              # Create new
PUT    /api/products/:id          # Update
DELETE /api/products/:id          # Delete
PATCH  /api/products/:id/stok     # Update stock
```

### Categories
```
GET    /api/categories            # Get all
GET    /api/categories/:id        # Get by ID
POST   /api/categories            # Create
PUT    /api/categories/:id        # Update
DELETE /api/categories/:id        # Delete
```

### Orders
```
GET    /api/orders                # Get all orders
GET    /api/orders/:id            # Get by ID with items
POST   /api/orders                # Create order (auto stock update)
PATCH  /api/orders/:id/status     # Update status
DELETE /api/orders/:id            # Delete order
```

**Note**: Cart (Keranjang) endpoints sudah dihapus. Gunakan state management di frontend untuk keranjang belanja.

📖 **Full API Documentation**: See [apps/api/API_DOCUMENTATION.md](./apps/api/API_DOCUMENTATION.md)

## 🗄️ Database Integration

### ✅ Database Sudah Terintegrasi (Supabase)

Backend sudah **fully integrated** dengan Supabase PostgreSQL menggunakan `@supabase/supabase-js` client.

**Current Setup:**
- Database: Supabase PostgreSQL
- Client: `@supabase/supabase-js` v2.79.0
- Schema: Categories, Products, Orders, Order Items (UUID primary keys)
- Connection: REST API over HTTPS (bypass IPv6 issues)

**Environment Variables** (`apps/api/.env`):
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

**Database Schema:**
```sql
-- Categories: UUID, name, description
-- Products: UUID, name, description, price, stock, image_url, category_id, is_active
-- Orders: UUID, order_number, total_amount, status, payment_method, paid_amount, change_amount
-- Order Items: UUID, order_id, product_id, product_name, quantity, price, subtotal
```

📖 **Migration dari in-memory**: Semua controllers sudah menggunakan Supabase client. In-memory models dihapus.

## 📁 Struktur Backend

> **Lokasi**: `apps/api/`

### Routes (`apps/api/src/routes/`)
Mendefinisikan endpoint dan mapping ke controller
- `categoryRoutes.js` - Category endpoints
- `productRoutes.js` - Product endpoints
- `orderRoutes.js` - Order endpoints (menggantikan keranjangRoutes & pesananRoutes)
- `healthRoutes.js` - Health check endpoint

### Controllers (`apps/api/src/controllers/`)
Business logic dan request handling (menggunakan Supabase client)
- `CategoryController.js` - ✅ Supabase integrated
- `ProductController.js` - ✅ Supabase integrated
- `OrderController.js` - ✅ Supabase integrated (menggantikan Pesanan & Keranjang)

### Models (`apps/api/src/models/`)
Legacy in-memory models (sudah tidak digunakan - semua menggunakan Supabase)
- `Category.js` - Deprecated (gunakan Supabase)
- `Product.js` - Deprecated (gunakan Supabase)

### Config (`apps/api/src/config/`)
Server configuration dan utilities
- `env.js` - Environment variables validation
- `cors.js` - CORS configuration
- `logger.js` - Logging setup
- `validation.js` - Input validation rules (Joi schemas)
- `supabase.js` - ✅ Supabase client initialization

## 🛠️ Development Guide

### Menambah Endpoint Baru

1. Buat route di `apps/api/src/routes/`
2. Buat controller di `apps/api/src/controllers/`
3. Buat model di `apps/api/src/models/` (jika perlu)
4. Register route di `apps/api/src/routes/index.js`

### Menambah Komponen Frontend

1. Buat komponen di `src/components/`
2. Export dari `src/components/index.js`
3. Import dan gunakan di page (`app/`)
4. Style di `src/styles/`

## 📦 Tech Stack

### Frontend
- Next.js 13 (App Router)
- React 18
- React Bootstrap
- Axios
- SweetAlert
- FontAwesome

### Backend
- Hapi.js 21.3.2
- Node.js 18+
- @hapi/joi 17.1.1 (validation with UUID support)
- @supabase/supabase-js 2.79.0 (database client)
- pg 8.11.0 (PostgreSQL driver - optional)
- dotenv 16.3.1 (environment variables)
- ✅ **Supabase PostgreSQL** (production database)

## 📝 TODO

Backend:
- [x] Implement database connection (Supabase PostgreSQL)
- [x] Migrate controllers to use Supabase client
- [x] Update validation schemas for UUID primary keys
- [x] Remove legacy Keranjang/Pesanan controllers (gunakan Order)
- [ ] Add authentication & authorization (Supabase Auth + RLS)
- [ ] Add request logging (winston/pino)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit tests (Jest)
- [ ] Add rate limiting
- [ ] Add security headers
- [ ] Implement order number generation logic
- [ ] Add receipt generation (PDF/print)

Frontend:
- [ ] Update API calls ke endpoint /api/orders (ganti dari /api/pesanans)
- [ ] Handle UUID format untuk product/category IDs
- [ ] Remove keranjang API calls (gunakan local state)
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add form validation
- [ ] Improve responsive design
- [ ] Add dark mode
- [ ] Add print receipt feature
- [ ] Integrate with Supabase Auth

## 📄 License

MIT

## 👤 Author

Hesa Firdaus

