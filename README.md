# Cashier App (kasir-app)

Deskripsi singkat
Aplikasi kasir (POS) sederhana berbasis client-side JavaScript. Repo ini berisi versi front-end awal; ada rencana refactor ke Next.js + TypeScript dan integrasi backend (Postgres/Supabase + Hapi.js). README ini menjelaskan tujuan, fitur, cara menjalankan, skrip npm, contoh data, dan panduan singkat untuk pengembangan.

Tujuan proyek
- Memberikan aplikasi kasir ringan untuk transaksi penjualan, manajemen keranjang, dan cetak struk sederhana.
- Menjadi basis yang mudah dimigrasi ke Next.js/TypeScript dan diintegrasikan dengan backend (Supabase/Hapi.js).
- Mudah dipakai di perangkat POS/tablet dengan antarmuka responsif.

Fitur utama
- Daftar produk, pencarian sederhana.
- Menambah produk ke keranjang (cart) dan menghitung subtotal, diskon, dan pajak.
- Checkout transaksi dengan ringkasan pembayaran.
- Cetak/ekspor struk sederhana (client-side).
- Data sample untuk pengujian (seed).
- (Roadmap) Integrasi backend, autentikasi, laporan harian, manajemen stok.

Teknologi (saat ini)
- JavaScript, HTML, CSS
- (Rencana) Next.js + TypeScript, React Query / Zustand, Supabase (Postgres), Hapi.js untuk API

Instalasi & Menjalankan (development)
1. Clone repo
   ```bash
   git clone https://github.com/Hesa20/cashier-app.git
   cd cashier-app
   ```
2. Instal dependency
   ```bash
   npm install
   ```
3. Menjalankan server development (jika ada script lokal)
   ```bash
   npm run dev
   ```
   - Jika proyek ini adalah single-page static, buka `index.html` di browser atau gunakan static server:
   ```bash
   npx serve .
   ```

Script npm yang direkomendasikan (tambahkan pada package.json)
```json
{
  "scripts": {
    "dev": "vite",                  // atau command dev yang sesuai
    "build": "vite build",
    "start": "vite preview --port 3000",
    "lint": "eslint . --fix",
    "format": "prettier --write .",
    "test": "jest",
    "seed": "node scripts/seed.js"
  }
}
```
Catatan: Ganti `vite`/`jest` sesuai stack aktual. Saat migrasi ke Next.js, ganti `dev`/`build` sesuai Next.js commands.

Contoh data (sample seed)
- File data contoh membantu pengembangan dan pengujian. Berikut contoh JSON produk untuk seed:

```json
[
  {
    "id": "prod-001",
    "sku": "P-001",
    "name": "Air Mineral 600ml",
    "price": 5000,
    "cost": 3000,
    "tax_percent": 10,
    "stock": 50,
    "category": "Minuman"
  },
  {
    "id": "prod-002",
    "sku": "P-002",
    "name": "Roti Maya",
    "price": 12000,
    "cost": 7000,
    "tax_percent": 10,
    "stock": 30,
    "category": "Makanan"
  }
]
```

Kontrak data transaksi (contoh sederhana)
- Struktur JSON transaksi yang disarankan untuk seed dan integrasi API:
```json
{
  "id": "sale-20251027-0001",
  "user_id": "user-001",
  "customer_id": null,
  "items": [
    {
      "product_id": "prod-001",
      "qty": 2,
      "unit_price": 5000,
      "discount": 0,
      "line_total": 10000
    }
  ],
  "subtotal": 10000,
  "tax": 1000,
  "discount_total": 0,
  "total": 11000,
  "payment_method": "cash",
  "status": "paid",
  "created_at": "2025-10-27T08:00:00Z"
}
```

Struktur folder (rekomendasi awal sebelum refactor)
- Jika ingin rapikan sebelum migrasi, gunakan struktur berikut:
```
/src
  /assets
  /components
  /features
    /products
    /cart
    /checkout
  /lib
  /hooks
  /styles
/scripts
  seed.js
/public
index.html
package.json
README.md
```

Checklist pra-refactor (singkat)
- [ ] Perbarui README (ini).
- [ ] Tambahkan LICENSE (mis. MIT) di repo.
- [ ] Tambahkan .gitignore, .editorconfig, ESLint & Prettier.
- [ ] Siapkan branch `refactor-nextjs` untuk migrasi.
- [ ] Tambahkan script seed dan contoh data di `scripts/seed.js`.
- [ ] Tambahkan basic tests untuk util penting.
- [ ] Setup CI ringan (lint + test) via GitHub Actions.

Panduan singkat menjalankan seed (contoh script)
- Buat file `scripts/seed.js` yang membaca `data/products.json` lalu memasukkannya ke localStorage atau file JSON lokal untuk dev:
```bash
node scripts/seed.js
```

Roadmap singkat
- Phase 1: Bersihkan repo, README, license, seed data, linting.
- Phase 2: Scaffold Next.js + TypeScript di branch `refactor-nextjs`.
- Phase 3: Rancang DB (Supabase), API (Hapi.js), dan integrasi auth.
- Phase 4: Tests, CI/CD, deploy.
