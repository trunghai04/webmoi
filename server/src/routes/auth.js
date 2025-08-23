const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validationRules, handleValidationErrors } = require('../middleware/validation');
const { uploadAvatar, handleUploadError } = require('../middleware/upload');

// Public routes
router.post('/register', validationRules.register, handleValidationErrors, authController.register);
router.post('/login', validationRules.login, handleValidationErrors, authController.login);
router.post('/google-login', authController.googleLogin);
router.post('/facebook-login', authController.facebookLogin);
router.post('/forgot-password', validationRules.forgotPassword, handleValidationErrors, authController.forgotPassword);
router.post('/reset-password', validationRules.resetPassword, handleValidationErrors, authController.resetPassword);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.put('/change-password', verifyToken, authController.changePassword);
router.put('/avatar', verifyToken, uploadAvatar, handleUploadError, authController.updateAvatar);
router.put('/notification-settings', verifyToken, authController.updateNotificationSettings);
router.post('/logout', verifyToken, authController.logout);
router.get('/verify', verifyToken, authController.verifyToken);

module.exports = router;
