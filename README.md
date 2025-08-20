# 🛒 MuaSamViet - E-commerce Platform

[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.0.0-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Express](https://img.shields.io/badge/Express-4.18.0-black.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC.svg)](https://tailwindcss.com/)

MuaSamViet là một nền tảng thương mại điện tử hiện đại được xây dựng với React, Node.js và MySQL. Hệ thống hỗ trợ đầy đủ các tính năng từ quản lý sản phẩm, đơn hàng, đến hỗ trợ khách hàng và marketing.

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cài đặt](#-cài-đặt)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Đóng góp](#-đóng-góp)
- [License](#-license)

## ✨ Tính năng

### 👥 Quản lý người dùng
- **Đăng ký/Đăng nhập** với JWT authentication
- **Phân quyền** 3 vai trò: User, Admin, Partner
- **Quản lý profile** với avatar upload
- **Reset password** qua email
- **Cài đặt thông báo** tùy chỉnh

### 🛍️ Quản lý sản phẩm
- **Catalog sản phẩm** với danh mục phân cấp
- **Tìm kiếm và lọc** sản phẩm nâng cao
- **Đánh giá và review** sản phẩm
- **Wishlist** yêu thích
- **Flash sale** và khuyến mãi

### 🛒 Giỏ hàng & Đơn hàng
- **Giỏ hàng** với tính năng cập nhật real-time
- **Checkout** với nhiều phương thức thanh toán
- **Theo dõi đơn hàng** với tracking number
- **Lịch sử đơn hàng** chi tiết
- **Hủy/Đổi trả** đơn hàng

### 💬 Hỗ trợ khách hàng
- **Chat real-time** với Socket.IO
- **Hệ thống thông báo** đa kênh
- **Feedback/Support** ticket
- **FAQ** và hướng dẫn

### 🎯 Marketing & Loyalty
- **Voucher/Mã giảm giá** linh hoạt
- **Hệ thống tích điểm** (Coins)
- **Banner quảng cáo** quản lý
- **Email marketing** tự động

### 📊 Admin Dashboard
- **Thống kê** doanh thu, đơn hàng, người dùng
- **Quản lý sản phẩm** CRUD đầy đủ
- **Quản lý đơn hàng** với status tracking
- **Quản lý người dùng** và phân quyền
- **Báo cáo** chi tiết

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **React Context** - State management
- **Socket.IO Client** - Real-time communication
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload
- **Socket.IO** - Real-time communication
- **Nodemailer** - Email service
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL 8.0** - Relational database
- **JSON fields** - Flexible data storage
- **Indexes** - Performance optimization
- **Foreign Keys** - Data integrity
- **Views** - Complex queries
- **Stored Procedures** - Business logic

## 🚀 Cài đặt

### Yêu cầu hệ thống
- Node.js 18.0.0+
- MySQL 8.0+
- Git

### Bước 1: Clone repository
```bash
git clone https://github.com/trunghai04/MuaSamViet.git
cd MuaSamViet
```

### Bước 2: Cài đặt dependencies

#### Frontend
```bash
cd client
npm install
```

#### Backend
```bash
cd server
npm install
```

### Bước 3: Cấu hình database

1. Tạo database MySQL:
```sql
CREATE DATABASE muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import schema:
```bash
mysql -u root -p muasamviet < muasamviet_database.sql
```

### Bước 4: Cấu hình environment

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=muasamviet

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### Bước 5: Chạy ứng dụng

#### Development
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

#### Production
```bash
# Build frontend
cd client
npm run build

# Start backend
cd server
npm start
```

### Bước 6: Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin**: http://localhost:5173/admin (admin@muasamviet.com / password)

## 📁 Cấu trúc dự án

```
MuaSamViet/
├── client/                          # Frontend React
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # React Context
│   │   ├── hooks/                   # Custom hooks
│   │   ├── assets/                  # Images, icons
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                          # Backend Node.js
│   ├── src/
│   │   ├── controllers/             # Route controllers
│   │   ├── middleware/              # Custom middleware
│   │   ├── models/                  # Database models
│   │   ├── routes/                  # API routes
│   │   ├── config/                  # Configuration
│   │   ├── utils/                   # Utility functions
│   │   └── server.js                # Entry point
│   ├── uploads/                     # File uploads
│   └── package.json
├── muasamviet_database.sql          # Database schema
├── start-both.bat                   # Windows startup script
├── start-project.bat                # Alternative startup
├── .gitignore
└── README.md
```

## 🔌 API Documentation

### Authentication
```http
POST /api/auth/register              # Đăng ký
POST /api/auth/login                 # Đăng nhập
POST /api/auth/forgot-password       # Quên mật khẩu
POST /api/auth/reset-password        # Reset mật khẩu
GET  /api/auth/profile               # Lấy thông tin profile
PUT  /api/auth/profile               # Cập nhật profile
PUT  /api/auth/change-password       # Đổi mật khẩu
POST /api/auth/logout                # Đăng xuất
```

### Products
```http
GET  /api/products                   # Lấy danh sách sản phẩm
GET  /api/products/:id               # Lấy chi tiết sản phẩm
GET  /api/products/search            # Tìm kiếm sản phẩm
GET  /api/categories                 # Lấy danh mục
POST /api/products                   # Tạo sản phẩm (Admin)
PUT  /api/products/:id               # Cập nhật sản phẩm (Admin)
DELETE /api/products/:id             # Xóa sản phẩm (Admin)
```

### Cart & Orders
```http
GET  /api/cart                       # Lấy giỏ hàng
POST /api/cart                       # Thêm vào giỏ hàng
PUT  /api/cart/:id                   # Cập nhật giỏ hàng
DELETE /api/cart/:id                 # Xóa khỏi giỏ hàng
POST /api/orders                     # Tạo đơn hàng
GET  /api/orders                     # Lấy danh sách đơn hàng
GET  /api/orders/:id                 # Lấy chi tiết đơn hàng
PUT  /api/orders/:id/status          # Cập nhật trạng thái
```

### Chat & Support
```http
GET  /api/chat/rooms                 # Lấy phòng chat
POST /api/chat/rooms                 # Tạo phòng chat
GET  /api/chat/rooms/:id/messages    # Lấy tin nhắn
POST /api/chat/messages              # Gửi tin nhắn
GET  /api/chat/notifications         # Lấy thông báo
PUT  /api/chat/notifications/:id/read # Đánh dấu đã đọc
```

## 🗄️ Database Schema

### Core Tables
- **users** - Quản lý người dùng với 3 vai trò
- **categories** - Danh mục sản phẩm phân cấp
- **products** - Catalog sản phẩm chi tiết
- **cart** - Giỏ hàng người dùng
- **orders** - Quản lý đơn hàng
- **order_items** - Chi tiết đơn hàng

### User Experience
- **wishlist** - Danh sách yêu thích
- **reviews** - Đánh giá sản phẩm
- **notifications** - Thông báo hệ thống
- **feedback** - Phản hồi khách hàng

### Communication
- **chat_rooms** - Phòng chat
- **chat_messages** - Tin nhắn chat

### Business
- **banners** - Banner quảng cáo
- **settings** - Cài đặt hệ thống
- **vouchers** - Mã giảm giá
- **user_vouchers** - Sử dụng voucher
- **coins** - Hệ thống tích điểm

### Performance Optimizations
- **Views** - Truy vấn phức tạp
- **Indexes** - Tối ưu hiệu suất
- **Stored Procedures** - Logic nghiệp vụ

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
npm start
```

### Database (PlanetScale/AWS RDS)
```bash
# Import schema
mysql -h host -u user -p database < muasamviet_database.sql
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

### Coding Standards
- Sử dụng ESLint và Prettier
- Tuân thủ naming conventions
- Viết comments cho code phức tạp
- Test các tính năng mới

## 📝 License

Dự án này được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Tác giả**: Trung Hai
- **Email**: trunghai04@gmail.com
- **GitHub**: [@trunghai04](https://github.com/trunghai04)
- **Dự án**: [MuaSamViet](https://github.com/trunghai04/MuaSamViet)

## 🙏 Cảm ơn

Cảm ơn bạn đã quan tâm đến dự án MuaSamViet! Nếu dự án này hữu ích, hãy cho một ⭐ star nhé!

---

**MuaSamViet** - Nền tảng thương mại điện tử hiện đại cho tương lai! 🚀
