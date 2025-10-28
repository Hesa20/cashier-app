# Cashier App (kasir-app)

Aplikasi kasir (POS) berbasis Next.js App Router dengan backend Hapi.js dan rencana integrasi Supabase/Postgres.

### Deskripsi singkat

Aplikasi kasir (POS) sederhana berbasis client-side JavaScript. Repo ini berisi versi front-end awal; ada rencana refactor ke Next.js + TypeScript dan integrasi backend (Postgres/Supabase + Hapi.js). README ini menjelaskan tujuan, fitur, cara menjalankan, skrip npm, contoh data, dan panduan singkat untuk pengembangan.

## Stack Teknologi

### Tujuan proyek

**Frontend:** Next.js 13 (App Router), React 18, React Bootstrap, FontAwesome, Axios, SweetAlert  

**Backend:** Hapi.js, Postgres/Supabase (planned), dotenv- Memberikan aplikasi kasir ringan untuk transaksi penjualan, manajemen keranjang, dan cetak struk sederhana.

- Menjadi basis yang mudah dimigrasi ke Next.js/TypeScript dan diintegrasikan dengan backend (Supabase/Hapi.js).

## Quick Start- Mudah dipakai di perangkat POS/tablet dengan antarmuka responsif.



```bashFitur utama

# Install dependencies

npm install --legacy-peer-deps- Daftar produk, pencarian sederhana.

- Menambah produk ke keranjang (cart) dan menghitung subtotal, diskon, dan pajak.

# Configure environment- Checkout transaksi dengan ringkasan pembayaran.

cp .env.example .env.local- Cetak/ekspor struk sederhana (client-side).

- Example/mock data for local testing has been removed in preparation for migration to a real backend (Postgres/Supabase). Use environment-configured seeds or Supabase for development.

# Run both frontend and backend- (Roadmap) Integrasi backend, autentikasi, laporan harian, manajemen stok.

npm run dev

```Teknologi (saat ini)



Akses:- JavaScript, HTML, CSS

- **Frontend**: http://localhost:3000- (Rencana) Next.js + TypeScript, Supabase (Postgres), Hapi.js untuk API

- **Backend API**: http://localhost:4000

## Struktur Proyek

```
app/          # Next.js App Router pages
src/
  components/ # Reusable UI components
  features/   # Feature modules
  lib/        # API client & utilities
  hooks/      # Custom hooks
  context/    # Global state
  styles/     # CSS
server/       # Hapi.js backend
public/       # Static assets
```

## API Endpoints (Mock)

- `GET /health` - Health check
- `GET /products?category.nama=Makanan` - Products
- `GET/POST/PUT/DELETE /keranjangs` - Cart operations
- `POST /pesanans` - Create order

## Migration Status

✅ Next.js App Router, Unified API client, Hapi.js scaffold, Environment config

# Cashier App (kasir-app)

Singkat
-------
Aplikasi kasir (POS) sederhana: frontend Next.js (App Router) + backend Hapi.js (folder `server/`). Project telah dimigrasi dari CRA dan disesuaikan untuk Next.js.

Quick start
-----------
1. Install deps:

```bash
npm install
```

2. Salin env dan set API:

```bash
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:4000
```

3. Jalankan (frontend + api):

```bash
npm run dev
```

Catatan penting
----------------
- Assets: taruh gambar di `public/assets/images/...` dan gunakan path `/assets/...`.
- Client env: `NEXT_PUBLIC_API_URL`.
- `react-router-dom` dihapus; navigasi sekarang via Next.js router.
- API client ada di `src/lib/api.js` (axios).

Scripts utama
-------------
- `npm run dev` — dev (Next.js + Hapi api)
- `npm run dev:web` — Next.js dev saja
- `npm run dev:api` — jalankan server Hapi
- `npm run build` — build Next.js

Struktur proyek (singkat)
------------------------
```
app/            # Next.js App Router
public/         # static assets (images, etc.)
src/components/ # UI components
src/lib/        # API client & utilities
server/         # Hapi.js backend (dev)
```
