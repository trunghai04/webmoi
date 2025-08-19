# MuaSamViet Backend Server

Backend API server for the MuaSamViet e-commerce platform built with Node.js, Express, and MySQL.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Password reset via email
  - Role-based access control (User, Admin, Moderator)

- **E-commerce Functionality**
  - Product management
  - Category management
  - Shopping cart
  - Order management
  - Payment integration
  - Product reviews and ratings

- **User Management**
  - User profiles
  - Avatar upload
  - Address management
  - Order history

- **Communication**
  - Real-time chat system
  - Email notifications
  - Feedback system
  - Notification center

- **Security**
  - Password hashing with bcrypt
  - JWT token authentication
  - Rate limiting
  - Input validation
  - File upload security

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MuaSamViet/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=muasamviet_db
   DB_PORT=3306

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Email Configuration (Gmail)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Database Setup**
   ```bash
   # Create database and tables
   mysql -u root -p < database/schema.sql
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.js   # Database configuration
│   │   └── email.js      # Email configuration
│   ├── controllers/      # Route controllers
│   │   └── authController.js
│   ├── middleware/       # Custom middleware
│   │   ├── auth.js       # Authentication middleware
│   │   ├── upload.js     # File upload middleware
│   │   └── validation.js # Request validation
│   ├── models/           # Database models
│   │   └── User.js
│   ├── routes/           # API routes
│   │   └── auth.js
│   ├── utils/            # Utility functions
│   ├── uploads/          # Uploaded files
│   │   ├── avatars/
│   │   └── products/
│   └── server.js         # Main server file
├── database/
│   └── schema.sql        # Database schema
├── package.json
├── env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Health Check
- `GET /health` - Server health check

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests (to be implemented)
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_USER` | Database user | root |
| `DB_PASSWORD` | Database password | - |
| `DB_NAME` | Database name | muasamviet_db |
| `DB_PORT` | Database port | 3306 |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_PORT` | SMTP port | 587 |
| `EMAIL_USER` | Email username | - |
| `EMAIL_PASS` | Email password | - |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevent abuse
- **Input Validation** - Sanitize user input
- **JWT Authentication** - Secure API access
- **Password Hashing** - bcrypt encryption
- **File Upload Security** - Validate file types and sizes

## 📧 Email Integration

The server supports email notifications for:
- Welcome emails
- Password reset
- Order confirmations
- Account updates

Configure your email settings in the `.env` file.

## 🗄️ Database

The application uses MySQL with the following main tables:
- `users` - User accounts and profiles
- `products` - Product catalog
- `categories` - Product categories
- `orders` - Customer orders
- `cart` - Shopping cart items
- `chat_messages` - Real-time chat
- `feedback` - Customer feedback
- `notifications` - User notifications

## 🚀 Deployment

### Production Setup

1. Set `NODE_ENV=production` in your environment
2. Configure production database
3. Set up proper email credentials
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name muasamviet-api
   ```

### Docker (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates

Stay updated with the latest changes by checking the repository regularly and following the changelog.
