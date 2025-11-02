# Setup CI/CD untuk Mono-Repo Kasir App

Panduan deployment untuk Netlify (Frontend) dan Supabase (Backend + Database).

## 🎯 Arsitektur Deployment

```
┌─────────────────┐
│   GitHub Repo   │
│   (main branch) │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌──────────┐
│Netlify │ │ Supabase │
│Frontend│ │ Backend  │
│  :3000 │ │   API    │
└────────┘ └──────────┘
    │         │
    └────┬────┘
         ▼
    PostgreSQL
    (Supabase)
```

## 📦 Deployment Strategy

### Frontend → Netlify

**Build settings:**
- **Base directory**: `/` (root)
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 18 atau 20

**Environment Variables (Netlify):**
```
NEXT_PUBLIC_API_URL=https://your-project.supabase.co/rest/v1
# atau custom backend URL jika deploy Hapi.js terpisah
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
  to = "https://your-backend-url.com/api/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

### Backend → Supabase

Ada 2 opsi deployment backend:

#### Opsi 1: Supabase Edge Functions (Rekomendasi)

Migrasi dari Hapi.js ke Supabase Edge Functions (Deno):

1. **Setup Supabase CLI**
```bash
npm install -g supabase
supabase login
supabase init
```

2. **Migrasi API ke Edge Functions**

Struktur folder:
```
supabase/
├── functions/
│   ├── products/
│   │   └── index.ts
│   ├── categories/
│   │   └── index.ts
│   ├── keranjangs/
│   │   └── index.ts
│   └── pesanans/
│       └── index.ts
└── config.toml
```

Contoh Edge Function (`supabase/functions/products/index.ts`):
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('products')
      .select('*')
    
    if (error) throw error
    
    return new Response(
      JSON.stringify({ status: 'success', data }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response('Method not allowed', { status: 405 })
})
```

3. **Deploy Edge Functions**
```bash
supabase functions deploy products
supabase functions deploy categories
supabase functions deploy keranjangs
supabase functions deploy pesanans
```

4. **Database Migration**

Buat migration file (`supabase/migrations/20251102_initial_schema.sql`):
```sql
-- Categories table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  harga INTEGER NOT NULL,
  category_id BIGINT REFERENCES categories(id),
  kode VARCHAR(20) UNIQUE NOT NULL,
  gambar VARCHAR(255) DEFAULT 'default.png',
  stok INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Keranjangs table
CREATE TABLE keranjangs (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  jumlah INTEGER NOT NULL,
  total_harga INTEGER NOT NULL,
  keterangan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pesanans table
CREATE TABLE pesanans (
  id BIGSERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  total_harga INTEGER NOT NULL,
  metode_pembayaran VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed data
INSERT INTO categories (nama) VALUES ('Makanan'), ('Minuman'), ('Cemilan');

-- Indexes
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_keranjangs_product ON keranjangs(product_id);
```

Apply migration:
```bash
supabase db push
```

#### Opsi 2: Deploy Hapi.js di Container/Serverless

Jika ingin tetap menggunakan Hapi.js (tidak migrasi ke Edge Functions):

**Platform pilihan:**
- Railway.app
- Render.com
- Fly.io
- Google Cloud Run
- AWS Lambda (via serverless framework)

**Contoh: Railway**

1. Buat `Dockerfile` di `apps/api/`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["node", "src/index.js"]
```

2. Deploy via Railway CLI atau connect GitHub repo

3. Set environment variables di Railway dashboard:
```
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
```

4. Update models untuk pakai Supabase client alih-alih in-memory:

Install dependency:
```bash
cd apps/api
npm install @supabase/supabase-js
```

Update model (`apps/api/src/models/Product.js`):
```javascript
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

class Product {
  async findAll(filters = {}) {
    let query = supabase.from('products').select('*');
    
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findById(id) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // ... dst
}

module.exports = new Product();
```

## 🔐 Environment Variables Management

### Development (.env files)

**Root `.env.local`** (Frontend):
```env
NEXT_PUBLIC_API_URL=/api
```

**apps/api/.env** (Backend):
```env
PORT=4000
HOST=0.0.0.0
NODE_ENV=development
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-anon-key
```

### Production

**Netlify Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://xxx.supabase.co/functions/v1
# atau URL Railway/Render jika pakai Hapi.js
```

**Supabase Secrets** (Edge Functions):
```bash
supabase secrets set SUPABASE_URL=xxx
supabase secrets set SUPABASE_ANON_KEY=xxx
```

**Railway/Render Env Vars** (jika pakai Hapi.js):
```
PORT=4000
HOST=0.0.0.0
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-service-role-key
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

- [ ] Semua environment variables sudah dikonfigurasi
- [ ] Database migrations sudah dibuat dan ditest
- [ ] API endpoints sudah ditest (manual atau automated)
- [ ] Frontend bisa berkomunikasi dengan backend (CORS OK)
- [ ] Secrets tidak ter-commit ke Git
- [ ] `.env.example` sudah diperbarui dengan var baru
- [ ] README.md sudah update dengan instruksi deployment
- [ ] Monitoring & error tracking sudah disetup
- [ ] Backup database strategy sudah ada
- [ ] Rate limiting sudah diimplementasikan (produksi)

## 🚀 Step-by-Step Deployment

### 1. Setup Supabase Project
```bash
# Login
supabase login

# Init project
supabase init

# Link to remote project
supabase link --project-ref <your-project-ref>

# Create migration
supabase migration new initial_schema

# Edit migration file, lalu apply
supabase db push
```

### 2. Deploy Backend
```bash
# Jika pakai Edge Functions
cd apps/api
# Convert Hapi routes to Edge Functions (manual)
supabase functions deploy

# Jika pakai Railway/Render
# Connect repo di dashboard, set env vars, deploy otomatis
```

### 3. Deploy Frontend (Netlify)
```bash
# Via Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# Atau connect GitHub repo di Netlify dashboard
```

### 4. Test Production
```bash
# Test API
curl https://xxx.supabase.co/functions/v1/products

# Test Frontend
open https://your-app.netlify.app
```

## 📞 Support & Resources

- [Netlify Docs](https://docs.netlify.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Railway Docs](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

---

**Catatan**: Pilih opsi deployment yang sesuai dengan kebutuhan:
- **Simple & cepat**: Supabase Edge Functions (full serverless)
- **Flexibility**: Railway/Render + Supabase DB (tetap pakai Hapi.js)

Untuk proyek kasir-app ini, rekomendasi adalah **Opsi 1 (Supabase Edge Functions)** karena lebih terintegrasi dan cost-effective untuk MVP.
