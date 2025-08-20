const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import configurations
const { testConnection } = require('./config/database');
const { verifyEmailConfig } = require('./config/email');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const categoryRoutes = require('./routes/categories');
const orderRoutes = require('./routes/orders');
const wishlistRoutes = require('./routes/wishlist');
const adminRoutes = require('./routes/admin');
const partnerRoutes = require('./routes/partner');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available to routes
app.set('io', io);

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting - General API
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

// Rate limiting - Auth routes (more lenient)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 auth requests per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/', generalLimiter);

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'MuaSamViet API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/settings', require('./routes/settings'));
app.use('/api/banners', require('./routes/banners'));

// Chat routes
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);

// Chatbot routes
const chatbotRoutes = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRoutes);

// Socket.IO chat handling
const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins with authentication
  socket.on('join', (userData) => {
    if (userData && userData.userId) {
      activeUsers.set(socket.id, {
        userId: userData.userId,
        username: userData.username,
        role: userData.role
      });
      
      // Join user-specific room
      socket.join(`user_${userData.userId}`);
      
      // Join role-specific room
      if (userData.role === 'admin') {
        socket.join('admin_room');
      } else if (userData.role === 'partner') {
        socket.join('partner_room');
      }
      
      console.log(`User ${userData.username} (${userData.role}) joined`);
    }
  });

  // Join specific chat room
  socket.on('join_room', (roomId) => {
    socket.join(`room_${roomId}`);
    console.log(`Socket ${socket.id} joined room_${roomId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (messageData) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      // Save message to database
      const db = require('./config/database');
      const [result] = await db.query(
        'INSERT INTO chat_messages (room_id, sender_id, content, message_type) VALUES (?, ?, ?, ?)',
        [messageData.roomId, user.userId, messageData.content, messageData.type || 'text']
      );

      const newMessage = {
        id: result.insertId,
        room_id: messageData.roomId,
        sender_id: user.userId,
        sender_name: user.username,
        content: messageData.content,
        message_type: messageData.type || 'text',
        created_at: new Date(),
        is_read: false
      };

      // Broadcast message to room
      io.to(`room_${messageData.roomId}`).emit('new_message', newMessage);
      
      console.log(`Message sent in room ${messageData.roomId} by ${user.username}`);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Admin broadcast notifications
  socket.on('admin_broadcast', async (notificationData) => {
    try {
      const user = activeUsers.get(socket.id);
      if (!user || user.role !== 'admin') {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      const db = require('./config/database');
      
      // Save notification to database for all users
      const [users] = await db.query('SELECT id FROM users WHERE role = "user"');
      
      for (const targetUser of users) {
        await db.query(
          'INSERT INTO notifications (user_id, type, title, content) VALUES (?, ?, ?, ?)',
          [targetUser.id, notificationData.type || 'system', notificationData.title, notificationData.content]
        );
      }

      // Broadcast to all connected users
      io.emit('admin_notification', {
        type: notificationData.type || 'system',
        title: notificationData.title,
        content: notificationData.content,
        created_at: new Date()
      });

      console.log(`Admin ${user.username} broadcasted notification: ${notificationData.title}`);
    } catch (error) {
      console.error('Error broadcasting notification:', error);
      socket.emit('error', { message: 'Failed to broadcast notification' });
    }
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(`room_${data.roomId}`).emit('user_typing', {
      userId: activeUsers.get(socket.id)?.userId,
      username: activeUsers.get(socket.id)?.username,
      isTyping: data.isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      console.log(`User ${user.username} disconnected`);
      activeUsers.delete(socket.id);
    }
  });
});

// Make io available globally
app.set('io', io);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle multer errors
  if (error.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      message: 'File upload error: ' + error.message
    });
  }
  
  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: ' + error.message
    });
  }
  
  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Test email configuration (skip if not configured)
    await verifyEmailConfig();
    
    // Start server with Socket.IO
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${PORT}`);
      console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
    });

    // Graceful restarts with nodemon (SIGUSR2) and standard signals
    const shutdown = (signal) => {
      console.log(`🛑 ${signal} received. Shutting down HTTP server...`);
      server.close(() => {
        console.log('✅ HTTP server closed. Exiting.');
        process.exit(0);
      });
      // Force exit if close hangs
      setTimeout(() => process.exit(0), 3000).unref();
    };
    process.once('SIGUSR2', () => shutdown('SIGUSR2'));
    process.once('SIGTERM', () => shutdown('SIGTERM'));
    process.once('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();
