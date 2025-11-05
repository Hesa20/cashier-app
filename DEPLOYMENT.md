# Deployment Guide - Cashier App

**Status**: Backend sudah terintegrasi dengan Supabase PostgreSQL ✅  
**Last Updated**: 3 Januari 2025

Panduan deployment untuk Netlify (Frontend) dan Railway/Render (Backend API).

## 🎯 Arsitektur Deployment (Current State)

```
┌─────────────────┐
│   GitHub Repo   │
│   (main branch) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────────┐ ┌──────────────┐
│  Netlify   │ │ Railway/     │
│  Frontend  │ │ Render       │
│  Next.js   │ │ Hapi.js API  │
│   :3000    │ │   :4000      │
└────────────┘ └──────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Supabase    │
              │  PostgreSQL   │
              │   (Database)  │
              └───────────────┘
```

## ✅ Current Status

- ✅ **Backend**: Menggunakan @supabase/supabase-js client (bukan direct PostgreSQL connection)
- ✅ **Database**: Supabase PostgreSQL dengan schema UUID-based
- ✅ **Controllers**: Category, Product, Order (semua sudah migrasi ke Supabase client)
- ✅ **Validation**: @hapi/joi dengan UUID validation
- ✅ **Testing**: 21 comprehensive tests created (19/21 passing)
- ✅ **Cleanup**: Legacy code removed (Keranjang/Pesanan controllers/models)

## 📦 Deployment Strategy

### Frontend → Netlify

**Build settings:**
- **Base directory**: `/` (root)
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 atau 20

**Environment Variables (Netlify):**
```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
# atau Render URL: https://your-backend.onrender.com/api
```

**netlify.toml** (opsional, buat di root):
```toml
[build]
  base = "/"
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.up.railway.app/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Backend → Railway/Render (Recommended)

✅ **Status**: Backend sudah siap deploy! Hapi.js + @supabase/supabase-js terintegrasi.

#### Opsi A: Railway.app (Direkomendasikan)

**Keuntungan**:
- Free tier generous ($5/month credit)
- Auto-deploy dari GitHub
- Zero-config deployment (deteksi Node.js otomatis)
- Built-in environment variables management

**Steps**:

1. **Buat account di [Railway.app](https://railway.app)**

2. **Create New Project → Deploy from GitHub repo**
   - Select `cashier-app` repository
   - Set root directory: `apps/api`

3. **Set Environment Variables**:
```bash
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. **Deploy**
   - Railway akan otomatis detect `package.json` dan run `npm start`
   - API akan tersedia di: `https://your-app.up.railway.app`

5. **Custom Domain** (opsional)
   - Railway Settings → Domains → Add custom domain

#### Opsi B: Render.com

**Keuntungan**:
- Free tier (dengan batasan: sleep after 15 min inactive)
- Native Docker support
- Auto-deploy dari GitHub

**Steps**:

1. **Create Web Service**:
   - Type: Web Service
   - Repository: cashier-app
   - Root Directory: `apps/api`

2. **Build & Start Commands**:
```bash
# Build Command
npm install

# Start Command
npm start
```

3. **Environment Variables**: Same as Railway

4. **Deploy**
   - API akan tersedia di: `https://your-app.onrender.com`

### ⚠️ Opsi C: Supabase Edge Functions (NOT Recommended)

**Alasan TIDAK direkomendasikan:**
- Hapi.js memerlukan Node.js runtime
- Supabase Edge Functions require Deno runtime
- Memerlukan complete rewrite (~1-2 hari work)
- Tidak ada manfaat signifikan dibanding Railway/Render untuk use case ini

**Jika tetap ingin pakai Edge Functions:**
- Perlu migrate semua Hapi.js routes → Deno Edge Functions
- Perlu rewrite controllers untuk Deno environment
- Estimasi effort: 1-2 hari development + testing

## 🗄️ Database (Supabase PostgreSQL)

✅ **Status**: Database sudah setup dan terintegrasi!

### Current Schema

Tables sudah dibuat di Supabase:
- `categories` (UUID PK, name, description, created_at)
- `products` (UUID PK, name, description, price, stock, image_url, category_id FK, is_active, created_at)
- `orders` (UUID PK, order_number, total_amount, status, payment_method, paid_amount, change_amount, notes, created_at)
- `order_items` (UUID PK, order_id FK, product_id FK, product_name, quantity, price, subtotal, created_at)

