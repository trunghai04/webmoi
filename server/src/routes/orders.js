const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Validation middleware
const validateCreateOrder = [
  body('items').isArray({ min: 1 }).withMessage('Items must be a non-empty array'),
  body('items.*.id').isInt().withMessage('Product ID must be an integer'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Phone number is required'),
  body('shippingAddress.email').isEmail().withMessage('Valid email is required'),
  body('shippingAddress.address').notEmpty().withMessage('Address is required'),
  body('paymentMethod').isIn(['cod', 'card', 'bank']).withMessage('Invalid payment method'),
  body('shippingMethod').isIn(['standard', 'express']).withMessage('Invalid shipping method'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be a positive number'),
  body('shippingFee').isFloat({ min: 0 }).withMessage('Shipping fee must be a positive number'),
  body('tax').isFloat({ min: 0 }).withMessage('Tax must be a positive number'),
  body('total').isFloat({ min: 0 }).withMessage('Total must be a positive number')
];

const validateOrderId = [
  param('orderId').isInt().withMessage('Order ID must be an integer')
];

const validateUserId = [
  param('userId').isInt().withMessage('User ID must be an integer')
];

const validateUpdateStatus = [
  param('orderId').isInt().withMessage('Order ID must be an integer'),
  body('status').isIn(['processing', 'shipping', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('trackingNumber').optional().isString().withMessage('Tracking number must be a string'),
  body('note').optional().isString().withMessage('Note must be a string')
];

const validateCancelOrder = [
  param('orderId').isInt().withMessage('Order ID must be an integer'),
  body('reason').notEmpty().withMessage('Cancellation reason is required')
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

// Public routes (require authentication)
router.post('/create', verifyToken, validateCreateOrder, handleValidationErrors, orderController.createOrder);
router.get('/user/:userId', verifyToken, validateUserId, handleValidationErrors, orderController.getUserOrders);
router.get('/user/:userId/stats', verifyToken, validateUserId, handleValidationErrors, orderController.getOrderStats);
router.get('/:orderId', verifyToken, validateOrderId, handleValidationErrors, orderController.getOrderById);
router.put('/:orderId/status', verifyToken, validateUpdateStatus, handleValidationErrors, orderController.updateOrderStatus);
router.post('/:orderId/cancel', verifyToken, validateCancelOrder, handleValidationErrors, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', adminAuthMiddleware, orderController.getAllOrders);
router.put('/admin/:orderId/status', adminAuthMiddleware, validateUpdateStatus, handleValidationErrors, orderController.updateOrderStatus);

module.exports = router;
