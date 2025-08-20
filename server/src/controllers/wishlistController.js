const db = require('../config/database');
const { validationResult } = require('express-validator');

// Add product to wishlist
const addToWishlist = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { userId } = req.user;
    const { productId } = req.body;

    // Check if product exists
    const productQuery = 'SELECT id, name FROM products WHERE id = ? AND status = "active"';
    const [products] = await db.execute(productQuery, [productId]);

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or not available'
      });
    }

    // Check if already in wishlist
    const existingQuery = 'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?';
    const [existing] = await db.execute(existingQuery, [userId, productId]);

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const insertQuery = 'INSERT INTO wishlist (user_id, product_id, created_at) VALUES (?, ?, NOW())';
    await db.execute(insertQuery, [userId, productId]);

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist successfully'
    });

  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist'
    });
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

    // Check if product exists in wishlist
    const existingQuery = 'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?';
    const [existing] = await db.execute(existingQuery, [userId, productId]);

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    // Remove from wishlist
    const deleteQuery = 'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?';
    await db.execute(deleteQuery, [userId, productId]);

    res.json({
      success: true,
      message: 'Product removed from wishlist successfully'
    });

  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist'
    });
  }
};

// Get user wishlist
const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    const { page = 1, limit = 20, search, category } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE w.user_id = ? AND p.status = "active"';
    let params = [userId];

    if (search) {
      whereClause += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      whereClause += ' AND p.category_id = ?';
      params.push(category);
    }

    // Get wishlist items with product details
    const wishlistQuery = `
      SELECT 
        w.id as wishlist_id,
        w.created_at as added_date,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.original_price,
        p.image,
        p.stock,
        p.rating,
        p.review_count,
        c.name as category_name
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY w.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const [wishlistItems] = await db.execute(wishlistQuery, [...params, parseInt(limit), offset]);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      ${whereClause}
    `;

    const [countResult] = await db.execute(countQuery, params);
    const totalItems = countResult[0].total;

    res.json({
      success: true,
      data: {
        items: wishlistItems,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalItems,
          pages: Math.ceil(totalItems / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist'
    });
  }
};

// Check if product is in wishlist
const checkWishlistStatus = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productId } = req.params;

    const query = 'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?';
    const [result] = await db.execute(query, [userId, productId]);

    res.json({
      success: true,
      data: {
        inWishlist: result.length > 0
      }
    });

  } catch (error) {
    console.error('Check wishlist status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check wishlist status'
    });
  }
};

// Clear wishlist
const clearWishlist = async (req, res) => {
  try {
    const { userId } = req.user;

    const deleteQuery = 'DELETE FROM wishlist WHERE user_id = ?';
    const [result] = await db.execute(deleteQuery, [userId]);

    res.json({
      success: true,
      message: `Cleared ${result.affectedRows} items from wishlist`
    });

  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist'
    });
  }
};

// Get wishlist statistics
const getWishlistStats = async (req, res) => {
  try {
    const { userId } = req.user;

    // Get total items in wishlist
    const totalQuery = 'SELECT COUNT(*) as total FROM wishlist WHERE user_id = ?';
    const [totalResult] = await db.execute(totalQuery, [userId]);

    // Get items by category
    const categoryQuery = `
      SELECT 
        c.name as category_name,
        COUNT(*) as count
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE w.user_id = ?
      GROUP BY c.id, c.name
      ORDER BY count DESC
    `;

    const [categoryStats] = await db.execute(categoryQuery, [userId]);

    // Get price range statistics
    const priceQuery = `
      SELECT 
        MIN(p.price) as min_price,
        MAX(p.price) as max_price,
        AVG(p.price) as avg_price,
        SUM(p.price) as total_value
      FROM wishlist w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
    `;

    const [priceStats] = await db.execute(priceQuery, [userId]);

    res.json({
      success: true,
      data: {
        total: totalResult[0].total,
        byCategory: categoryStats,
        priceStats: priceStats[0]
      }
    });

  } catch (error) {
    console.error('Get wishlist stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wishlist statistics'
    });
  }
};

// Move wishlist items to cart
const moveToCart = async (req, res) => {
  try {
    const { userId } = req.user;
    const { productIds } = req.body; // Array of product IDs to move

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Product IDs array is required'
      });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      let movedCount = 0;
      let failedCount = 0;

      for (const productId of productIds) {
        // Check if product exists in wishlist
        const wishlistQuery = 'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?';
        const [wishlistItems] = await connection.execute(wishlistQuery, [userId, productId]);

        if (wishlistItems.length === 0) {
          failedCount++;
          continue;
        }

        // Check if product exists and is available
        const productQuery = 'SELECT id, name, price, stock FROM products WHERE id = ? AND status = "active"';
        const [products] = await connection.execute(productQuery, [productId]);

        if (products.length === 0 || products[0].stock <= 0) {
          failedCount++;
          continue;
        }

        // Check if already in cart
        const cartQuery = 'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?';
        const [cartItems] = await connection.execute(cartQuery, [userId, productId]);

        if (cartItems.length > 0) {
          // Update quantity
          await connection.execute(
            'UPDATE cart SET quantity = quantity + 1 WHERE user_id = ? AND product_id = ?',
            [userId, productId]
          );
        } else {
          // Add to cart
          await connection.execute(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)',
            [userId, productId]
          );
        }

        // Remove from wishlist
        await connection.execute(
          'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
          [userId, productId]
        );

        movedCount++;
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: `Moved ${movedCount} items to cart${failedCount > 0 ? `, ${failedCount} items failed` : ''}`,
        data: {
          moved: movedCount,
          failed: failedCount
        }
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move items to cart'
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  checkWishlistStatus,
  clearWishlist,
  getWishlistStats,
  moveToCart
};
