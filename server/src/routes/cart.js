const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(verifyToken);

router.get('/', cartController.getCart);
router.get('/count', cartController.getCartCount);
router.post('/add', cartController.addToCart);
router.put('/:product_id', cartController.updateCartItem);
router.delete('/:product_id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);
router.get('/validate', cartController.validateCart);

module.exports = router;
