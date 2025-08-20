const db = require('../config/database');

// Get or create chat room between users
const getOrCreateRoom = async (req, res) => {
  try {
    const { partnerId } = req.body;
    const userId = req.user.id;

    // Check if room already exists
    let [rooms] = await db.query(
      'SELECT * FROM chat_rooms WHERE (user_id = ? AND partner_id = ?) OR (user_id = ? AND partner_id = ?) AND status = "active"',
      [userId, partnerId, partnerId, userId]
    );

    let room;
    if (rooms.length > 0) {
      room = rooms[0];
    } else {
      // Create new room
      const [result] = await db.query(
        'INSERT INTO chat_rooms (user_id, partner_id, room_type) VALUES (?, ?, ?)',
        [userId, partnerId, 'user_partner']
      );
      
      [rooms] = await db.query('SELECT * FROM chat_rooms WHERE id = ?', [result.insertId]);
      room = rooms[0];
    }

    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    console.error('Error getting/creating room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get or create chat room'
    });
  }
};

// Get user's chat rooms
const getUserRooms = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rooms] = await db.query(`
      SELECT 
        cr.*,
        u1.username as user_name,
        u1.full_name as user_full_name,
        u1.avatar as user_avatar,
        u2.username as partner_name,
        u2.full_name as partner_full_name,
        u2.avatar as partner_avatar,
        (SELECT content FROM chat_messages WHERE room_id = cr.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM chat_messages WHERE room_id = cr.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM chat_messages WHERE room_id = cr.id AND is_read = FALSE AND sender_id != ?) as unread_count
      FROM chat_rooms cr
      LEFT JOIN users u1 ON cr.user_id = u1.id
      LEFT JOIN users u2 ON cr.partner_id = u2.id
      WHERE (cr.user_id = ? OR cr.partner_id = ?) AND cr.status = 'active'
      ORDER BY cr.updated_at DESC
    `, [userId, userId, userId]);

    res.json({
      success: true,
      data: { rooms }
    });
  } catch (error) {
    console.error('Error getting user rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat rooms'
    });
  }
};

// Get messages in a room
const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;
    const userId = req.user.id;

    // Check if user has access to this room
    const [roomAccess] = await db.query(
      'SELECT * FROM chat_rooms WHERE id = ? AND (user_id = ? OR partner_id = ? OR admin_id = ?)',
      [roomId, userId, userId, userId]
    );

    if (roomAccess.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat room'
      });
    }

    const [messages] = await db.query(`
      SELECT 
        cm.*,
        u.username as sender_name,
        u.full_name as sender_full_name,
        u.avatar as sender_avatar
      FROM chat_messages cm
      JOIN users u ON cm.sender_id = u.id
      WHERE cm.room_id = ?
      ORDER BY cm.created_at DESC
      LIMIT ? OFFSET ?
    `, [roomId, parseInt(limit), offset]);

    // Mark messages as read
    await db.query(
      'UPDATE chat_messages SET is_read = TRUE WHERE room_id = ? AND sender_id != ?',
      [roomId, userId]
    );

    res.json({
      success: true,
      data: { 
        messages: messages.reverse(), // Show oldest first
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: messages.length
        }
      }
    });
  } catch (error) {
    console.error('Error getting room messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get messages'
    });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { roomId, content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    // Check room access
    const [roomAccess] = await db.query(
      'SELECT * FROM chat_rooms WHERE id = ? AND (user_id = ? OR partner_id = ? OR admin_id = ?)',
      [roomId, userId, userId, userId]
    );

    if (roomAccess.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this chat room'
      });
    }

    // Insert message
    const [result] = await db.query(
      'INSERT INTO chat_messages (room_id, sender_id, content, message_type) VALUES (?, ?, ?, ?)',
      [roomId, userId, content, messageType]
    );

    // Update room timestamp
    await db.query(
      'UPDATE chat_rooms SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [roomId]
    );

    // Get the created message with sender info
    const [messages] = await db.query(`
      SELECT 
        cm.*,
        u.username as sender_name,
        u.full_name as sender_full_name,
        u.avatar as sender_avatar
      FROM chat_messages cm
      JOIN users u ON cm.sender_id = u.id
      WHERE cm.id = ?
    `, [result.insertId]);

    res.json({
      success: true,
      data: { message: messages[0] }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get user notifications
const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const [notifications] = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, parseInt(limit), offset]
    );

    const [unreadCount] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      data: { 
        notifications,
        unread_count: unreadCount[0].count,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    await db.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// Admin: Create support room
const createSupportRoom = async (req, res) => {
  try {
    const { userId } = req.body;
    const adminId = req.user.id;

    // Check if support room already exists
    let [rooms] = await db.query(
      'SELECT * FROM chat_rooms WHERE user_id = ? AND room_type = "support" AND status = "active"',
      [userId]
    );

    let room;
    if (rooms.length > 0) {
      room = rooms[0];
      // Update admin_id if needed
      await db.query('UPDATE chat_rooms SET admin_id = ? WHERE id = ?', [adminId, room.id]);
    } else {
      // Create new support room
      const [result] = await db.query(
        'INSERT INTO chat_rooms (user_id, admin_id, room_type) VALUES (?, ?, "support")',
        [userId, adminId]
      );
      
      [rooms] = await db.query('SELECT * FROM chat_rooms WHERE id = ?', [result.insertId]);
      room = rooms[0];
    }

    res.json({
      success: true,
      data: { room }
    });
  } catch (error) {
    console.error('Error creating support room:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support room'
    });
  }
};

// Admin: Send broadcast notification
const sendBroadcastNotification = async (req, res) => {
  try {
    const { title, content, type = 'system' } = req.body;
    const adminId = req.user.id;

    // Get all users
    const [users] = await db.query('SELECT id FROM users WHERE role = "user"');
    
    // Insert notification for each user
    const notifications = [];
    for (const user of users) {
      const [result] = await db.query(
        'INSERT INTO notifications (user_id, type, title, content) VALUES (?, ?, ?, ?)',
        [user.id, type, title, content]
      );
      notifications.push(result.insertId);
    }

    // Emit via Socket.IO if available
    const io = req.app.get('io');
    if (io) {
      io.emit('admin_notification', {
        type,
        title,
        content,
        created_at: new Date()
      });
    }

    res.json({
      success: true,
      message: `Notification sent to ${users.length} users`,
      data: { notification_ids: notifications }
    });
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send broadcast notification'
    });
  }
};

module.exports = {
  getOrCreateRoom,
  getUserRooms,
  getRoomMessages,
  sendMessage,
  getUserNotifications,
  markNotificationRead,
  createSupportRoom,
  sendBroadcastNotification
};

