const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  getOrCreateRoom,
  getUserRooms,
  getRoomMessages,
  sendMessage,
  getUserNotifications,
  markNotificationRead,
  createSupportRoom,
  sendBroadcastNotification
} = require('../controllers/chatController');

// User chat routes
router.post('/rooms', verifyToken, getOrCreateRoom);
router.get('/rooms', verifyToken, getUserRooms);
router.get('/rooms/:roomId/messages', verifyToken, getRoomMessages);
router.post('/messages', verifyToken, sendMessage);

// Notification routes
router.get('/notifications', verifyToken, getUserNotifications);
router.put('/notifications/:notificationId/read', verifyToken, markNotificationRead);

// Admin routes
router.post('/admin/support-room', verifyToken, isAdmin, createSupportRoom);
router.post('/admin/broadcast', verifyToken, isAdmin, sendBroadcastNotification);

module.exports = router;

