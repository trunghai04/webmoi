# ⚡ Quick Start Guide - MuaSamViet

## 🚀 Setup trong 5 phút

### 1. Clone và cài đặt
```bash
git clone https://github.com/trunghai04/webmoi.git
cd webmoi
npm run install:all
```

### 2. Setup Database
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;

# Import schema
mysql -u root -p muasamviet < muasamviet_database.sql
```

### 3. Cấu hình Environment
```bash
# Backend
cd server
cp env.example .env
# Chỉnh sửa .env với thông tin database của bạn

# Frontend  
cd ../client
cp env.example .env
```

### 4. Chạy ứng dụng
```bash
# Chạy cả frontend và backend
npm run dev

# Hoặc chạy riêng lẻ
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
```

### 5. Truy cập
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 👥 Tài khoản test
- **Admin**: admin@muasamviet.com / 123456
- **User**: user1@example.com / 123456
- **Partner**: partner1@example.com / 123456

## 🔧 Nếu gặp lỗi

### Lỗi Database
```bash
# Kiểm tra MySQL service
sudo systemctl status mysql

# Tạo user mới
mysql -u root -p
CREATE USER 'muasamviet_user'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON muasamviet.* TO 'muasamviet_user'@'localhost';
FLUSH PRIVILEGES;
```

### Lỗi Port
```bash
# Kiểm tra port đang sử dụng
lsof -i :5000
lsof -i :5173

# Kill process nếu cần
kill -9 <PID>
```

### Lỗi Dependencies
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
cd server && rm -rf node_modules package-lock.json
cd ../client && rm -rf node_modules package-lock.json
cd ..
npm run install:all
```

## 📞 Hỗ trợ nhanh
- **Console Browser**: F12 để xem lỗi
- **Terminal Backend**: Xem log lỗi
- **Database**: Kiểm tra kết nối MySQL

---

**Xem hướng dẫn chi tiết**: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
