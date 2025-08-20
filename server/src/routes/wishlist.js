const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

// Validation middleware
const validateProductId = [
  body('productId').isInt().withMessage('Product ID must be an integer')
];

const validateProductIdParam = [
  param('productId').isInt().withMessage('Product ID must be an integer')
];

const validateMoveToCart = [
  body('productIds').isArray({ min: 1 }).withMessage('Product IDs must be a non-empty array'),
  body('productIds.*').isInt().withMessage('Each product ID must be an integer')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation error',
      errors: errors.array() 
    });
  }
  next();
};

// Routes
router.post('/add', verifyToken, validateProductId, handleValidationErrors, wishlistController.addToWishlist);
router.delete('/remove/:productId', verifyToken, validateProductIdParam, handleValidationErrors, wishlistController.removeFromWishlist);
router.get('/user', verifyToken, wishlistController.getUserWishlist);
router.get('/check/:productId', verifyToken, validateProductIdParam, handleValidationErrors, wishlistController.checkWishlistStatus);
router.delete('/clear', verifyToken, wishlistController.clearWishlist);
router.get('/stats', verifyToken, wishlistController.getWishlistStats);
router.post('/move-to-cart', verifyToken, validateMoveToCart, handleValidationErrors, wishlistController.moveToCart);

module.exports = router;
