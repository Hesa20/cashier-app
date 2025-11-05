# Netlify Environment Variables Setup

## ⚠️ CRITICAL: Production App Tidak Load Products

**Root Cause:** Environment variables tidak ter-set di Netlify build settings.

Next.js static export memerlukan environment variables **pada saat build time** (bukan runtime). Variable `NEXT_PUBLIC_*` akan di-bake ke dalam static files saat `npm run build`.

---

## 🔧 Fix: Set Environment Variables di Netlify

### Step-by-Step:

1. **Login ke Netlify Dashboard**
   - Go to: https://app.netlify.com

2. **Pilih Site "hesa-cashier-app"**
   - Atau site Anda yang lain

3. **Navigate ke Settings**
   - Click: **Site settings** → **Environment variables**
   - Atau langsung: `Site settings > Build & deploy > Environment > Environment variables`

4. **Add Required Variables** (klik "Add a variable"):

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | `https://cashier-app-backend-production.up.railway.app/api` |
   | `NEXT_PUBLIC_API_URL` | `https://cashier-app-backend-production.up.railway.app` |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xrxfskydbcrjasdqtreq.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyeGZza3lkYmNyamFzZHF0cmVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjMwNzQsImV4cCI6MjA3Nzg5OTA3NH0.Tso03fbqOYGMeJc-vp19f24SRBxCNyCUH2jWX-Ez3lc` |

   **Important Notes:**
   - ✅ `NEXT_PUBLIC_API_BASE_URL` harus include `/api` di akhir
   - ✅ Variables harus dimulai dengan `NEXT_PUBLIC_` untuk exposed ke browser
   - ✅ Set untuk **All scopes** atau minimal **Production**

5. **Trigger Rebuild**
   - Setelah save variables, go to: **Deploys**
   - Click: **Trigger deploy** → **Clear cache and deploy site**
   - Atau push dummy commit ke GitHub

6. **Verify Build Logs**
   - Tunggu build selesai (~2-3 menit)
   - Check build logs, pastikan tidak ada error
   - Look for: `✓ Compiled successfully`

7. **Test Production Site**
   - Buka: https://hesa-cashier-app.netlify.app
   - Open Browser DevTools Console (F12)
   - Refresh page
   - Check Network tab untuk request ke Railway API

---

## 🔍 Verification Commands (setelah deploy)

Test dari terminal:

```bash
# 1. Check if Railway URL is in the bundle
curl -s https://hesa-cashier-app.netlify.app/_next/static/chunks/app/page.js | grep -o 'railway.app' | head -1

# 2. Check browser console (manual)
# Buka site → F12 Console → lihat API calls

# 3. Test API directly
curl https://cashier-app-backend-production.up.railway.app/api/products
```

Expected result: Railway URL muncul di bundle JavaScript.

---

## 📋 Current Status

**Backend (Railway):**
- ✅ Status: ACTIVE
- ✅ URL: https://cashier-app-backend-production.up.railway.app
- ✅ Health: OK (tested)
- ✅ Products: 16 items
- ✅ Categories: 3 items

**Frontend (Netlify):**
- ✅ Build: Success
- ✅ Deploy: Published at 2:39 AM
- ❌ **Environment Variables: NOT SET** ← Problem!
- ❌ Products: Not loading (because API URL is undefined)

**Database (Supabase):**
- ✅ Status: Active
- ✅ Tables: 5 (products, categories, orders, order_items, todos)

---

## 🎯 Expected Behavior After Fix

1. **Build Process:**
   - Netlify reads env vars
   - `npm run build` bakes `NEXT_PUBLIC_*` into static files
   - Generate `out/` directory with Railway URL hardcoded

2. **Runtime Behavior:**
   - Browser loads static HTML
   - JavaScript includes Railway API URL
   - Fetch products from Railway backend
   - Display products with images

3. **API Flow:**
   ```
   Browser (Netlify Static Site)
     → GET https://cashier-app-backend-production.up.railway.app/api/products
     → Railway Backend
     → Supabase PostgreSQL
     → Return JSON to browser
   ```

---

## ⚡ Quick Test (After Setting Env Vars)

Open browser DevTools → Console:

```javascript
// Should NOT be undefined
console.log('API URL:', process.env.NEXT_PUBLIC_API_BASE_URL);

// Should fetch products
fetch('https://cashier-app-backend-production.up.railway.app/api/products')
  .then(r => r.json())
  .then(d => console.log('Products:', d.data.length));
```

---

## 🚨 Common Mistakes

1. ❌ Forgot `NEXT_PUBLIC_` prefix → variable tidak exposed ke browser
2. ❌ Set env vars setelah build → needs rebuild
3. ❌ Typo di variable name → `NEXT_PUBLIC_API_URL` bukan `NEXT_PUBLIC_API_URI`
4. ❌ Missing `/api` suffix di `NEXT_PUBLIC_API_BASE_URL`
5. ❌ Set env vars di Netlify UI tapi tidak trigger rebuild

---

## 📞 Need Help?

Jika masih error setelah set env vars:

1. Check Netlify build logs for errors
2. Verify env vars terlihat di build logs (should see: `Environments: NEXT_PUBLIC_API_BASE_URL`)
3. Clear browser cache
4. Test in incognito/private window
5. Check Railway backend logs for incoming requests

---

**Created:** November 5, 2025  
**Last Updated:** November 5, 2025
