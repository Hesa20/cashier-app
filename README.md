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
- (Rencana) Next.js + TypeScript, Supabase (Postgres), Hapi.js untuk API