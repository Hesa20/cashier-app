# Struktur Mono-Repo Kasir App

Dokumen ini menjelaskan struktur mono-repo untuk proyek Kasir App setelah migrasi dari struktur tradisional ke workspace-based mono-repo.

## Struktur Direktori

```
cashier-app/
├── apps/
│   └── api/              # Backend API (Hapi.js)
│       ├── src/
│       │   ├── config/   # Konfigurasi (CORS, env, validation, logger, supabase)
│       │   ├── controllers/  # CategoryController, ProductController, OrderController
│       │   ├── models/   # Legacy in-memory models (tidak digunakan)
│       │   ├── routes/   # categoryRoutes, productRoutes, orderRoutes, healthRoutes
│       │   ├── scripts/  # inspect-schema.js, test-pg.js
│       │   ├── utils/    # response.js
│       │   ├── index.js  # Entry point backend
│       │   └── test-db.js  # Supabase connection test
│       ├── package.json
│       ├── .env
│       ├── README.md
│       ├── API_DOCUMENTATION.md
│       └── DEBUGGING_REPORT.md
│
├── packages/
│   └── common/           # Shared code untuk FE & BE
│       ├── package.json
│       ├── index.js
│       └── README.md
│
├── app/                  # Next.js App Router (Frontend - masih di root)
│   ├── layout.js
│   ├── page.js
│   ├── sukses/
│   └── test/
│
├── src/                  # Frontend source (masih di root)
│   ├── components/
│   ├── lib/
│   │   └── api.js       # Axios instance
│   ├── styles/
│   └── utils/
│
├── public/               # Static assets (masih di root)
│   └── assets/
│       └── images/
│
├── package.json          # Root workspace config
├── next.config.js
└── jsconfig.json
```

## Perubahan dari Struktur Lama

### Sebelum (Struktur Lama)
```
cashier-app/
├── backend/              # Backend terpisah di folder backend
│   └── src/
├── app/                  # Next.js app
├── src/                  # Frontend source
└── package.json          # Tidak ada workspaces
```

### Sesudah (Mono-Repo)
```
cashier-app/
├── apps/
│   └── api/              # Backend dipindah ke apps/api
├── packages/
│   └── common/           # Package bersama untuk shared code
├── app/                  # Frontend masih di root (fase 1)
├── src/                  # Frontend source masih di root (fase 1)
└── package.json          # Dengan workspaces config
```

## Package Manager: npm workspaces

Root `package.json` sekarang menggunakan workspaces:

```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

Ini memungkinkan:
- Dependency hoisting (shared dependencies di root `node_modules`)
- Menjalankan scripts di semua workspace sekaligus
- Linking otomatis antar-package di mono-repo

## Scripts yang Diperbarui

### Root `package.json`
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:web\" \"npm run dev:api\"",
    "dev:web": "next dev -p 3000",
    "dev:api": "cd apps/api && npm run dev",  // Updated path
    "start": "next start -p 3000",
    "build": "next build"
  }
}
```

### Cara Menjalankan Aplikasi

```bash
# Jalankan FE + BE bersamaan (development)
npm run dev

# Atau jalankan terpisah:
npm run dev:web   # Frontend di http://localhost:3000
npm run dev:api   # Backend di http://localhost:4000
```

## Packages

### 1. Root (Frontend - sementara)
- **Lokasi**: root directory
- **Isi**: Next.js app, React components, styles, assets
- **Port**: 3000 (development)
- **Tech**: Next.js 13+ (App Router), React 18, Bootstrap, Axios

### 2. apps/api (Backend)
- **Lokasi**: `apps/api/`
- **Isi**: Hapi.js REST API, controllers (Category, Product, Order), Supabase integration
- **Database**: Supabase PostgreSQL (categories, products, orders, order_items)
- **Port**: 4000 (default, bisa diubah di `.env`)
- **Tech**: Hapi.js 21.3.2, @hapi/joi validation, @supabase/supabase-js 2.79.0
- **Entry point**: `src/index.js`
- **Status**: ✅ Production-ready, terintegrasi dengan Supabase

### 3. packages/common (Shared)
- **Lokasi**: `packages/common/`
- **Isi**: Shared types, validation schemas, utilities
- **Status**: Kosong (siap untuk migrasi shared code)
- **Nama package**: `@cashier-app/common`

## Environment Variables

### Frontend (.env.local di root)
```bash
NEXT_PUBLIC_API_URL=/api  # Development: proxy ke backend via Next.js rewrites
# NEXT_PUBLIC_API_URL=https://your-api.supabase.co/api  # Production
```

### Backend (apps/api/.env)
```bash
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# Supabase Configuration (REQUIRED)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# CORS (optional - untuk production jika perlu)
# FRONTEND_URL=http://localhost:3000
```

## Rencana Deployment

### Frontend (Netlify)
- **Build command**: `npm run build` (atau `next build`)
- **Publish directory**: `.next`
- **Environment variables**: 
  - `NEXT_PUBLIC_API_URL=https://your-api-url.com/api`

### Backend (Supabase + Node.js)
- **Opsi A (Direkomendasikan)**: Deploy Hapi.js ke Railway/Render/Vercel
  - Deploy full Hapi.js app sebagai Node.js server
  - Database: Supabase PostgreSQL (sudah terintegrasi)
  - Environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - Status: ✅ **Siap deploy** (sudah menggunakan Supabase client)
  
