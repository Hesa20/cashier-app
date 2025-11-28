# Cashier App (kasir-app)

Aplikasi kasir atau Point-of-Sales (POS) untuk Coffe Shop. 

## Deskripsi
Aplikasi kasir full-stack yang dibangun dengan Next.js (App Router) untuk frontend dan Hapi.js sebagai backend REST API. Mengadopsi arsitektur monorepo modular (npm workspaces) yang memisahkan kode frontend dan backend untuk memudahkan pengembangan, pemeliharaan, dan deployment. Terintegrasi dengan Supabase (PostgreSQL) untuk penyimpanan data dan autentikasi, serta Railway untuk hosting REST API. Mendukung manajemen produk, kategori, dan pesanan, serta penggunaan UUID sebagai primary key.

## Struktur Direktori Proyek

**Mono-Repo** (npm workspaces):

```
cashier-app/
├── apps/
│   └── api/             # Backend API (Hapi.js)
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
├── app/                # Next.js App Router (di root)
│   ├── page.js         # Kasir interface
│   ├── sukses/         # Success page
│   └── test/           # Test page
│
├── src/                # Frontend source (di root)
│   ├── components/     # React components
│   ├── lib/            # API client (axios)
│   ├── styles/         # CSS
│   └── utils/          # Helpers
│
├── public/             # Static assets
│   └── assets/images/  # Product images
│   └── (Note: legacy `public/index.html` removed — `public/` only contains static assets for Next.js)
│
└── package.json        # Root workspace config
```

## Quick Start

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

## Tech Stack

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
- Supabase PostgreSQL (production database)

## TODO

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

## License

MIT

## 👤 Author

Hesa Firdaus