### Supabase Configuration

**Required Environment Variables (Backend)**:
```bash
SUPABASE_URL=https://xrxfskydbcrjasdqtreq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ **Security**: Gunakan **service_role key** untuk backend (bukan anon key). Service role key bypass Row Level Security (RLS).

### Optional: Enable RLS (Row Level Security)

Untuk production, enable RLS di Supabase Dashboard:

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Example policy: Allow read for everyone, write for authenticated users
CREATE POLICY "Allow read for all" ON products FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated" ON orders FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
```

**Note**: Jika pakai service_role key di backend, RLS policies akan di-bypass (by design).

## 🔐 Environment Variables Management

### Development (.env files)

**Root `.env.local`** (Frontend):
```env
NEXT_PUBLIC_API_URL=/api
# Local development uses Next.js rewrites to proxy to backend
```

**apps/api/.env** (Backend):
```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development

# Supabase credentials (REQUIRED)
SUPABASE_URL=https://xrxfskydbcrjasdqtreq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Production

**Netlify Environment Variables:**
```bash
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
# atau: https://your-backend.onrender.com/api
```

**Railway/Render Environment Variables:**
```bash
PORT=4000
HOST=0.0.0.0
NODE_ENV=production

# Supabase (same as development)
SUPABASE_URL=https://xrxfskydbcrjasdqtreq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# CORS (optional - untuk production jika perlu)
FRONTEND_URL=https://your-app.netlify.app
```

## 🤖 GitHub Actions CI/CD (Opsional)

Buat `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build frontend
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}

  deploy-frontend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --prod

  deploy-backend:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Supabase
        uses: supabase/setup-cli@v1
        with:
          version: latest
      
      - run: supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
          SUPABASE_PROJECT_ID: ${{ secrets.SUPABASE_PROJECT_ID }}
```

## 📊 Monitoring & Logging

### Frontend (Netlify)
- Analytics: Netlify Analytics (built-in)
- Error tracking: Sentry, LogRocket
- Performance: Vercel Speed Insights (jika migrasi ke Vercel)

### Backend
- Supabase Edge Functions: Supabase logs (dashboard)
- Railway/Render: Platform logs
- Error tracking: Sentry
- APM: New Relic, Datadog

### Database
- Supabase Dashboard → Database → Logs
- Query performance monitoring
- Connection pooling stats

## 🔄 Rollback Strategy

### Frontend
```bash
# Netlify CLI
netlify deploy --alias previous-version

# Atau via dashboard: Deploys → Publish an old deploy
```

### Backend (Supabase Edge Functions)
```bash
# Revert ke versi sebelumnya
supabase functions deploy products --version <previous-sha>
```

### Database (Supabase)
```bash
# Rollback migration
supabase db reset

# Atau manual SQL di dashboard
```

## ✅ Checklist Pre-Deployment

### Backend Readiness
- [x] Database schema created di Supabase (categories, products, orders, order_items)
- [x] Supabase client integrated (@supabase/supabase-js)
- [x] All controllers migrated (Category, Product, Order)
- [x] Validation schemas updated (UUID support)
- [x] Testing completed (19/21 tests passing)
- [x] Legacy code removed (Keranjang/Pesanan)
- [ ] CORS configuration tested untuk production domain
- [ ] Environment variables documented
- [ ] Health check endpoint working
- [ ] Error logging configured

### Frontend Readiness
- [ ] Update API calls dari `/api/pesanans` → `/api/orders`
- [ ] Update UUID handling (bukan integer IDs)
- [ ] Environment variable `NEXT_PUBLIC_API_URL` configured
- [ ] Production build tested locally (`npm run build`)
- [ ] CORS tested dengan backend URL

### Security
- [x] `.env` files not committed to Git
- [x] `.env.example` created dengan template
- [ ] Supabase service role key secured (tidak exposed ke frontend)
- [ ] HTTPS enabled (otomatis di Netlify/Railway/Render)
- [ ] Rate limiting considered (optional untuk MVP)
- [ ] Row Level Security (RLS) policies evaluated

### Monitoring
- [ ] Error tracking setup (Sentry recommended)
- [ ] Logging strategy defined
- [ ] Database backup schedule (Supabase otomatis daily backup)
- [ ] Uptime monitoring (UptimeRobot, Better Uptime)

## 🚀 Step-by-Step Deployment (Railway)

### 1. Prepare Codebase

```bash
# Ensure all changes committed
git status
git add .
git commit -m "feat: prepare for production deployment"
git push origin main
```

### 2. Deploy Backend (Railway)

1. **Create Railway Account**: https://railway.app
2. **New Project** → **Deploy from GitHub repo**
3. **Select Repository**: `cashier-app`
4. **Service Settings**:
   - Root Directory: `apps/api`
   - Build Command: (auto-detected from package.json)
   - Start Command: `npm start`
5. **Add Environment Variables**:
   ```
   PORT=4000
   HOST=0.0.0.0
   NODE_ENV=production
   SUPABASE_URL=https://xrxfskydbcrjasdqtreq.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=<your-key>
   ```
6. **Deploy** → Copy URL (e.g., `https://cashier-api-production.up.railway.app`)

