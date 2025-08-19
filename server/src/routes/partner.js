const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { pool } = require('../config/database');
const Product = require('../models/Product');

// All partner routes require auth and role partner
router.use(verifyToken, (req, res, next) => {
  if (req.user.role !== 'partner' && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Partner access required' });
  }
  next();
});

// Partner own products list
router.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name,
             COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.png') as primary_image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.owner_id = ?
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, limit, offset]);

    const [[{ total }]] = await pool.execute('SELECT COUNT(*) as total FROM products WHERE owner_id = ?', [req.user.id]);

    res.json({ success: true, data: { products: rows, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch (error) {
    console.error('Partner products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const productData = { ...req.body, owner_id: req.user.id };
    const [result] = await pool.execute(`
      INSERT INTO products (owner_id, name, description, price, original_price, stock, category_id, brand, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      productData.name,
      productData.description || '',
      productData.price,
      productData.original_price || null,
      productData.stock || 0,
      productData.category_id,
      productData.brand || null,
      productData.is_featured ? 1 : 0
    ]);

    res.status(201).json({ success: true, data: { productId: result.insertId } });
  } catch (error) {
    console.error('Partner create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update product (only own)
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // ensure owner
    const [[product]] = await pool.execute('SELECT id FROM products WHERE id = ? AND owner_id = ?', [id, req.user.id]);
    if (!product) return res.status(404).json({ success: false, message: 'Not found' });

    const fields = ['name','description','price','original_price','stock','category_id','brand','is_featured'];
    const updates = [];
    const params = [];
    for (const f of fields) if (f in req.body) { updates.push(`${f} = ?`); params.push(req.body[f]); }
    if (updates.length === 0) return res.json({ success: true, message: 'Nothing to update' });
    params.push(id, req.user.id);

    await pool.execute(`UPDATE products SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ? AND owner_id = ?`, params);
    res.json({ success: true, message: 'Updated' });
  } catch (error) {
    console.error('Partner update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete product (soft)
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.execute('UPDATE products SET is_active = 0 WHERE id = ? AND owner_id = ?', [id, req.user.id]);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('Partner delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
