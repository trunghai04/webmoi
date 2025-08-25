const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { verifyToken } = require('../middleware/auth');

// Partner application routes
router.post('/apply', verifyToken, partnerController.submitApplication);
router.get('/status', verifyToken, partnerController.getApplicationStatus);

// Partner store routes
router.get('/store', verifyToken, partnerController.getPartnerStore);
router.put('/store', verifyToken, partnerController.updatePartnerStore);

module.exports = router;
