# 🛒 MuaSamViet - Nền tảng Thương mại điện tử Việt Nam

Một nền tảng thương mại điện tử hoàn chỉnh với hệ thống người bán (Seller) tích hợp, được xây dựng bằng React, Node.js và MySQL.

## ✨ Tính năng chính

### 🛍️ E-commerce
- **Quản lý sản phẩm** - Thêm, sửa, xóa sản phẩm với hình ảnh
- **Giỏ hàng thông minh** - Lưu trữ và quản lý giỏ hàng
- **Đặt hàng** - Quy trình đặt hàng hoàn chỉnh
- **Thanh toán** - Tích hợp VNPay và các cổng thanh toán
- **Flash Sale** - Chương trình khuyến mãi đặc biệt
- **Đánh giá sản phẩm** - Hệ thống review và rating

### 👥 Hệ thống người bán (Partner)
- **Đăng ký người bán** - Quy trình xét duyệt
- **Quản lý cửa hàng** - Dashboard riêng cho từng seller
- **Quản lý đơn hàng** - Theo dõi và xử lý đơn hàng
- **Thống kê bán hàng** - Báo cáo doanh thu và hiệu suất
- **Quản lý sản phẩm** - CRUD sản phẩm của riêng mình

### 🔐 Xác thực & Bảo mật
- **Đăng nhập/Đăng ký** - Hệ thống xác thực JWT
- **Social Login** - Google, Facebook OAuth
- **Phân quyền** - User, Admin, Partner roles
- **Bảo mật** - Password hashing, rate limiting

### 💬 Giao tiếp
- **Chat real-time** - Hỗ trợ khách hàng
- **Thông báo** - Push notifications
- **Email** - Gửi email xác nhận, reset password

### 🎨 Giao diện
- **Responsive Design** - Tương thích mọi thiết bị
- **Modern UI/UX** - Thiết kế hiện đại với TailwindCSS
- **Dark/Light Mode** - Chế độ tối/sáng
- **Animations** - Hiệu ứng mượt mà với Framer Motion

## 🚀 Quick Start

### ⚡ Setup nhanh (5 phút)
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

### 🌐 Truy cập
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### 👥 Tài khoản test
- **Admin**: admin@muasamviet.com / 123456
- **User**: user1@example.com / 123456  
- **Partner**: partner1@example.com / 123456

## 📚 Hướng dẫn chi tiết

- **[Quick Start Guide](./QUICK_START.md)** - Setup nhanh trong 5 phút
- **[Setup Guide](./SETUP_GUIDE.md)** - Hướng dẫn chi tiết đầy đủ
- **[Social Login Setup](./SOCIAL_LOGIN_SETUP.md)** - Cấu hình đăng nhập mạng xã hội
- **[Store Page Guide](./STORE_PAGE_GUIDE.md)** - Hướng dẫn trang cửa hàng
- **[Unified System Guide](./UNIFIED_SYSTEM_GUIDE.md)** - Hệ thống thống nhất

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19** - UI Framework
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **React Toastify** - Notifications
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Socket.IO** - Real-time
- **Multer** - File upload
- **Nodemailer** - Email service
- **bcryptjs** - Password hashing

### Database
- **MySQL 8.0+** - Relational database
- **Foreign Keys** - Data integrity
- **Indexes** - Performance optimization
- **JSON columns** - Flexible data storage

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+
- MySQL 8.0+
- Git

### 1. Clone repository
```bash
git clone https://github.com/trunghai04/webmoi.git
cd webmoi
```

### 2. Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm run install:all

# Hoặc cài đặt riêng lẻ
cd server && npm install
cd ../client && npm install
```

### 3. Cấu hình database
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p muasamviet < muasamviet_database.sql
```

### 4. Cấu hình environment
```bash
# Backend (.env)
cd server
cp env.example .env
```

Chỉnh sửa `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=muasamviet
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 5. Chạy ứng dụng
```bash
# Chạy cả frontend và backend
npm run dev

# Hoặc chạy riêng lẻ
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
```

Truy cập: http://localhost:5173

## 📁 Cấu trúc project

```
MuaSamViet/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   ├── partner/   # Seller pages
│   │   │   └── user/      # User pages
│   │   ├── context/       # React Context
│   │   ├── hooks/         # Custom hooks
│   │   └── utils/         # Utilities
│   └── public/            # Static files
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration
│   └── uploads/           # File uploads
├── muasamviet_database.sql # Complete database schema
├── SETUP_GUIDE.md         # Hướng dẫn setup chi tiết
├── QUICK_START.md         # Setup nhanh
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google-login` - Google OAuth
- `POST /api/auth/facebook-login` - Facebook OAuth
- `GET /api/auth/verify` - Verify token
- `PUT /api/auth/profile` - Cập nhật hồ sơ
- `PUT /api/auth/avatar` - Upload avatar

### Partner/Seller
- `POST /api/partner/apply` - Đăng ký người bán
- `GET /api/partner/status` - Trạng thái đơn đăng ký
- `GET /api/partner/store` - Thông tin cửa hàng
- `PUT /api/partner/store` - Cập nhật cửa hàng

### Products & Orders
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/cart` - Thêm vào giỏ hàng
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Danh sách đơn hàng

### Admin
- `GET /api/admin/dashboard/stats` - Thống kê dashboard
- `POST /api/admin/users/:id/role` - Cập nhật role
- `POST /api/admin/partner/approve` - Duyệt người bán

## 👥 Tài khoản mẫu

### Admin
- Username: `admin`
- Password: `123456`
- Email: `admin@muasamviet.com`

### User thường
- Username: `user1`
- Password: `123456`
- Email: `user1@example.com`

### Partner
- Username: `partner1`
- Password: `123456`
- Email: `partner1@example.com`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
```

### Backend (Railway/Render)
```bash
cd server
npm start
```

### Database (PlanetScale/AWS RDS)
- Import `muasamviet_database.sql`
- Cập nhật connection string trong `.env`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: support@muasamviet.com
- **Documentation**: [Wiki](https://github.com/trunghai04/webmoi/wiki)
- **Issues**: [GitHub Issues](https://github.com/trunghai04/webmoi/issues)

---

**Made with ❤️ in Vietnam**
