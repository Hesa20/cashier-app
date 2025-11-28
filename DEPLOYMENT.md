# Deployment Guide — Cashier App (Singkat)

**Status**: Backend sudah terintegrasi dengan Supabase PostgreSQL  
**Last Updated**: 6 November 2025

Arsitektur singkat:
```
Frontend (Netlify) → Backend (Railway/Render Hapi.js) → Supabase PostgreSQL
```

Ringkasan:
- Backend: Hapi.js + @supabase/supabase-js (production-ready)
- Database: Supabase PostgreSQL (UUID PK)
- Mono-repo: npm workspaces (apps/api + packages/common)
- Frontend: Next.js (Netlify)

Quick env vars:
- Backend:
  ```
  PORT=4000
  HOST=0.0.0.0
  NODE_ENV=production
  SUPABASE_URL=https://<project>.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
  ```
  (Gunakan service_role key hanya di backend — jangan expose ke frontend)

- Frontend (Netlify):
  ```
  NEXT_PUBLIC_API_URL=https://<your-backend>.up.railway.app/api
  ```

Deploy Frontend (Netlify) — singkat:
1. New site from Git → pilih repo
2. Base dir: `/`, Build: `npm run build`, Publish: `.next`
  - **Optional/Recommended**: Install the Netlify Next.js plugin (`@netlify/plugin-nextjs`) to ensure App Router/SSR is handled correctly.
    - Add to `netlify.toml`:
    ```toml
    [[plugins]]
      package = "@netlify/plugin-nextjs"
    ```
    - Or install as dev dependency in the repo: `npm install --save-dev @netlify/plugin-nextjs`
3. Set NEXT_PUBLIC_API_URL ke URL backend
4. Deploy

Deploy Backend (Railway — direkomendasikan):
1. Buat project → Deploy from GitHub, root: `apps/api`
2. Build/start: auto / `npm start`
3. Tambahkan env vars (lihat di atas)
4. Deploy → dapatkan URL public API

(Opsi Render: same flow; set root `apps/api`, build: `npm install`, start: `npm start`)

Testing cepat:
- Health: curl https://{backend}/api/health
- Categories: curl https://{backend}/api/categories
- Products: curl https://{backend}/api/products
- Frontend: buka site & cek network/api calls

Security & best practices:
- Jangan commit `.env` (pakai `.env.example`)
- Simpan service role key di secret manager (Railway/Netlify/Render)
- Aktifkan HTTPS (platform biasanya auto)
- Pertimbangkan RLS di Supabase (backend dengan service_role akan bypass RLS)

Rekomendasi:
- Gunakan Railway untuk backend (zero-config, auto-deploy, Node.js friendly)
- Gunakan Netlify untuk frontend (Next.js support)

Checklist ringkas:
- ✅ DB & schema di Supabase
- ✅ Backend menggunakan supabase-js
- ✅ Controllers dan validation UUID updated
- ⭕ Update frontend API paths (e.g. `/api/pesanans` → `/api/orders`)
- ⭕ Pastikan env vars di platform sudah diset dan diuji
- ⭕ Setup monitoring & error tracking (Sentry, platform logs)

CI/CD (opsional):
- GitHub Actions untuk lint/build/test
- Deploy via Netlify/Railway actions or platform auto-deploy

Dokumentasi & tools:
- Netlify, Railway, Render, Supabase, Hapi.js docs

Singkatnya: deploy backend ke Railway (Hapi.js ready) dan frontend ke Netlify. Verifikasi endpoints, amankan keys, dan update frontend API paths.
