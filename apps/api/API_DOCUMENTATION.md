# API Documentation - Cashier App Backend

**Author:** Hesa Firdaus  
**Version:** 2.0.0  
**Base URL:** `http://localhost:4000/api`  
**Database:** Supabase PostgreSQL  
**Last Updated:** 3 Januari 2025

## ⚠️ Breaking Changes (v2.0.0)

- **Orders endpoint** changed from `/api/pesanans` → `/api/orders` ✨
- **Cart endpoint** `/api/keranjangs` deprecated (use frontend state management)
- **ID format** changed from integer to UUID
- **Database** migrated from in-memory to Supabase PostgreSQL
- **New fields** added: `order_number`, `paid_amount`, `change_amount` for orders

## Response Format

All API endpoints return a standard JSON response:

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "fail",
  "message": "Error description"
}
```

---

## 1. Health Check

### GET /api/health

Check if API server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-02T12:00:00.000Z",
  "service": "Cashier App API"
}
```

---

## 2. Categories

### GET /api/categories

Get all categories.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama": "Makanan",
      "deskripsi": "Kategori untuk makanan",
      "createdAt": "2025-01-03T12:00:00.000Z"
    }
  ]
}
```

### GET /api/categories/:id

Get category by ID.

**Parameters:**
- `id` (path) - Category ID (UUID format)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama": "Makanan",
    "deskripsi": "Kategori untuk makanan",
    "createdAt": "2025-01-03T12:00:00.000Z"
  }
}
```

### POST /api/categories

Create new category.

**Request Body:**
```json
{
  "nama": "Makanan",
  "deskripsi": "Kategori untuk makanan"
}
```

**Validation Rules:**
- `nama` (required) - string, max 255 characters
- `deskripsi` (optional) - string

**Response:**
```json
{
  "status": "success",
  "message": "Kategori berhasil ditambahkan",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama": "Makanan",
    "deskripsi": "Kategori untuk makanan",
    "createdAt": "2025-01-03T12:00:00.000Z"
  }
}
```

### PUT /api/categories/:id

Update category.

**Parameters:**
- `id` (path) - Category ID (UUID format)

**Request Body:**
```json
{
  "nama": "Makanan Baru",
  "deskripsi": "Deskripsi yang diupdate"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Kategori berhasil diupdate",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama": "Makanan Baru",
    "deskripsi": "Deskripsi yang diupdate",
    "updatedAt": "2025-01-03T12:00:00.000Z"
  }
}
```

### DELETE /api/categories/:id

Delete category.

**Parameters:**
- `id` (path) - Category ID (UUID format)

**Response:**
```json
{
  "status": "success",
  "message": "Kategori berhasil dihapus"
}
```

---

## 3. Products

### GET /api/products

Get all products with optional filters.

**Query Parameters:**
- `category` (optional) - Filter by category ID (UUID)
- `is_active` (optional) - Filter by active status (true/false, default: true)

**Examples:**
- `/api/products` - Get all active products
- `/api/products?category=550e8400-e29b-41d4-a716-446655440000` - Get products in category
- `/api/products?is_active=false` - Get inactive (deleted) products

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "nama": "Nasi Goreng",
      "deskripsi": "Nasi goreng spesial",
      "harga": 15000,
      "stok": 100,
      "gambar": "nasi-goreng.jpg",
      "kategori": "550e8400-e29b-41d4-a716-446655440000",
      "is_active": true,
      "category": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "nama": "Makanan",
        "deskripsi": "Kategori untuk makanan"
      }
    }
  ]
}
```

### GET /api/products/:id

Get product by ID (includes category join).

**Parameters:**
- `id` (path) - Product ID (UUID format)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "nama": "Nasi Goreng",
    "deskripsi": "Nasi goreng spesial",
    "harga": 15000,
    "stok": 100,
    "gambar": "nasi-goreng.jpg",
    "kategori": "550e8400-e29b-41d4-a716-446655440000",
    "is_active": true,
    "category": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama": "Makanan",
      "deskripsi": "Kategori untuk makanan"
    }
  }
}
```

### POST /api/products

Create new product.

