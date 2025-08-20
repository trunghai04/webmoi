const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validationRules = {
  // User registration
  register: [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    body('full_name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Full name is required and must be less than 100 characters'),
    
    body('phone')
      .optional()
      .matches(/^[0-9]{10,11}$/)
      .withMessage('Please provide a valid phone number'),
    
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
      })
  ],

  // User login
  login: [
    body('emailOrPhone')
      .notEmpty()
      .withMessage('Email or phone is required'),
    
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Product creation/update
  product: [
    body('name')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Product name is required and must be less than 255 characters'),
    
    body('description')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Description must be less than 1000 characters'),
    
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    
    body('category_id')
      .isInt({ min: 1 })
      .withMessage('Valid category ID is required'),
    
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ],

  // Order creation
  order: [
    body('items')
      .isArray({ min: 1 })
      .withMessage('At least one item is required'),
    
    body('items.*.product_id')
      .isInt({ min: 1 })
      .withMessage('Valid product ID is required'),
    
    body('items.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
    
    body('shipping_address')
      .isObject()
      .withMessage('Shipping address is required'),
    
    body('shipping_address.full_name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Full name is required'),
    
    body('shipping_address.phone')
      .matches(/^[0-9]{10,11}$/)
      .withMessage('Valid phone number is required'),
    
    body('shipping_address.address')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Address is required')
  ],

  // Pagination
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ],

  // Forgot password
  forgotPassword: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address')
  ],

  // Reset password
  resetPassword: [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    
    body('newPassword')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],

  // ID parameter
  idParam: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('Valid ID is required')
  ]
};

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        param: error.param || error.path,
        msg: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// Custom validators
const customValidators = {
  // Check if email exists
  emailExists: async (email) => {
    const { pool } = require('../config/database');
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    return rows.length === 0;
  },

  // Check if username exists
  usernameExists: async (username) => {
    const { pool } = require('../config/database');
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    return rows.length === 0;
  },

  // Check if product exists
  productExists: async (productId) => {
    const { pool } = require('../config/database');
    const [rows] = await pool.execute(
      'SELECT id FROM products WHERE id = ? AND is_active = 1',
      [productId]
    );
    return rows.length > 0;
  }
};

module.exports = {
  validationRules,
  handleValidationErrors,
  customValidators
};
