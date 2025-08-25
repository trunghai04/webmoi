# 🚀 MuaSamViet - Hướng dẫn Setup Hoàn chỉnh

## 📋 Yêu cầu hệ thống
- **Node.js**: 18.0.0 trở lên
- **MySQL**: 8.0 trở lên
- **Git**: Để clone repository
- **npm** hoặc **yarn**: Package manager

## 🔧 Cài đặt từng bước

### 1. Clone và cài đặt dependencies

```bash
# Clone repository
git clone https://github.com/trunghai04/webmoi.git
cd webmoi

# Cài đặt dependencies cho Backend
cd server
npm install

# Cài đặt dependencies cho Frontend
cd ../client
npm install
```

### 2. Setup Database

```bash
# Đăng nhập MySQL
mysql -u root -p

# Tạo database (chạy trong MySQL console)
CREATE DATABASE muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'muasamviet_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON muasamviet.* TO 'muasamviet_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database schema
mysql -u root -p muasamviet < muasamviet_database.sql
```

### 3. Cấu hình Environment Variables

#### Backend (.env)
```bash
cd server
cp env.example .env
```

Chỉnh sửa file `server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=muasamviet_user
DB_PASSWORD=your_password_here
DB_NAME=muasamviet
DB_PORT=3306

# JWT Configuration
JWT_SECRET=muasamviet_super_secret_jwt_key_2024_secure_random_string_here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./src/uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Client URL
CLIENT_URL=http://localhost:5173

# Social Login Configuration
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=2896035803928889
FACEBOOK_APP_SECRET=0a864b72c6f7c8d76bef072d09ee1fc7

# Payment Configuration (VNPay example)
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
```

#### Frontend (.env)
```bash
cd client
```

Tạo file `client/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=MuaSamViet
VITE_APP_VERSION=1.0.0
```

### 4. Tạo thư mục uploads

```bash
cd server
mkdir -p src/uploads/avatars
mkdir -p src/uploads/products
mkdir -p src/uploads/banners
mkdir -p src/uploads/general

# Copy default avatar
cp src/uploads/avatars/default-avatar.svg src/uploads/avatars/
```

### 5. Tạo dữ liệu mẫu (Optional)

```bash
cd server
node create-test-user.js
```

### 6. Chạy ứng dụng

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 👥 Tài khoản mẫu

### Admin
- **Email**: admin@muasamviet.com
- **Password**: 123456

### User thường
- **Email**: user1@example.com
- **Password**: 123456

### Partner
- **Email**: partner1@example.com
- **Password**: 123456

## 🔧 Troubleshooting

### Lỗi Database Connection
```bash
# Kiểm tra MySQL service
sudo systemctl status mysql

# Kiểm tra kết nối
mysql -u muasamviet_user -p muasamviet
```

### Lỗi Port đã được sử dụng
```bash
# Kiểm tra port đang sử dụng
lsof -i :5000
lsof -i :5173

# Kill process nếu cần
kill -9 <PID>
```

### Lỗi CORS
- Đảm bảo `CORS_ORIGIN` trong `.env` đúng với URL frontend
- Restart backend sau khi sửa `.env`

### Lỗi JWT
- Kiểm tra `JWT_SECRET` trong `.env` đã được set
- Đảm bảo secret key đủ mạnh (ít nhất 32 ký tự)

### Lỗi File Upload
```bash
# Kiểm tra quyền thư mục uploads
chmod -R 755 server/src/uploads
```

## 📱 Social Login Setup

### Google OAuth
1. Tạo project tại [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Google+ API
3. Tạo OAuth 2.0 Client ID
4. Thêm domain vào Authorized origins
5. Cập nhật `GOOGLE_CLIENT_ID` trong `.env`

### Facebook OAuth
1. Tạo app tại [Facebook Developers](https://developers.facebook.com/)
2. Thêm Facebook Login product
3. Cấu hình OAuth redirect URIs
4. Cập nhật `FACEBOOK_APP_ID` và `FACEBOOK_APP_SECRET` trong `.env`

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_production_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### Build Frontend
```bash
cd client
npm run build
```

### Start Production Server
```bash
cd server
npm start
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console browser (F12)
2. Terminal backend logs
3. Database connection
4. Environment variables

## 🔄 Cập nhật code

```bash
git pull origin main
cd server && npm install
cd ../client && npm install
```

---

**Lưu ý**: Đảm bảo thay đổi tất cả password và secret keys trong production environment!
