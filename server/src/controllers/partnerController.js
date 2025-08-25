const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// Submit partner application
const submitApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      store_name,
      store_description,
      business_type,
      business_license,
      phone,
      address,
      city,
      district,
      documents
    } = req.body;

    // Check if user already has an application
    const [existingApp] = await pool.execute(
      'SELECT * FROM partner_applications WHERE user_id = ?',
      [userId]
    );

    if (existingApp.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã có đơn đăng ký người bán'
      });
    }

    // Check if user already has a store
    const [existingStore] = await pool.execute(
      'SELECT * FROM partner_stores WHERE user_id = ?',
      [userId]
    );

    if (existingStore.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã là người bán'
      });
    }

    // Insert application
    const [result] = await pool.execute(
      `INSERT INTO partner_applications 
       (user_id, store_name, store_description, business_type, business_license, phone, address, city, district, documents) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, store_name, store_description, business_type, business_license, phone, address, city, district, JSON.stringify(documents)]
    );

    res.json({
      success: true,
      message: 'Đơn đăng ký người bán đã được gửi thành công',
      data: {
        application_id: result.insertId
      }
    });
  } catch (error) {
    console.error('Error submitting partner application:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Get user's partner application status
const getApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has a store
    const [storeResult] = await pool.execute(
      'SELECT * FROM partner_stores WHERE user_id = ?',
      [userId]
    );

    if (storeResult.length > 0) {
      return res.json({
        success: true,
        data: {
          status: 'approved',
          store: storeResult[0],
          message: 'Bạn đã là người bán'
        }
      });
    }

    // Check if user has an application
    const [appResult] = await pool.execute(
      'SELECT * FROM partner_applications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [userId]
    );

    if (appResult.length === 0) {
      return res.json({
        success: true,
        data: {
          status: 'not_applied',
          message: 'Bạn chưa đăng ký người bán'
        }
      });
    }

    const application = appResult[0];
    return res.json({
      success: true,
      data: {
        status: application.status,
        application: application,
        message: application.status === 'pending' ? 'Đơn đăng ký đang được xử lý' :
                 application.status === 'approved' ? 'Đơn đăng ký đã được chấp thuận' :
                 'Đơn đăng ký bị từ chối'
      }
    });
  } catch (error) {
    console.error('Error getting application status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Get partner store info
const getPartnerStore = async (req, res) => {
  try {
    const userId = req.user.id;

    const [storeResult] = await pool.execute(
      'SELECT * FROM partner_stores WHERE user_id = ?',
      [userId]
    );

    if (storeResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin cửa hàng'
      });
    }

    res.json({
      success: true,
      data: {
        store: storeResult[0]
      }
    });
  } catch (error) {
    console.error('Error getting partner store:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// Update partner store
const updatePartnerStore = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      store_name,
      store_description,
      phone,
      address,
      city,
      district
    } = req.body;

    const [result] = await pool.execute(
      `UPDATE partner_stores 
       SET store_name = ?, store_description = ?, phone = ?, address = ?, city = ?, district = ?, updated_at = NOW()
       WHERE user_id = ?`,
      [store_name, store_description, phone, address, city, district, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin cửa hàng'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin cửa hàng thành công'
    });
  } catch (error) {
    console.error('Error updating partner store:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  submitApplication,
  getApplicationStatus,
  getPartnerStore,
  updatePartnerStore
};
