# Cashier App (kasir-app)

Aplikasi kasir (POS) full-stack dengan Next.js (Frontend) dan Hapi.js (Backend REST API).

## 📋 Deskripsi

Aplikasi kasir modern dengan arsitektur terpisah antara frontend dan backend, siap untuk integrasi database PostgreSQL/Supabase.

## 🏗️ Arsitektur

```
cashier-app/
├── app/                  # Next.js App Router (Frontend)
│   ├── page.js          # Home page (kasir interface)
│   ├── sukses/          # Success page after checkout
│   └── test/            # Test page
├── public/              # Static assets
│   └── assets/images/   # Product images (makanan, minuman, cemilan)
├── src/                 # Frontend source code
│   ├── components/      # React components
│   │   ├── Menus.js    # Product display & category filter
│   │   ├── Hasil.js    # Shopping cart display
│   │   └── TotalBayar.js # Payment summary
│   ├── lib/            # API client (axios)
│   ├── styles/         # CSS files
│   └── utils/          # Helper functions
└── backend/            # Backend API (Hapi.js)
    ├── src/
    │   ├── controllers/ # Business logic
    │   ├── models/      # In-memory data models
    │   ├── routes/      # API routes
    │   ├── config/      # CORS, env, logger, validation
    │   ├── utils/       # Response helpers
    │   └── index.js     # Server entry point
    ├── package.json
    └── API_DOCUMENTATION.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- PostgreSQL atau Supabase (opsional, untuk database)

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

Backend (backend/.env):
```bash
cd backend
cp .env.example .env
cd ..
```

Edit file `.env.local` dan `backend/.env` sesuai kebutuhan.

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

### Cart (Keranjangs)
```
GET    /api/keranjangs            # Get all cart items
GET    /api/keranjangs/:id        # Get by ID
POST   /api/keranjangs            # Add to cart
PUT    /api/keranjangs/:id        # Update quantity
DELETE /api/keranjangs/:id        # Remove from cart
DELETE /api/keranjangs             # Clear all cart
```

### Orders (Pesanans)
```
GET    /api/pesanans              # Get all orders
GET    /api/pesanans/:id          # Get by ID
POST   /api/pesanans              # Create order
PATCH  /api/pesanans/:id/status   # Update status
DELETE /api/pesanans/:id          # Delete order
```

📖 **Full API Documentation**: See [backend/API_DOCUMENTATION.md](./backend/API_DOCUMENTATION.md)

## 🗄️ Database Integration

### Setup Database (PostgreSQL)

1. Create database:
```sql
CREATE DATABASE cashier_db;
```

2. Configure `backend/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cashier_db
DB_USER=postgres
DB_PASSWORD=your_password
```

3. Update `backend/src/config/database.js` (create if not exists)
4. Implement queries di `backend/src/models/*.js`

### Setup Database (Supabase)

1. Buat project di [Supabase](https://supabase.com)
2. Copy URL dan API keys
3. Configure `backend/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## 📁 Struktur Backend

### Routes (`backend/src/routes/`)
Mendefinisikan endpoint dan mapping ke controller
- `categoryRoutes.js` - Category endpoints
- `productRoutes.js` - Product endpoints
- `keranjangRoutes.js` - Cart endpoints
- `pesananRoutes.js` - Order endpoints
- `healthRoutes.js` - Health check endpoint

### Controllers (`backend/src/controllers/`)
Business logic dan request handling
- `CategoryController.js`
- `ProductController.js`
- `KeranjangController.js`
- `PesananController.js`

### Models (`backend/src/models/`)
In-memory data storage (ready for database integration)
- `Category.js`
- `Product.js`
- `Keranjang.js`
- `Pesanan.js`

### Config (`backend/src/config/`)
Server configuration dan utilities
- `env.js` - Environment variables
- `cors.js` - CORS configuration
- `logger.js` - Logging setup
- `validation.js` - Input validation rules

## 🛠️ Development Guide

### Menambah Endpoint Baru

1. Buat route di `backend/src/routes/`
2. Buat controller di `backend/src/controllers/`
3. Buat model di `backend/src/models/` (jika perlu)
4. Register route di `backend/src/routes/index.js`

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
- Hapi.js 21
- Node.js
- @hapi/joi (validation)
- dotenv (environment variables)
- In-memory storage (ready for PostgreSQL/Supabase)

## 📝 TODO

Backend:
- [ ] Implement database connection (PostgreSQL/Supabase)
- [ ] Add authentication & authorization (JWT)
- [ ] Add request logging (winston/pino)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Add unit tests (Jest)
- [ ] Add rate limiting
- [ ] Add security headers

Frontend:
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add form validation
- [ ] Improve responsive design
- [ ] Add dark mode
- [ ] Add print receipt feature

## 📄 License

ISC

## 👤 Author

Hesa Firdaus

