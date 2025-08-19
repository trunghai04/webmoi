const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/flash-sale', productController.getFlashSaleProducts);
router.get('/search', productController.searchProducts);
router.get('/brands', productController.getProductBrands);
router.get('/price-range', productController.getPriceRange);
router.get('/category/:categoryId', productController.getProductsByCategory);

// Protected routes
router.post('/:id/reviews', verifyToken, productController.addProductReview);

// Admin routes
router.get('/admin/all', verifyToken, isAdmin, productController.getAllProductsForAdmin);
router.post('/admin', verifyToken, isAdmin, validationRules.product, handleValidationErrors, productController.createProduct);
router.put('/admin/:id', verifyToken, isAdmin, validationRules.product, handleValidationErrors, productController.updateProduct);
router.delete('/admin/:id', verifyToken, isAdmin, productController.deleteProduct);

// Dynamic route should be after admin routes to avoid path conflicts
router.get('/:id', productController.getProductById);

module.exports = router;
