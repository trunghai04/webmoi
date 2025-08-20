const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    console.log('verifyToken middleware - headers:', req.headers);
    const token = req.headers.authorization?.split(' ')[1];
    console.log('verifyToken middleware - token:', token ? token.substring(0, 20) + '...' : 'no token');
    
    if (!token) {
      console.log('verifyToken middleware - no token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    console.log('verifyToken middleware - verifying token...');
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('verifyToken middleware - decoded:', decoded);
    } catch (jwtError) {
      console.log('verifyToken middleware - JWT verify error:', jwtError.message);
      throw jwtError;
    }
    
    // Get user from database
    console.log('verifyToken middleware - fetching user from database...');
    console.log('verifyToken middleware - looking for user ID:', decoded.userId);
    const [rows] = await pool.execute(
      'SELECT id, username, email, phone, role, avatar FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );
    console.log('verifyToken middleware - database result:', rows);

    if (rows.length === 0) {
      console.log('verifyToken middleware - user not found or inactive');
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = rows[0];
    console.log('verifyToken middleware - user set:', req.user);
    next();
  } catch (error) {
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
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  console.log('isAdmin middleware - user:', req.user);
  console.log('isAdmin middleware - user.role:', req.user?.role);
  
  if (!req.user) {
    console.log('isAdmin middleware - no user found');
    return res.status(401).json({
      success: false,
      message: 'User not authenticated'
    });
  }
  
  if (req.user.role !== 'admin') {
    console.log('isAdmin middleware - user is not admin, role:', req.user.role);
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  
  console.log('isAdmin middleware - user is admin, proceeding');
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const [rows] = await pool.execute(
      'SELECT id, username, email, phone, role, avatar FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );

    req.user = rows.length > 0 ? rows[0] : null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  optionalAuth
};
