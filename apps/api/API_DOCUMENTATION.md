# API Documentation - Cashier App Backend

## API Endpoints

Base URL: `http://localhost:4000/api`

### Health Check
```
GET /api/health
```

### Products
```
GET    /api/products              # Get all products
GET    /api/products?categoryId=1 # Filter by category ID
GET    /api/products/:id          # Get by ID
POST   /api/products              # Create new
PUT    /api/products/:id          # Update
DELETE /api/products/:id          # Delete
PATCH  /api/products/:id/stok     # Update stock
```

### Categories
```
GET    /api/categories            # Get all
GET    /api/categories/:id        # Get by ID
POST   /api/categories            # Create
PUT    /api/categories/:id        # Update
DELETE /api/categories/:id        # Delete
```

### Orders
```
GET    /api/orders                # Get all orders
GET    /api/orders/:id            # Get by ID with items
POST   /api/orders                # Create order (auto stock update)
PATCH  /api/orders/:id/status     # Update status
DELETE /api/orders/:id            # Delete order
```


