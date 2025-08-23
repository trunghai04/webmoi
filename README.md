# MuaSamViet - E-commerce Platform

A modern e-commerce platform built with React, Node.js, and MySQL.

## 🚀 Features

### Frontend (React + Vite)
- **Modern UI/UX** with TailwindCSS
- **Responsive Design** for all devices
- **Flash Sale System** with countdown timer
- **User Authentication** with JWT
- **Shopping Cart** functionality
- **Product Search** and filtering
- **User Profile Management** with avatar upload
- **Order History** and tracking
- **Real-time Notifications**

### Backend (Node.js + Express)
- **RESTful API** with proper error handling
- **JWT Authentication** middleware
- **File Upload** for images and avatars
- **Database Integration** with MySQL
- **Flash Sale Management**
- **Product Management** system
- **User Profile Updates**

### Database (MySQL)
- **User Management** with profile fields
- **Product Catalog** with categories
- **Flash Sale Products** with timing
- **Order Management** system
- **Image Handling** with placeholders

## 🛠️ Installation

### Prerequisites
- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/trunghai04/MuaSamViet.git
cd MuaSamViet
```

2. **Install dependencies**
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. **Database Setup**
```bash
# Create database
mysql -u root -p
CREATE DATABASE muasamviet;
USE muasamviet;

# Import schema
mysql -u root -p muasamviet < muasamviet_database.sql
```

4. **Environment Configuration**
```bash
# Server environment
cd server
cp env.example .env
# Edit .env with your database credentials

# Client environment
cd ../client
# Create .env if needed for API URL
```

5. **Run the application**
```bash
# Start server (from server directory)
npm start

# Start client (from client directory)
npm run dev
```

## 📁 Project Structure

```
MuaSamViet/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── utils/         # Utility functions
│   │   └── config/        # Configuration files
│   └── public/            # Static assets
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   └── config/        # Configuration files
│   └── uploads/           # File uploads
└── docs/                  # Documentation
```

## 🔧 Key Features

### Flash Sale System
- Real-time countdown timer
- Dynamic product pricing
- Stock management
- Multiple time slots

### User Management
- Profile updates with avatar
- Address and personal info
- Order history tracking
- Account settings

### Product Management
- Category-based organization
- Search and filtering
- Image handling with fallbacks
- Stock tracking

## 🚀 Deployment

### Production Build
```bash
# Client build
cd client
npm run build

# Server setup
cd ../server
npm install --production
```

### Environment Variables
- `DB_HOST`: Database host
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: JWT secret key
- `PORT`: Server port (default: 5000)

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/avatar` - Upload avatar

### Products
- `GET /api/products` - Get all products
- `GET /api/products/flash-sale` - Get flash sale products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/search` - Search products

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Trung Hai** - Initial work

## 🙏 Acknowledgments

- React and Vite for the frontend framework
- Node.js and Express for the backend
- MySQL for the database
- TailwindCSS for styling