**Request Body:**
```json
{
  "nama": "Nasi Goreng",
  "deskripsi": "Nasi goreng spesial",
  "harga": 15000,
  "stok": 100,
  "gambar": "nasi-goreng.jpg",
  "kategori": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Validation Rules:**
- `nama` (required) - string, max 255 characters
- `deskripsi` (optional) - string
- `harga` (required) - number, min 0
- `stok` (required) - integer, min 0
- `gambar` (optional) - string, max 500 characters
- `kategori` (required) - UUID, must reference existing category

**Response:**
```json
{
  "status": "success",
  "message": "Produk berhasil ditambahkan",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "nama": "Nasi Goreng",
    "deskripsi": "Nasi goreng spesial",
    "harga": 15000,
    "stok": 100,
    "gambar": "nasi-goreng.jpg",
    "kategori": "550e8400-e29b-41d4-a716-446655440000",
    "is_active": true,
    "createdAt": "2025-01-03T12:00:00.000Z"
  }
}
```

### PUT /api/products/:id

Update product.

**Parameters:**
- `id` (path) - Product ID (UUID format)

**Request Body:**
```json
{
  "nama": "Nasi Goreng Special",
  "harga": 18000,
  "deskripsi": "Nasi goreng dengan telur dan ayam"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "status": "success",
  "message": "Produk berhasil diupdate",
  "data": {
    "id": "650e8400-e29b-41d4-a716-446655440001",
    "nama": "Nasi Goreng Special",
    "harga": 18000,
    "deskripsi": "Nasi goreng dengan telur dan ayam",
    "updatedAt": "2025-01-03T12:00:00.000Z"
  }
}
```

### DELETE /api/products/:id

Soft delete product (set `is_active` to false).

**Parameters:**
- `id` (path) - Product ID (UUID format)

**Response:**
```json
{
  "status": "success",
  "message": "Produk berhasil dihapus"
}
```

**Note:** This is a soft delete. Product remains in database with `is_active = false`.

### PATCH /api/products/:id/stok

Update product stock.

**Parameters:**
- `id` (path) - Product ID

**Request Body:**
```json
{
  "jumlah": -5
}
```
Note: Use negative number to decrease stock, positive to increase.

**Response:**
```json
{
  "status": "success",
  "message": "Stok berhasil diupdate",
  "data": {
    "id": 1,
    "stok": 95,
    "updatedAt": "2025-10-29T12:00:00.000Z"
  }
}
```

---

## 4. Cart (Keranjang) - ⚠️ DEPRECATED

> **⚠️ DEPRECATED**: Cart endpoints have been deprecated in v2.0.0. Use frontend state management (React state, Redux, Zustand) for cart functionality instead.

The following endpoints are no longer available:
- ~~`GET /api/keranjangs`~~ - Use frontend state
- ~~`POST /api/keranjangs`~~ - Use frontend state
- ~~`PUT /api/keranjangs/:id`~~ - Use frontend state
- ~~`DELETE /api/keranjangs/:id`~~ - Use frontend state
- ~~`DELETE /api/keranjangs`~~ - Use frontend state

**Migration Guide:**
- Store cart items in React state or global state management
- Only send cart data to backend when creating an order via `POST /api/orders`

---

## 5. Orders (✨ NEW - replaces /pesanans)

### POST /api/orders

Create a new order with order items. This endpoint:
- Creates an order record
- Creates associated order_items
- **Automatically decrements product stock**
- Auto-generates order_number (format: ORD-YYYYMMDD-XXXX)
- Calculates change amount

**Request Body:**
```json
{
  "keranjangs": [
    {
      "product_id": "650e8400-e29b-41d4-a716-446655440001",
      "jumlah": 2
    },
    {
      "product_id": "750e8400-e29b-41d4-a716-446655440002",
      "jumlah": 1
    }
  ],
  "total_bayar": 45000,
  "uang_dibayar": 50000,
  "catatan": "Pedas sedang",
  "metode_pembayaran": "cash"
}
```

**Validation Rules:**
- `keranjangs` (required) - array, min 1 item
  - `product_id` (required) - UUID, must reference existing active product
  - `jumlah` (required) - integer, min 1
- `total_bayar` (required) - number, min 0
- `uang_dibayar` (required) - number, must be >= total_bayar
- `catatan` (optional) - string
- `metode_pembayaran` (optional) - string, default: "cash"

**Response:**
```json
{
  "status": "success",
  "message": "Pesanan berhasil dibuat",
  "data": {
    "order": {
      "id": "850e8400-e29b-41d4-a716-446655440003",
      "order_number": "ORD-20250103-0001",
      "total_amount": 45000,
      "status": "pending",
      "payment_method": "cash",
      "paid_amount": 50000,
      "change_amount": 5000,
      "notes": "Pedas sedang",
      "created_at": "2025-01-03T12:00:00.000Z"
    },
    "items": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440004",
        "order_id": "850e8400-e29b-41d4-a716-446655440003",
        "product_id": "650e8400-e29b-41d4-a716-446655440001",
        "product_name": "Nasi Goreng",
        "quantity": 2,
        "price": 15000,
        "subtotal": 30000,
        "created_at": "2025-01-03T12:00:00.000Z"
      },
      {
        "id": "a50e8400-e29b-41d4-a716-446655440005",
        "order_id": "850e8400-e29b-41d4-a716-446655440003",
        "product_id": "750e8400-e29b-41d4-a716-446655440002",
        "product_name": "Es Teh Manis",
        "quantity": 1,
        "price": 15000,
        "subtotal": 15000,
        "created_at": "2025-01-03T12:00:00.000Z"
      }
    ]
  }
}
```

**Error Cases:**
- `400` - Validation error (missing fields, invalid UUIDs)
- `400` - Insufficient stock for product
- `400` - Product not found or inactive
- `500` - Database error

### GET /api/orders

Get all orders.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440003",
      "order_number": "ORD-20250103-0001",
      "total_amount": 45000,
      "status": "pending",
      "payment_method": "cash",
      "paid_amount": 50000,
      "change_amount": 5000,
      "notes": "Pedas sedang",
      "created_at": "2025-01-03T12:00:00.000Z"
    }
  ]
}
```

