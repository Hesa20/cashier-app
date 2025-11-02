# API Documentation - Cashier App

Base URL: `http://localhost:4000/api`

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
  "timestamp": "2025-10-29T12:00:00.000Z",
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
      "id": 1,
      "nama": "Makanan",
      "createdAt": "2025-10-29T12:00:00.000Z"
    }
  ]
}
```

### GET /api/categories/:id

Get category by ID.

**Parameters:**
- `id` (path) - Category ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "nama": "Makanan",
    "createdAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### POST /api/categories

Create new category.

**Request Body:**
```json
{
  "nama": "Makanan"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Kategori berhasil ditambahkan",
  "data": {
    "id": 4,
    "nama": "Makanan",
    "createdAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### PUT /api/categories/:id

Update category.

**Parameters:**
- `id` (path) - Category ID

**Request Body:**
```json
{
  "nama": "Makanan Baru"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Kategori berhasil diupdate",
  "data": {
    "id": 1,
    "nama": "Makanan Baru",
    "updatedAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### DELETE /api/categories/:id

Delete category.

**Parameters:**
- `id` (path) - Category ID

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
- `categoryId` (optional) - Filter by category ID
- `search` (optional) - Search by name or code

**Examples:**
- `/api/products` - Get all products
- `/api/products?categoryId=1` - Get products in category 1
- `/api/products?search=nasi` - Search products

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "nama": "Nasi Goreng",
      "harga": 15000,
      "categoryId": 1,
      "gambar": "default.png",
      "kode": "NG-1",
      "stok": 100,
      "category": {
        "id": 1,
        "nama": "Makanan"
      }
    }
  ]
}
```

### GET /api/products/:id

Get product by ID.

**Parameters:**
- `id` (path) - Product ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "nama": "Nasi Goreng",
    "harga": 15000,
    "categoryId": 1,
    "gambar": "default.png",
    "kode": "NG-1",
    "stok": 100,
    "category": {
      "id": 1,
      "nama": "Makanan"
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
  "harga": 15000,
  "categoryId": 1,
  "kode": "NG-1",
  "gambar": "default.png",
  "stok": 100
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Produk berhasil ditambahkan",
  "data": {
    "id": 19,
    "nama": "Nasi Goreng",
    "harga": 15000,
    "categoryId": 1,
    "gambar": "default.png",
    "kode": "NG-1",
    "stok": 100,
    "createdAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### PUT /api/products/:id

Update product.

**Parameters:**
- `id` (path) - Product ID

**Request Body:**
```json
{
  "nama": "Nasi Goreng Special",
  "harga": 18000
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Produk berhasil diupdate",
  "data": {
    "id": 1,
    "nama": "Nasi Goreng Special",
    "harga": 18000,
    "updatedAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### DELETE /api/products/:id

Delete product.

**Parameters:**
- `id` (path) - Product ID

**Response:**
```json
{
  "status": "success",
  "message": "Produk berhasil dihapus"
}
```

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

## 4. Cart (Keranjang)

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

### GET /api/pesanans

Get all orders.

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "items": [
        {
          "productId": 1,
          "jumlah": 2,
          "totalHarga": 30000
        }
      ],
      "totalHarga": 30000,
      "metodePembayaran": "cash",
      "status": "pending",
      "createdAt": "2025-10-29T12:00:00.000Z"
    }
  ]
}
```

### GET /api/pesanans/:id

Get order by ID.

**Parameters:**
- `id` (path) - Order ID

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "items": [ ... ],
    "totalHarga": 30000,
    "metodePembayaran": "cash",
    "status": "pending",
    "createdAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### POST /api/pesanans

Create new order.

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "jumlah": 2,
      "harga": 15000,
      "totalHarga": 30000
    }
  ],
  "totalHarga": 30000,
  "metodePembayaran": "cash"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Pesanan berhasil dibuat",
  "data": {
    "id": 1,
    "items": [ ... ],
    "totalHarga": 30000,
    "metodePembayaran": "cash",
    "status": "pending",
    "createdAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### PATCH /api/pesanans/:id/status

Update order status.

**Parameters:**
- `id` (path) - Order ID

**Request Body:**
```json
{
  "status": "completed"
}
```

**Allowed status values:**
- `pending`
- `processing`
- `completed`
- `cancelled`

**Response:**
```json
{
  "status": "success",
  "message": "Status pesanan berhasil diupdate",
  "data": {
    "id": 1,
    "status": "completed",
    "updatedAt": "2025-10-29T12:00:00.000Z"
  }
}
```

### DELETE /api/pesanans/:id

Delete order.

**Parameters:**
- `id` (path) - Order ID

**Response:**
```json
{
  "status": "success",
  "message": "Pesanan berhasil dihapus"
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request (missing/invalid data) |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## Testing with cURL

### Get all products
```bash
curl http://localhost:4000/api/products
```

### Get products by category
```bash
curl http://localhost:4000/api/products?categoryId=1
```

### Create new product
```bash
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Nasi Goreng",
    "harga": 15000,
    "categoryId": 1,
    "kode": "NG-1",
    "stok": 100
  }'
```

### Add to cart
```bash
curl -X POST http://localhost:4000/api/keranjangs \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "jumlah": 2,
    "totalHarga": 30000
  }'
```

### Create order
```bash
curl -X POST http://localhost:4000/api/pesanans \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": 1, "jumlah": 2, "totalHarga": 30000}],
    "totalHarga": 30000,
    "metodePembayaran": "cash"
  }'
```