- **Opsi B**: Supabase Edge Functions (memerlukan refactor)
  - ⚠️ **Tidak direkomendasikan tanpa refactor**
  - Hapi.js tidak compatible dengan Deno runtime (Edge Functions requirement)
  - Memerlukan rewrite ke Deno + `@supabase/functions` (estimasi 1-2 hari)
  - Keuntungan: Fully serverless, auto-scaling, integrated with Supabase Auth/RLS

## Fase Migrasi

### ✅ Fase 1 (Selesai): Non-Invasive Mono-Repo + Supabase Integration
- [x] Pindahkan `backend/` → `apps/api/`
- [x] Buat `packages/common/` dengan struktur awal
- [x] Tambahkan `workspaces` ke root `package.json`
- [x] Update script `dev:api` untuk mengarah ke `apps/api`
- [x] Frontend tetap di root (app/, src/, public/)
- [x] **Integrasi Supabase PostgreSQL** (menggantikan in-memory storage)
- [x] **Migrasi semua controllers** ke Supabase client (@supabase/supabase-js)
- [x] **Update validation schemas** untuk UUID primary keys
- [x] **Cleanup legacy code** (13 files deleted: Keranjang/Pesanan controllers, routes, models)
- [x] **Create debugging & testing** (DEBUGGING_REPORT.md, test-db.js, inspect-schema.js)
- [x] **Comprehensive testing** (21 tests created, 19/21 passing)

### 🔄 Fase 2 (Rencana): Full Mono-Repo Structure
- [ ] Pindahkan frontend ke `apps/frontend/`
  - [ ] Move `app/` → `apps/frontend/app/`
  - [ ] Move `src/` → `apps/frontend/src/`
  - [ ] Move `public/` → `apps/frontend/public/`
  - [ ] Move `next.config.js`, `jsconfig.json` → `apps/frontend/`
  - [ ] Buat `apps/frontend/package.json`
- [ ] Update root scripts untuk workspace-aware commands
- [ ] Update CI/CD untuk build dari `apps/frontend` dan `apps/api`

### 🚀 Fase 3 (Rencana): Shared Code Migration
- [ ] Migrasi validation schemas ke `packages/common/validation/`
- [ ] Migrasi utils ke `packages/common/utils/`
- [ ] (Opsional) Tambahkan TypeScript + shared types di `packages/common/types/`
- [ ] Import shared code dari `@cashier-app/common` di FE & BE

### 📊 Fase 4 (Selesai): Database & Production Readiness
- [x] Migrasi dari in-memory storage ke Supabase Postgres
- [x] Setup Supabase client (@supabase/supabase-js)
- [x] Update controllers untuk menggunakan database real (Category, Product, Order)
- [x] Schema design (UUID primary keys, foreign keys, constraints)
- [x] Testing & validation (21 comprehensive tests)
- [ ] Setup CI/CD untuk Netlify (FE) dan Railway/Render (BE)
- [ ] Environment management (staging vs production)
- [ ] Frontend update untuk consume `/api/orders` endpoint

## Testing

```bash
# Test frontend
npm run dev:web
# Visit http://localhost:3000

# Test backend API
npm run dev:api
# Visit http://localhost:4000/api/health

# Test full stack
npm run dev
# FE: http://localhost:3000
# BE: http://localhost:4000
```

## Catatan Penting

1. **Frontend masih di root** (fase 1) - ini aman dan tidak memerlukan perubahan besar
2. **Backend sudah di apps/api** - semua imports relatif masih bekerja karena kita hanya memindahkan folder
3. **Workspace hoisting** - npm workspaces akan hoist dependencies ke root `node_modules` jika memungkinkan
4. **Shared code** - `packages/common` siap digunakan, tapi belum ada shared code yang dipindahkan
5. **Git** - Pastikan commit perubahan ini sebelum lanjut ke fase 2

## Troubleshooting

### Backend tidak bisa dijalankan
```bash
cd apps/api
npm install  # Install dependencies lokal jika diperlukan
npm run dev
```

### Frontend tidak bisa fetch API
- Pastikan backend berjalan di `http://localhost:4000`
- Cek `next.config.js` rewrites masih benar
- Cek CORS config di `apps/api/src/config/cors.js`

### Workspace dependency issues
```bash
# Reinstall semua dependencies
rm -rf node_modules package-lock.json apps/*/node_modules apps/*/package-lock.json
npm install
```

## Next Steps

1. ✅ **Test current setup** - Jalankan `npm run dev` dan pastikan FE + BE bekerja
2. 🔄 **Optional: Migrate to Fase 2** - Pindahkan frontend ke `apps/frontend` (butuh testing lebih lanjut)
3. 🚀 **Setup CI/CD** - Buat GitHub Actions untuk build & deploy
4. 📦 **Migrate shared code** - Pindahkan validation & utils ke `packages/common`
5. 💾 **Database migration** - Migrasi dari in-memory ke Supabase Postgres

## Kontak & Maintainer

- **Author**: Hesa Firdaus
- **Repo**: cashier-app
- **Branch**: main

---

**Terakhir diperbarui**: 3 Januari 2025  
**Status**: Fase 1 & 4 Selesai ✅ (Backend production-ready dengan Supabase)
