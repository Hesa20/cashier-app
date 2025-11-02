# Cashier App (kasir-app)

Aplikasi kasir (POS) full-stack dengan Next.js (Frontend) dan Hapi.js (Backend REST API).

## 📋 Deskripsi

Aplikasi kasir modern dengan arsitektur terpisah antara frontend dan backend, siap untuk integrasi database PostgreSQL/Supabase.

## 🏗️ Arsitektur

```
cashier-app/
├── app/                  # Next.js App Router (Frontend)
├── public/              # Static assets
├── src/                 # Frontend source code
│   ├── components/      # React components
│   ├── lib/            # API client & utilities
│   ├── styles/         # CSS files
│   └── utils/          # Helper functions
└── server/             # Backend API (Hapi.js)
    ├── index.js        # Entry point
    └── src/
        ├── routes/     # API routes
        ├── controllers/# Business logic
        ├── models/     # Database models
        ├── config/     # Configuration
        ├── middleware/ # Custom middleware
        └── utils/      # Backend utilities
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

Backend (server/.env):
```bash
cd server
cp .env.example .env
cd ..
```

Edit file `.env.local` dan `server/.env` sesuai kebutuhan.

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

Base URL: `http://localhost:4000`

### Health Check
```
GET /health
```

### Products
```
GET    /products              # Get all products
GET    /products?category.nama=Makanan  # Filter by category
GET    /products/{id}         # Get by ID
POST   /products              # Create new
PUT    /products/{id}         # Update
DELETE /products/{id}         # Delete
```

### Categories
```
GET    /categories            # Get all
GET    /categories/{id}       # Get by ID
POST   /categories            # Create
PUT    /categories/{id}       # Update
DELETE /categories/{id}       # Delete
```

### Cart (Keranjangs)
```
GET    /keranjangs            # Get all cart items
GET    /keranjangs/{id}       # Get by ID
POST   /keranjangs            # Add to cart
PUT    /keranjangs/{id}       # Update quantity
DELETE /keranjangs/{id}       # Remove from cart
```

### Orders (Pesanans)
```
GET    /pesanans              # Get all orders
GET    /pesanans/{id}         # Get by ID
POST   /pesanans              # Create order
PUT    /pesanans/{id}         # Update order
DELETE /pesanans/{id}         # Delete order
```

## 🗄️ Database Integration

### Setup Database (PostgreSQL)

1. Create database:
```sql
CREATE DATABASE cashier_db;
```

2. Configure `server/.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cashier_db
DB_USER=postgres
DB_PASSWORD=your_password
```

3. Update `server/src/config/database.js`
4. Implement queries di `server/src/models/*.js`

### Setup Database (Supabase)

1. Buat project di [Supabase](https://supabase.com)
2. Copy URL dan API keys
3. Configure `server/.env`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

## 📁 Struktur Backend

### Routes (`server/src/routes/`)
Mendefinisikan endpoint dan mapping ke controller

### Controllers (`server/src/controllers/`)
Business logic dan request handling

### Models (`server/src/models/`)
Database queries dan data manipulation

### Config (`server/src/config/`)
Server dan database configuration

## 🛠️ Development Guide

### Menambah Endpoint Baru

1. Buat route di `server/src/routes/`
2. Buat controller di `server/src/controllers/`
3. Buat model di `server/src/models/`
4. Register route di `server/src/routes/index.js`

### Menambah Komponen Frontend

1. Buat komponen di `src/components/`
2. Import dan gunakan di page (`app/`)
3. Style di `src/styles/`

## 📦 Tech Stack

### Frontend
- Next.js 13 (App Router)
- React 18
- React Bootstrap
- Axios
- SweetAlert
- FontAwesome

### Backend
- Hapi.js
- Node.js
- PostgreSQL / Supabase (planned)

## 📝 TODO

Backend:
- [ ] Implement database connection
- [ ] Add authentication & authorization
- [ ] Add input validation (Joi)
- [ ] Add error handling middleware
- [ ] Add logging (winston/pino)
- [ ] Add API documentation (Swagger)
- [ ] Add unit tests

Frontend:
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add form validation
- [ ] Improve responsive design
- [ ] Add dark mode

## 📄 License

ISC

## 👤 Author

[Your Name]