### GET /api/orders/:id

Get order by ID (future implementation - not yet implemented).

**Parameters:**
- `id` (path) - Order ID (UUID format)

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "850e8400-e29b-41d4-a716-446655440003",
    "order_number": "ORD-20250103-0001",
    "total_amount": 45000,
    "status": "pending",
    "payment_method": "cash",
    "paid_amount": 50000,
    "change_amount": 5000,
    "notes": "Pedas sedang",
    "created_at": "2025-01-03T12:00:00.000Z",
    "items": [
      {
        "id": "950e8400-e29b-41d4-a716-446655440004",
        "product_name": "Nasi Goreng",
        "quantity": 2,
        "price": 15000,
        "subtotal": 30000
      }
    ]
  }
}
```

**Note:** This endpoint is planned but not yet implemented.

### GET /api/keranjangs

Get all cart items.

**Query Parameters:**
- `productId` (optional) - Filter by product ID

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "jumlah": 2,
      "totalHarga": 30000,
      "product": {
        "id": 1,
        "nama": "Nasi Goreng",
        "harga": 15000,
        "gambar": "default.png"
      },
      "createdAt": "2025-10-29T12:00:00.000Z"
    }
  ]
}
```

### GET /api/keranjangs/:id

Get cart item by ID.

**Parameters:**
- `id` (path) - Cart item ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "productId": 1,
    "jumlah": 2,
    "totalHarga": 30000,
    "product": { ... }
  }
}
```

### POST /api/keranjangs

Add item to cart.

**Request Body:**
```json
{
  "productId": 1,
  "jumlah": 2,
  "totalHarga": 30000,
  "keterangan": "Pedes, Nasi Setengah (optional)"
}
```

**Note:** 
- `keterangan` is optional and can be an empty string or omitted entirely
- All other fields are required

**Response:**
```json
{
  "status": "success",
  "message": "Item berhasil ditambahkan ke keranjang",
  "data": {
    "id": 1,
    "productId": 1,
    "jumlah": 2,
    "totalHarga": 30000,
    "keterangan": "",
    "createdAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### PUT /api/keranjangs/:id

Update cart item.

**Parameters:**
- `id` (path) - Cart item ID

**Request Body:**
```json
{
  "jumlah": 3,
  "totalHarga": 45000,
  "keterangan": "Pedes (optional)"
}
```

**Note:**
- All fields are optional - you can update any combination of fields
- `keterangan` can be an empty string to clear the note
- At least one field must be provided

**Response:**
```json
{
  "status": "success",
  "message": "Item berhasil diupdate",
  "data": {
    "id": 1,
    "jumlah": 3,
    "totalHarga": 45000,
    "keterangan": "Pedes",
    "updatedAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### DELETE /api/keranjangs/:id

Remove item from cart.

**Parameters:**
- `id` (path) - Cart item ID

**Response:**
```json
{
  "status": "success",
  "message": "Item berhasil dihapus"
}
```

### DELETE /api/keranjangs

Clear all cart items.

**Response:**
```json
{
  "status": "success",
  "message": "Keranjang berhasil dikosongkan"
}
```

---

## 5. Orders (Pesanan)

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (missing/invalid data, validation errors, insufficient stock) |
| 404  | Not Found (resource with specified UUID not found) |
| 500  | Internal Server Error (database errors, unexpected errors) |

---

## Testing with cURL

### Health Check
```bash
curl http://localhost:4000/api/health
```

### Get all categories
```bash
curl http://localhost:4000/api/categories
```

### Create category
```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Makanan",
    "deskripsi": "Kategori untuk makanan"
  }'
```

### Get all products
```bash
curl http://localhost:4000/api/products
```

### Get products by category
```bash
curl "http://localhost:4000/api/products?category=550e8400-e29b-41d4-a716-446655440000"
```

### Create product
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Nasi Goreng",
    "deskripsi": "Nasi goreng spesial",
    "harga": 15000,
    "stok": 100,
    "gambar": "nasi-goreng.jpg",
    "kategori": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Create order (with auto stock decrement)
```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "keranjangs": [
      {
        "product_id": "650e8400-e29b-41d4-a716-446655440001",
        "jumlah": 2
      }
    ],
    "total_bayar": 30000,
    "uang_dibayar": 50000,
    "catatan": "Pedas sedang"
  }'
