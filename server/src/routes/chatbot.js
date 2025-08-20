const express = require('express');
const router = express.Router();
const { processMessage, getChatbotStats } = require('../controllers/chatbotController');

// Process chatbot message
router.post('/message', processMessage);

// Get chatbot statistics (admin only)
router.get('/stats', getChatbotStats);

module.exports = router;