### 3. Test Backend API

```bash
# Test health endpoint
curl https://cashier-api-production.up.railway.app/api/health

# Test categories
curl https://cashier-api-production.up.railway.app/api/categories

# Test products
curl https://cashier-api-production.up.railway.app/api/products
```

### 4. Deploy Frontend (Netlify)

1. **Create Netlify Account**: https://netlify.com
2. **New Site from Git** → **Connect to GitHub**
3. **Select Repository**: `cashier-app`
4. **Build Settings**:
   - Base directory: `/`
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Add Environment Variable**:
   ```
   NEXT_PUBLIC_API_URL=https://cashier-api-production.up.railway.app/api
   ```
6. **Deploy Site** → Copy URL (e.g., `https://cashier-app.netlify.app`)

### 5. Test Full Stack

1. Open frontend URL: `https://cashier-app.netlify.app`
2. Test kategori loading
3. Test produk loading
4. Test create order
5. Check browser DevTools → Network tab untuk verify API calls

### 6. Enable Custom Domain (Optional)

**Netlify**:
- Site Settings → Domain Management → Add custom domain
- Configure DNS records (A record atau CNAME)

**Railway**:
- Service Settings → Domains → Add custom domain
- Configure DNS (CNAME record)

## 🔄 Continuous Deployment

Both Netlify and Railway support auto-deploy from GitHub:

1. **Push to main branch**:
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

2. **Auto-deployment triggers**:
   - Netlify rebuilds frontend
   - Railway rebuilds backend

3. **Monitor deployments**:
   - Netlify: Dashboard → Deploys
   - Railway: Project → Deployments

## 📞 Support & Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)
- [Hapi.js Docs](https://hapi.dev/)

---

## 📝 Kesimpulan & Rekomendasi

**Rekomendasi Deployment untuk Cashier App:**

### ✅ Opsi A: Railway + Supabase DB (RECOMMENDED)

**Mengapa Railway?**
- ✅ Backend sudah menggunakan Hapi.js + @supabase/supabase-js (production-ready)
- ✅ Tidak perlu refactor/rewrite (Hapi.js compatible dengan Railway)
- ✅ Free tier $5/month credit (cukup untuk MVP)
- ✅ Zero-config deployment (auto-detect Node.js)
- ✅ Database sudah setup di Supabase (tinggal pakai)

**Arsitektur:**
```
Frontend (Netlify) → Backend (Railway/Hapi.js) → Database (Supabase PostgreSQL)
```

### ⚠️ Opsi B: Supabase Edge Functions (NOT RECOMMENDED)

**Mengapa TIDAK direkomendasikan:**
- ❌ Memerlukan complete rewrite dari Hapi.js → Deno
- ❌ Estimasi effort: 1-2 hari development + testing
- ❌ Tidak ada manfaat signifikan untuk use case kasir app
- ❌ Hapi.js tidak kompatibel dengan Deno runtime

**Kesimpulan:**  
Gunakan **Railway untuk backend** karena kode sudah siap production. Supabase hanya digunakan untuk database (bukan Edge Functions).

---

**Author**: Hesa Firdaus  
**Repository**: cashier-app  
**Last Updated**: 3 Januari 2025  
**Deployment Status**: Backend ✅ Ready | Frontend ⏳ Pending (update API calls)
