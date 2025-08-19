const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const { pool } = require('../config/database');
const User = require('../models/User');

router.use(verifyToken, isAdmin);

// Dashboard stats
router.get('/dashboard/stats', async (req, res) => {
  try {
    const [[{ totalUsers }]] = await pool.execute('SELECT COUNT(*) as totalUsers FROM users');
    const [[{ totalPartners }]] = await pool.execute("SELECT COUNT(*) as totalPartners FROM users WHERE role = 'partner'");
    const [[{ totalProducts }]] = await pool.execute('SELECT COUNT(*) as totalProducts FROM products WHERE is_active = 1');
    const [[{ totalOrders }]] = await pool.execute('SELECT COUNT(*) as totalOrders FROM orders');
    const [[{ pendingFeedback }]] = await pool.execute("SELECT COUNT(*) as pendingFeedback FROM feedback WHERE status = 'pending'");
    const [[{ totalRevenue }]] = await pool.execute('SELECT COALESCE(SUM(final_amount),0) as totalRevenue FROM orders WHERE payment_status = "paid"');

    res.json({
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingFeedback,
        activePartners: totalPartners
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Users list
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role && req.query.role !== 'all' ? req.query.role : null;

    const result = await User.getAll(page, limit, search, role);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Admin get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const ok = await User.updateRole(id, role);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Role updated' });
  } catch (error) {
    console.error('Admin update role error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await User.delete(id);
    if (!ok) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    console.error('Admin delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
