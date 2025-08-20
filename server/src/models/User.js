const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create(userData) {
    try {
      const { username, email, phone, password, full_name, birth_date, address } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const [result] = await db.pool.execute(
        `INSERT INTO users (username, email, phone, password, full_name, birth_date, address, role, is_active, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, 'user', 1, NOW())`,
        [username, email, phone, hashedPassword, full_name, birth_date || null, address || null]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email or phone
  static async findByEmailOrPhone(emailOrPhone) {
    try {
      const [rows] = await db.pool.execute(
        `SELECT * FROM users 
         WHERE (LOWER(email) = LOWER(?) OR REPLACE(phone,' ','') = REPLACE(?, ' ', '')) 
           AND is_active = 1`,
        [emailOrPhone, emailOrPhone]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT id, username, email, phone, full_name, birth_date, address, role, avatar, created_at FROM users WHERE id = ? AND is_active = 1',
        [id]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [email]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM users WHERE username = ? AND is_active = 1',
        [username]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  static async updateProfile(id, updateData) {
    try {
      const { full_name, phone, birth_date, address } = updateData;
      
      // Convert undefined values to null for database
      const safeFullName = full_name || null;
      const safePhone = phone || null;
      const safeBirthDate = birth_date || null;
      const safeAddress = address || null;
      
      const [result] = await db.pool.execute(
        'UPDATE users SET full_name = ?, phone = ?, birth_date = ?, address = ?, updated_at = NOW() WHERE id = ?',
        [safeFullName, safePhone, safeBirthDate, safeAddress, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update user avatar
  static async updateAvatar(id, avatarPath) {
    try {
      const [result] = await db.pool.execute(
        'UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?',
        [avatarPath, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Change password
  static async changePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      const [result] = await db.pool.execute(
        'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
        [hashedPassword, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Create password reset token
  static async createPasswordResetToken(email, token, expiresAt) {
    try {
      const [result] = await db.pool.execute(
        'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
        [token, expiresAt, email]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Find user by reset token
  static async findByResetToken(token) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW() AND is_active = 1',
        [token]
      );
      
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  // Reset password with token
  static async resetPassword(token, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
      const [result] = await db.pool.execute(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE reset_token = ?',
        [hashedPassword, token]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.password);
  }

  // Get all users (admin only)
  static async getAll(page = 1, limit = 10, search = '', role = null) {
    try {
      console.log('User.getAll called with:', { page, limit, search, role });
      const offset = (page - 1) * limit;
      let query = 'SELECT id, username, email, phone, full_name, role, is_active, created_at, avatar FROM users WHERE 1=1';
      let params = [];
      
      if (search) {
        query += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (role) {
        query += ' AND role = ?';
        params.push(role);
      }
      
      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
      
      console.log('Executing query:', query);
      console.log('Query params:', params);
      const [rows] = await db.pool.execute(query, params);
      console.log('Query result rows:', rows);
      
      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
      let countParams = [];
      
      if (search) {
        countQuery += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }
      if (role) {
        countQuery += ' AND role = ?';
        countParams.push(role);
      }
      
      console.log('Executing count query:', countQuery);
      console.log('Count query params:', countParams);
      const [countResult] = await db.pool.execute(countQuery, countParams);
      const total = countResult[0].total;
      console.log('Total count:', total);
      
      const result = {
        users: rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
      console.log('Final result:', result);
      return result;
    } catch (error) {
      console.error('User.getAll error:', error);
      throw error;
    }
  }

  // Update user status (admin only)
  static async updateStatus(id, isActive) {
    try {
      const [result] = await db.pool.execute(
        'UPDATE users SET is_active = ?, updated_at = NOW() WHERE id = ?',
        [isActive ? 1 : 0, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Update user role (admin only)
  static async updateRole(id, role) {
    try {
      const [result] = await db.pool.execute(
        'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
        [role, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete user (admin only)
  static async delete(id) {
    try {
      const [result] = await db.pool.execute(
        'DELETE FROM users WHERE id = ?',
        [id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