```

### Get all orders
```bash
curl http://localhost:4000/api/orders
```

---

## Database Schema

### categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### products
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL CHECK (stock >= 0),
  image_url VARCHAR(500),
  category_id UUID REFERENCES categories(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50) DEFAULT 'cash',
  paid_amount NUMERIC NOT NULL CHECK (paid_amount >= 0),
  change_amount NUMERIC NOT NULL CHECK (change_amount >= 0),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### order_items
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC NOT NULL CHECK (price >= 0),
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Migration Notes (v1.0 → v2.0)

### Breaking Changes

1. **ID Format**: Changed from integer (1, 2, 3) to UUID
   ```diff
   - "id": 1
   + "id": "650e8400-e29b-41d4-a716-446655440001"
   ```

2. **Orders Endpoint**: Changed from `/api/pesanans` to `/api/orders`
   ```diff
   - POST /api/pesanans
   + POST /api/orders
   ```

3. **Cart Deprecated**: `/api/keranjangs` removed
   ```diff
   - POST /api/keranjangs
   + Use frontend state management
   ```

4. **Product Query Params**: Changed parameter names
   ```diff
   - ?categoryId=1
   + ?category=550e8400-e29b-41d4-a716-446655440000
   ```

5. **Soft Delete**: DELETE `/api/products/:id` now sets `is_active=false` instead of removing from database

### New Features

- ✨ Auto-generated order numbers (ORD-YYYYMMDD-XXXX)
- ✨ Automatic stock decrement on order creation
- ✨ Change amount calculation
- ✨ Product soft delete (is_active flag)
- ✨ Order items stored with product name snapshot
- ✨ Category join in product queries

---

## Contact

**Author**: Hesa Firdaus  
**Repository**: cashier-app  
**Documentation Version**: 2.0.0  
**Last Updated**: 3 Januari 2025
