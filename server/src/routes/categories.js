const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as product_count
      FROM categories c
      WHERE c.is_active = 1
      ORDER BY c.sort_order ASC, c.name ASC
    `);
    
    res.json({
      success: true,
      data: { categories: rows }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT * FROM categories WHERE id = ? AND is_active = 1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      data: { category: rows[0] }
    });
  } catch (error) {
    console.error('Get category by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Get subcategories
const getSubcategories = async (req, res) => {
  try {
    const { parentId } = req.params;
    
    const [rows] = await pool.execute(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM products WHERE category_id = c.id AND is_active = 1) as product_count
      FROM categories c
      WHERE c.parent_id = ? AND c.is_active = 1
      ORDER BY c.sort_order ASC, c.name ASC
    `, [parentId]);
    
    res.json({
      success: true,
      data: { categories: rows }
    });
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Create category
const createCategory = async (req, res) => {
  try {
    const { name, description, parent_id, sort_order = 0 } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục không được để trống'
      });
    }
    
    const [result] = await pool.execute(`
      INSERT INTO categories (name, description, parent_id, sort_order)
      VALUES (?, ?, ?, ?)
    `, [name.trim(), description, parent_id, sort_order]);
    
    res.status(201).json({
      success: true,
      message: 'Tạo danh mục thành công!',
      data: { categoryId: result.insertId }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, parent_id, sort_order } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Tên danh mục không được để trống'
      });
    }
    
    const [result] = await pool.execute(`
      UPDATE categories 
      SET name = ?, description = ?, parent_id = ?, sort_order = ?, updated_at = NOW()
      WHERE id = ?
    `, [name.trim(), description, parent_id, sort_order, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Cập nhật danh mục thành công!'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Admin: Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if category has products
    const [productRows] = await pool.execute(`
      SELECT COUNT(*) as count FROM products WHERE category_id = ?
    `, [id]);
    
    if (productRows[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục có sản phẩm'
      });
    }
    
    // Check if category has subcategories
    const [subcategoryRows] = await pool.execute(`
      SELECT COUNT(*) as count FROM categories WHERE parent_id = ?
    `, [id]);
    
    if (subcategoryRows[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa danh mục có danh mục con'
      });
    }
    
    const [result] = await pool.execute(`
      UPDATE categories SET is_active = 0 WHERE id = ?
    `, [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy danh mục'
      });
    }
    
    res.json({
      success: true,
      message: 'Xóa danh mục thành công!'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server. Vui lòng thử lại sau.'
    });
  }
};

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.get('/:parentId/subcategories', getSubcategories);

// Admin routes
router.post('/', verifyToken, isAdmin, createCategory);
router.put('/:id', verifyToken, isAdmin, updateCategory);
router.delete('/:id', verifyToken, isAdmin, deleteCategory);

module.exports = router;
