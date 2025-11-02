# @cashier-app/common

Paket bersama (shared package) untuk Kasir App yang berisi:

## Tujuan

Package ini menyediakan kode yang digunakan oleh frontend dan backend untuk memastikan konsistensi tipe data, validasi, dan utility functions.

## Struktur (Rencana)

```
packages/common/
├── package.json
├── README.md
├── index.js          # Entry point
├── types/            # TypeScript types/interfaces (jika menggunakan TS)
│   ├── product.ts
│   ├── category.ts
│   ├── keranjang.ts
│   └── pesanan.ts
├── validation/       # Joi/Zod schemas yang bisa dipakai FE & BE
│   ├── product.js
│   ├── category.js
│   └── keranjang.js
└── utils/            # Utility functions
    ├── formatters.js
    └── constants.js
```

## Penggunaan

Untuk menggunakan package ini dari aplikasi lain di mono-repo:

```javascript
// Di apps/frontend atau apps/api
const { formatCurrency } = require('@cashier-app/common');
// atau
import { ProductSchema } from '@cashier-app/common/validation';
```

## Catatan

- Package ini menggunakan `"private": true` sehingga tidak akan dipublikasikan ke npm.
- Digunakan melalui npm/pnpm workspaces di mono-repo.
- Pastikan untuk menjalankan `npm install` di root setelah menambah dependency baru.

## Development

Untuk menambahkan kode bersama:

1. Buat file di folder yang sesuai (`types/`, `validation/`, atau `utils/`)
2. Export dari `index.js`
3. Import dari aplikasi yang membutuhkan

## Rencana Migrasi

Beberapa kandidat kode yang bisa dipindahkan ke sini:

- Validation schemas dari `apps/api/src/config/validation.js`
- Utils seperti `numberWithCommas` dari `src/utils/utils.js`
- Konstanta seperti payment methods, order status, dll
- TypeScript interfaces untuk Product, Category, Keranjang, Pesanan (jika migrasi ke TS)
