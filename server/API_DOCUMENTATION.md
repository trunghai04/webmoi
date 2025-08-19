# MuaSamViet API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "ngtrunghi927",
  "email": "ngtrunghi927@gmail.com",
  "phone": "0123456789",
  "password": "Password123",
  "confirmPassword": "Password123",
  "full_name": "Nguyễn Trung Nghĩa",
  "birth_date": "1995-06-15",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "emailOrPhone": "ngtrunghi927@gmail.com",
  "password": "Password123"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "ngtrunghi927@gmail.com"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "newPassword": "NewPassword123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Nguyễn Trung Nghĩa",
  "phone": "0123456789",
  "birth_date": "1995-06-15",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}
```

#### Change Password
```http
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Password123",
  "newPassword": "NewPassword123"
}
```

### Products

#### Get All Products
```http
GET /products?page=1&limit=12&category_id=1&brand=Apple&min_price=1000000&max_price=50000000&search=iphone&sort_by=price&sort_order=ASC
```

#### Get Product by ID
```http
GET /products/1
```

#### Get Featured Products
```http
GET /products/featured?limit=8
```

#### Get Flash Sale Products
```http
GET /products/flash-sale
```

#### Search Products
```http
GET /products/search?q=iphone&page=1&limit=12
```

#### Get Product Brands
```http
GET /products/brands
```

#### Get Price Range
```http
GET /products/price-range
```

#### Get Products by Category
```http
GET /products/category/1?page=1&limit=12
```

#### Add Product Review
```http
POST /products/1/reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5,
  "title": "Sản phẩm tuyệt vời",
  "comment": "Chất lượng tốt, giao hàng nhanh"
}
```

### Cart

#### Get Cart
```http
GET /cart
Authorization: Bearer <token>
```

#### Get Cart Count
```http
GET /cart/count
Authorization: Bearer <token>
```

#### Add to Cart
```http
POST /cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": 1,
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /cart/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /cart/1
Authorization: Bearer <token>
```

#### Clear Cart
```http
DELETE /cart
Authorization: Bearer <token>
```

#### Validate Cart
```http
GET /cart/validate
Authorization: Bearer <token>
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /categories/1
```

#### Get Subcategories
```http
GET /categories/1/subcategories
```

### Admin Endpoints

#### Get All Products (Admin)
```http
GET /products/admin/all?page=1&limit=20&search=iphone&category_id=1&is_active=true
Authorization: Bearer <admin_token>
```

#### Create Product (Admin)
```http
POST /products/admin
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max",
  "description": "Điện thoại iPhone 15 Pro Max 256GB",
  "price": 29990000,
  "original_price": 32990000,
  "stock": 50,
  "category_id": 9,
  "brand": "Apple",
  "is_featured": true
}
```

#### Update Product (Admin)
```http
PUT /products/admin/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro Max Updated",
  "price": 28990000,
  "stock": 45
}
```

#### Delete Product (Admin)
```http
DELETE /products/admin/1
Authorization: Bearer <admin_token>
```

#### Create Category (Admin)
```http
POST /categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Điện thoại",
  "description": "Các loại điện thoại di động",
  "parent_id": 1,
  "sort_order": 1
}
```

#### Update Category (Admin)
```http
PUT /categories/1
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Điện thoại di động",
  "description": "Các loại điện thoại di động cập nhật"
}
```

#### Delete Category (Admin)
```http
DELETE /categories/1
Authorization: Bearer <admin_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "products": [...],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 100,
      "pages": 9
    }
  }
}
```

## Database Setup

### 1. Create Database
```sql
mysql -u root -p < database/complete_schema.sql
```

### 2. Environment Variables
Copy `env.example` to `.env` and configure:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=muasamviet_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# Email (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Default Users
The database includes default users:
- **Admin**: `admin@muasamviet.com` / `admin123`
- **User**: `ngtrunghi927@gmail.com` / `user123`

## Sample Data

The database includes:
- 8 main categories with subcategories
- 21 sample products with images
- Flash sale events and products
- Sample notifications and feedback
- Sample chat messages

## File Upload

### Product Images
- Upload to: `/uploads/products/`
- Supported formats: JPG, PNG, GIF, WebP
- Max size: 5MB per file
- Max files: 5 per product

### User Avatars
- Upload to: `/uploads/avatars/`
- Supported formats: JPG, PNG, GIF, WebP
- Max size: 5MB

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- 100 requests per 15 minutes per IP
- Applied to all `/api/` endpoints

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File upload security
- Rate limiting
- CORS protection
- Helmet.js security headers
