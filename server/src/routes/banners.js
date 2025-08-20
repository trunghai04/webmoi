const express = require('express');
const router = express.Router();
const db = require('../config/database');
const adminAuth = require('../middleware/adminAuth');
const { upload } = require('../middleware/upload');

// Get all banners
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, title, image_url, link_url, is_active, sort_order, created_at, updated_at FROM banners ORDER BY sort_order ASC, id DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Get banners error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to get banners' });
  }
});

// Create banner (admin)
router.post('/', adminAuth, upload.single('banner'), async (req, res) => {
  try {
    const { title = '', link_url = '', sort_order = 0, is_active = 1 } = req.body;

    const imagePath = req.file ? `/uploads/banners/${req.file.filename}` : null;
    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'Banner image is required' });
    }

    const [result] = await db.query(
      'INSERT INTO banners (title, image_url, link_url, sort_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [title, imagePath, link_url, Number(sort_order) || 0, Number(is_active) ? 1 : 0]
    );

    res.status(201).json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    console.error('Create banner error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to create banner' });
  }
});

// Update banner (admin)
router.put('/:id', adminAuth, upload.single('banner'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, link_url, sort_order, is_active } = req.body;

    const fields = [];
    const params = [];

    if (title !== undefined) { fields.push('title = ?'); params.push(title); }
    if (link_url !== undefined) { fields.push('link_url = ?'); params.push(link_url); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); params.push(Number(sort_order) || 0); }
    if (is_active !== undefined) { fields.push('is_active = ?'); params.push(Number(is_active) ? 1 : 0); }
    if (req.file) { fields.push('image_url = ?'); params.push(`/uploads/banners/${req.file.filename}`); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const sql = `UPDATE banners SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`;
    params.push(id);
    await db.query(sql, params);

    res.json({ success: true, message: 'Banner updated' });
  } catch (error) {
    console.error('Update banner error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
});

// Delete banner (admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM banners WHERE id = ?', [id]);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
});

module.exports = router;


