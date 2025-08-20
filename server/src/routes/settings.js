const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const settingsController = require('../controllers/settingsController');

// Get bank information
router.get('/bank-info', settingsController.getBankInfo);

// Update bank information (admin only)
router.put('/bank-info', adminAuth, settingsController.updateBankInfo);

// Get all settings
router.get('/', settingsController.getAllSettings);

// Update settings (admin only)
router.put('/', adminAuth, settingsController.updateSettings);

module.exports = router;
