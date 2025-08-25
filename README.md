# MuaSamViet - E-commerce Platform

Một nền tảng thương mại điện tử hoàn chỉnh với hệ thống người bán (Seller) tích hợp, được xây dựng bằng React, Node.js và MySQL.

## 🚀 Tính năng chính

### 👥 Hệ thống người dùng
- **Đăng ký/Đăng nhập**: Email, số điện thoại, Google, Facebook
- **Hồ sơ người dùng**: Cập nhật thông tin, avatar, địa chỉ
- **Phân quyền**: User, Admin, Partner (Người bán)

### 🏪 Hệ thống người bán (Seller)
- **Đăng ký người bán**: Form 5 bước với validation đầy đủ
- **Dashboard người bán**: Thống kê, quản lý sản phẩm, đơn hàng
- **Quản lý cửa hàng**: Thông tin shop, logo, banner
- **Quy trình duyệt**: Admin duyệt đơn đăng ký người bán

### 🛍️ Thương mại điện tử
- **Danh mục sản phẩm**: Phân cấp, tìm kiếm, lọc
- **Giỏ hàng**: Thêm, xóa, cập nhật số lượng
- **Đặt hàng**: Checkout, thanh toán, theo dõi đơn hàng
- **Đánh giá**: Review sản phẩm, rating
- **Yêu thích**: Wishlist, theo dõi sản phẩm

### 💬 Hỗ trợ khách hàng
- **Chat real-time**: Socket.IO, chat với người bán/admin
- **Thông báo**: Push notification, email
- **Phản hồi**: Form góp ý, khiếu nại
- **Hỗ trợ**: Ticket system

### 🎯 Marketing & Khuyến mãi
- **Banner**: Quản lý banner quảng cáo
- **Voucher**: Mã giảm giá, khuyến mãi
- **Điểm tích lũy**: Coins, loyalty program
- **Flash sale**: Chương trình giảm giá

### 📊 Admin Dashboard
- **Thống kê**: Doanh thu, đơn hàng, người dùng
- **Quản lý**: Sản phẩm, danh mục, đơn hàng
- **Duyệt người bán**: Xử lý đơn đăng ký
- **Broadcast**: Gửi thông báo toàn hệ thống

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18** - UI Framework
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **React Icons** - Icons
- **React Toastify** - Notifications
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **Socket.IO** - Real-time
- **Multer** - File upload
- **Nodemailer** - Email service

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
git clone https://github.com/trunghai04/MuaSamViet.git
cd MuaSamViet
```

### 2. Cài đặt dependencies
```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 3. Cấu hình database
```bash
# Tạo database
mysql -u root -p
CREATE DATABASE muasamviet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Import schema
mysql -u root -p muasamviet_db < muasamviet_database.sql
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
DB_NAME=muasamviet_db
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 5. Chạy ứng dụng
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
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

### Backend (Railway/Heroku)
```bash
cd server
npm start
```

### Database (PlanetScale/AWS RDS)
- Import `muasamviet_database.sql`
- Cập nhật connection string trong `.env`

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Tác giả**: Trung Hải
- **Email**: trunghai04@gmail.com
- **GitHub**: [@trunghai04](https://github.com/trunghai04)

## 🙏 Cảm ơn

- React Team
- Tailwind CSS
- Express.js
- MySQL Community
- Tất cả contributors

---

**MuaSamViet** - Nền tảng thương mại điện tử Việt Nam 🇻🇳
