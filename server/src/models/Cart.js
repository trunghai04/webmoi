const { pool } = require('../config/database');

class Cart {
  // Get user's cart items
  static async getByUserId(userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT c.*, p.name, p.price, p.original_price, p.stock,
               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
        FROM cart c
        LEFT JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.is_active = 1
        ORDER BY c.created_at DESC
      `, [userId]);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Add item to cart
  static async addItem(userId, productId, quantity = 1) {
    try {
      // Check if product exists and is active
      const [productRows] = await pool.execute(`
        SELECT id, stock FROM products WHERE id = ? AND is_active = 1
      `, [productId]);
      
      if (productRows.length === 0) {
        throw new Error('Sản phẩm không tồn tại hoặc đã bị ẩn');
      }
      
      const product = productRows[0];
      
      // Check stock
      if (product.stock < quantity) {
        throw new Error('Số lượng sản phẩm trong kho không đủ');
      }
      
      // Check if item already exists in cart
      const [existingRows] = await pool.execute(`
        SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);
      
      if (existingRows.length > 0) {
        // Update quantity
        const newQuantity = existingRows[0].quantity + quantity;
        
        if (product.stock < newQuantity) {
          throw new Error('Số lượng sản phẩm trong kho không đủ');
        }
        
        await pool.execute(`
          UPDATE cart SET quantity = ?, updated_at = NOW() WHERE id = ?
        `, [newQuantity, existingRows[0].id]);
        
        return existingRows[0].id;
      } else {
        // Add new item
        const [result] = await pool.execute(`
          INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)
        `, [userId, productId, quantity]);
        
        return result.insertId;
      }
    } catch (error) {
      throw error;
    }
  }

  // Update cart item quantity
  static async updateQuantity(userId, productId, quantity) {
    try {
      // Check if product exists and is active
      const [productRows] = await pool.execute(`
        SELECT id, stock FROM products WHERE id = ? AND is_active = 1
      `, [productId]);
      
      if (productRows.length === 0) {
        throw new Error('Sản phẩm không tồn tại hoặc đã bị ẩn');
      }
      
      const product = productRows[0];
      
      // Check stock
      if (product.stock < quantity) {
        throw new Error('Số lượng sản phẩm trong kho không đủ');
      }
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        await this.removeItem(userId, productId);
        return true;
      }
      
      const [result] = await pool.execute(`
        UPDATE cart SET quantity = ?, updated_at = NOW() 
        WHERE user_id = ? AND product_id = ?
      `, [quantity, userId, productId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Remove item from cart
  static async removeItem(userId, productId) {
    try {
      const [result] = await pool.execute(`
        DELETE FROM cart WHERE user_id = ? AND product_id = ?
      `, [userId, productId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Clear user's cart
  static async clearCart(userId) {
    try {
      const [result] = await pool.execute(`
        DELETE FROM cart WHERE user_id = ?
      `, [userId]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get cart count
  static async getCartCount(userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT SUM(quantity) as count FROM cart WHERE user_id = ?
      `, [userId]);
      
      return rows[0].count || 0;
    } catch (error) {
      throw error;
    }
  }

  // Get cart total
  static async getCartTotal(userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT SUM(c.quantity * p.price) as total
        FROM cart c
        LEFT JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.is_active = 1
      `, [userId]);
      
      return rows[0].total || 0;
    } catch (error) {
      throw error;
    }
  }

  // Check if cart items are still available
  static async validateCart(userId) {
    try {
      const [rows] = await pool.execute(`
        SELECT c.product_id, c.quantity, p.name, p.stock, p.price, p.is_active
        FROM cart c
        LEFT JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `, [userId]);
      
      const issues = [];
      
      for (const item of rows) {
        if (!item.is_active) {
          issues.push({
            product_id: item.product_id,
            name: item.name,
            issue: 'Sản phẩm đã bị ẩn'
          });
        } else if (item.stock < item.quantity) {
          issues.push({
            product_id: item.product_id,
            name: item.name,
            issue: `Chỉ còn ${item.stock} sản phẩm trong kho`,
            available_stock: item.stock
          });
        }
      }
      
      return issues;
    } catch (error) {
      throw error;
    }
  }

  // Move cart items to order
  static async moveToOrder(userId, orderId) {
    try {
      // Get cart items
      const cartItems = await this.getByUserId(userId);
      
      if (cartItems.length === 0) {
        throw new Error('Giỏ hàng trống');
      }
      
      // Insert order items
      for (const item of cartItems) {
        await pool.execute(`
          INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, subtotal)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          orderId,
          item.product_id,
          item.name,
          item.image,
          item.price,
          item.quantity,
          item.price * item.quantity
        ]);
        
        // Update product stock
        await pool.execute(`
          UPDATE products SET stock = stock - ? WHERE id = ?
        `, [item.quantity, item.product_id]);
      }
      
      // Clear cart
      await this.clearCart(userId);
      
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Cart;
