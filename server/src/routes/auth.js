const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/register', validationRules.register, handleValidationErrors, authController.register);
router.post('/login', validationRules.login, handleValidationErrors, authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
