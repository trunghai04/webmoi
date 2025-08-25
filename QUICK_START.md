# ⚡ Quick Start Guide - MuaSamViet

## 🚀 **Install bằng 1 lệnh duy nhất**

### **Phương án 1: Từ GitHub (Khuyến nghị)**
```bash
curl -sSL https://raw.githubusercontent.com/trunghai04/webmoi/main/install.sh | bash
```

### **Phương án 2: Sau khi clone**
```bash
git clone https://github.com/trunghai04/webmoi.git
cd webmoi
npm run install:one
```

### **Phương án 3: Setup thủ công**
```bash
# 1. Clone repository
git clone https://github.com/trunghai04/webmoi.git
cd webmoi

# 2. Cài đặt dependencies
npm run install:all

# 3. Setup database
mysql -u root -p
CREATE DATABASE muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
mysql -u root -p muasamviet < muasamviet_database.sql

# 4. Cấu hình environment
cd server && cp env.example .env
cd ../client && cp env.example .env

# 5. Chạy ứng dụng
npm run dev
```

## 🌐 Truy cập
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
