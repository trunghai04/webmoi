const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.pool.execute(`
      SELECT * FROM categories 
      WHERE is_active = 1 
      ORDER BY name ASC
    `);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.pool.execute(`
      SELECT * FROM categories 
      WHERE id = ? AND is_active = 1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
});

module.exports = router;