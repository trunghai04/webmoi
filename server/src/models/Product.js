const { pool } = require('../config/database');

class Product {
  // Get all products with pagination and filters
  static async getAll(page = 1, limit = 12, filters = {}) {
    try {
      const safeLimit = Math.max(1, Math.min(200, Number(limit) || 12));
      const safeOffset = Math.max(0, (Math.max(1, Number(page) || 1) - 1) * safeLimit);
      let query = `
        SELECT p.*, c.name as category_name, 
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.svg') as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1
      `;
      let params = [];
      
      // Apply filters
      if (filters.category_id) {
        query += ' AND p.category_id = ?';
        params.push(filters.category_id);
      }
      
      if (filters.brand) {
        query += ' AND p.brand LIKE ?';
        params.push(`%${filters.brand}%`);
      }
      
      if (filters.min_price) {
        query += ' AND p.price >= ?';
        params.push(filters.min_price);
      }
      
      if (filters.max_price) {
        query += ' AND p.price <= ?';
        params.push(filters.max_price);
      }
      
      if (filters.search) {
        query += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (filters.is_featured) {
        query += ' AND p.is_featured = 1';
      }
      
      if (filters.is_flash_sale) {
        query += ' AND p.is_flash_sale = 1 AND NOW() BETWEEN p.flash_sale_start AND p.flash_sale_end';
      }
      
      // Apply sorting
      const sortField = filters.sort_by || 'created_at';
      const sortOrder = filters.sort_order || 'DESC';
      query += ` ORDER BY p.${sortField} ${sortOrder}`;
      
      query += ` LIMIT ${safeLimit} OFFSET ${safeOffset}`;
      
      const [rows] = await pool.execute(query, params);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE p.is_active = 1';
      let countParams = [];
      
      if (filters.category_id) {
        countQuery += ' AND p.category_id = ?';
        countParams.push(filters.category_id);
      }
      
      if (filters.brand) {
        countQuery += ' AND p.brand LIKE ?';
        countParams.push(`%${filters.brand}%`);
      }
      
      if (filters.min_price) {
        countQuery += ' AND p.price >= ?';
        countParams.push(filters.min_price);
      }
      
      if (filters.max_price) {
        countQuery += ' AND p.price <= ?';
        countParams.push(filters.max_price);
      }
      
      if (filters.search) {
        countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        countParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (filters.is_featured) {
        countQuery += ' AND p.is_featured = 1';
      }
      
      if (filters.is_flash_sale) {
        countQuery += ' AND p.is_flash_sale = 1 AND NOW() BETWEEN p.flash_sale_start AND p.flash_sale_end';
      }
      
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;
      
      return {
        products: rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get product by ID with images and reviews
  static async getById(id) {
    try {
      // Get product details
      const [productRows] = await pool.execute(`
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id = ? AND p.is_active = 1
      `, [id]);
      
      if (productRows.length === 0) {
        return null;
      }
      
      const product = productRows[0];
      
      // Get product images
      const [imageRows] = await pool.execute(`
        SELECT * FROM product_images 
        WHERE product_id = ? 
        ORDER BY is_primary DESC, sort_order ASC
      `, [id]);
      
      // Get product reviews
      const [reviewRows] = await pool.execute(`
        SELECT pr.*, u.username, u.avatar
        FROM product_reviews pr
        LEFT JOIN users u ON pr.user_id = u.id
        WHERE pr.product_id = ?
        ORDER BY pr.created_at DESC
        LIMIT 10
      `, [id]);
      
      // Get related products
      const [relatedRows] = await pool.execute(`
        SELECT p.*, 
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.svg') as primary_image
        FROM products p
        WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
        ORDER BY p.rating DESC, p.views DESC
        LIMIT 8
      `, [product.category_id, id]);
      
      // Increment view count
      await pool.execute('UPDATE products SET views = views + 1 WHERE id = ?', [id]);
      
      return {
        ...product,
        images: imageRows,
        reviews: reviewRows,
        related_products: relatedRows
      };
    } catch (error) {
      throw error;
    }
  }

  // Get featured products
  static async getFeatured(limit = 8) {
    try {
      // Some MySQL setups do not allow binding LIMIT as a parameter in prepared statements.
      // Sanitize and inline the numeric limit to avoid ER_WRONG_ARGUMENTS.
      const safeLimit = Math.max(1, Math.min(100, Number(limit) || 8));
      const sql = `
        SELECT p.*, c.name as category_name,
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.svg') as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_featured = 1 AND p.is_active = 1
        ORDER BY p.rating DESC, p.views DESC
        LIMIT ${safeLimit}
      `;
      const [rows] = await pool.execute(sql);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get flash sale products
  static async getFlashSale() {
    try {
      const [rows] = await pool.execute(`
        SELECT p.*, c.name as category_name,
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.svg') as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_flash_sale = 1 
          AND p.is_active = 1 
          AND NOW() BETWEEN p.flash_sale_start AND p.flash_sale_end
        ORDER BY p.flash_sale_end ASC
      `);
      
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Get products by category
  static async getByCategory(categoryId, page = 1, limit = 12) {
    try {
      const safeLimit = Math.max(1, Math.min(200, Number(limit) || 12));
      const safeOffset = Math.max(0, (Math.max(1, Number(page) || 1) - 1) * safeLimit);
      
      const [rows] = await pool.execute(`
        SELECT p.*, c.name as category_name,
               COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.svg') as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ? AND p.is_active = 1
        ORDER BY p.created_at DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `, [categoryId]);
      
      // Get total count
      const [countResult] = await pool.execute(`
        SELECT COUNT(*) as total 
        FROM products 
        WHERE category_id = ? AND is_active = 1
      `, [categoryId]);
      
      const total = countResult[0].total;
      
      return {
        products: rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Search products
  static async search(query, page = 1, limit = 12) {
    try {
      const safeLimit = Math.max(1, Math.min(200, Number(limit) || 12));
      const safeOffset = Math.max(0, (Math.max(1, Number(page) || 1) - 1) * safeLimit);
      
      const [rows] = await pool.execute(`
        SELECT p.*, c.name as category_name,
               (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1 
          AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR c.name LIKE ?)
        ORDER BY 
          CASE 
            WHEN p.name LIKE ? THEN 1
            WHEN p.brand LIKE ? THEN 2
            ELSE 3
          END,
          p.rating DESC
        LIMIT ${safeLimit} OFFSET ${safeOffset}
      `, [
        `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`,
        `%${query}%`, `%${query}%`,
      ]);
      
      // Get total count
      const [countResult] = await pool.execute(`
        SELECT COUNT(*) as total 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = 1 
          AND (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR c.name LIKE ?)
      `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
      
      const total = countResult[0].total;
      
      return {
        products: rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get product brands
  static async getBrands() {
    try {
      const [rows] = await pool.execute(`
        SELECT DISTINCT brand 
        FROM products 
        WHERE brand IS NOT NULL AND brand != '' AND is_active = 1
        ORDER BY brand
      `);
      
      return rows.map(row => row.brand);
    } catch (error) {
      throw error;
    }
  }

  // Get price range
  static async getPriceRange() {
    try {
      const [rows] = await pool.execute(`
        SELECT MIN(price) as min_price, MAX(price) as max_price
        FROM products 
        WHERE is_active = 1
      `);
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Add product review
  static async addReview(productId, userId, reviewData) {
    try {
      const { rating, title, comment } = reviewData;
      
      // Check if user already reviewed this product
      const [existingReview] = await pool.execute(`
        SELECT id FROM product_reviews 
        WHERE product_id = ? AND user_id = ?
      `, [productId, userId]);
      
      if (existingReview.length > 0) {
        throw new Error('Bạn đã đánh giá sản phẩm này rồi');
      }
      
      // Add review
      const [result] = await pool.execute(`
        INSERT INTO product_reviews (product_id, user_id, rating, title, comment)
        VALUES (?, ?, ?, ?, ?)
      `, [productId, userId, rating, title, comment]);
      
      // Update product rating
      await this.updateProductRating(productId);
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Update product rating
  static async updateProductRating(productId) {
    try {
      await pool.execute(`
        UPDATE products p 
        SET rating = (
          SELECT AVG(rating) 
          FROM product_reviews pr 
          WHERE pr.product_id = p.id
        ),
        total_reviews = (
          SELECT COUNT(*) 
          FROM product_reviews pr 
          WHERE pr.product_id = p.id
        )
        WHERE p.id = ?
      `, [productId]);
    } catch (error) {
      throw error;
    }
  }

  // Admin: Create product
  static async create(productData) {
    try {
      const {
        name, description, price, original_price, stock, category_id,
        brand, weight, dimensions, is_featured, is_flash_sale,
        flash_sale_price, flash_sale_start, flash_sale_end
      } = productData;
      
      const [result] = await pool.execute(`
        INSERT INTO products (
          name, description, price, original_price, stock, category_id,
          brand, weight, dimensions, is_featured, is_flash_sale,
          flash_sale_price, flash_sale_start, flash_sale_end
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name, description, price, original_price, stock, category_id,
        brand, weight, dimensions, is_featured, is_flash_sale,
        flash_sale_price, flash_sale_start, flash_sale_end
      ]);
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Update product
  static async update(id, productData) {
    try {
      const {
        name, description, price, original_price, stock, category_id,
        brand, weight, dimensions, is_featured, is_flash_sale,
        flash_sale_price, flash_sale_start, flash_sale_end
      } = productData;
      
      const [result] = await pool.execute(`
        UPDATE products SET
          name = ?, description = ?, price = ?, original_price = ?, 
          stock = ?, category_id = ?, brand = ?, weight = ?, 
          dimensions = ?, is_featured = ?, is_flash_sale = ?,
          flash_sale_price = ?, flash_sale_start = ?, flash_sale_end = ?,
          updated_at = NOW()
        WHERE id = ?
      `, [
        name, description, price, original_price, stock, category_id,
        brand, weight, dimensions, is_featured, is_flash_sale,
        flash_sale_price, flash_sale_start, flash_sale_end, id
      ]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Delete product
  static async delete(id) {
    try {
      const [result] = await pool.execute(`
        UPDATE products SET is_active = 0 WHERE id = ?
      `, [id]);
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Admin: Get all products for management
  static async getAllForAdmin(page = 1, limit = 20, filters = {}) {
    try {
      const offset = (page - 1) * limit;
      let query = `
        SELECT p.*, c.name as category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 1=1
      `;
      let params = [];
      
      if (filters.search) {
        query += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }
      
      if (filters.category_id) {
        query += ' AND p.category_id = ?';
        params.push(filters.category_id);
      }
      
      if (filters.is_active !== undefined) {
        query += ' AND p.is_active = ?';
        params.push(filters.is_active);
      }
      
      query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      const [rows] = await pool.execute(query, params);
      
      // Get total count
      let countQuery = `
        SELECT COUNT(*) as total 
        FROM products p 
        WHERE 1=1
      `;
      let countParams = [];
      
      if (filters.search) {
        countQuery += ' AND (p.name LIKE ? OR p.sku LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        countParams.push(searchTerm, searchTerm);
      }
      
      if (filters.category_id) {
        countQuery += ' AND p.category_id = ?';
        countParams.push(filters.category_id);
      }
      
      if (filters.is_active !== undefined) {
        countQuery += ' AND p.is_active = ?';
        countParams.push(filters.is_active);
      }
      
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;
      
      return {
        products: rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
