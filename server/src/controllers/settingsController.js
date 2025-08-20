const db = require('../config/database');

class SettingsController {
  // Get bank information
  static async getBankInfo(req, res) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM settings WHERE setting_key = "bank_info"'
      );
      
      let bankInfo = {
        bankName: 'Vietcombank',
        accountNumber: '1234567890',
        accountHolder: 'CONG TY MUA SAM VIET',
        bankBin: '970436'
      };

      if (rows.length > 0) {
        try {
          const parsed = JSON.parse(rows[0].setting_value);
          bankInfo = { ...bankInfo, ...parsed };
        } catch (error) {
          console.error('Error parsing bank info:', error);
        }
      }

      res.json({
        success: true,
        data: bankInfo
      });
    } catch (error) {
      console.error('Error getting bank info:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy thông tin ngân hàng'
      });
    }
  }

  // Update bank information
  static async updateBankInfo(req, res) {
    try {
      const { bankName, accountNumber, accountHolder, bankBin } = req.body;

      // Validate required fields
      if (!bankName || !accountNumber || !accountHolder) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng điền đầy đủ thông tin ngân hàng'
        });
      }

      const bankInfo = {
        bankName,
        accountNumber,
        accountHolder,
        bankBin: bankBin || '970436'
      };

      // Ensure settings table exists
      await db.pool.execute(`
        CREATE TABLE IF NOT EXISTS settings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          setting_key VARCHAR(100) UNIQUE NOT NULL,
          setting_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_setting_key (setting_key)
        )
      `);

      // Check if setting exists
      const [existing] = await db.pool.execute(
        'SELECT id FROM settings WHERE setting_key = "bank_info"'
      );

      if (existing.length > 0) {
        // Update existing setting
        await db.pool.execute(
          'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = "bank_info"',
          [JSON.stringify(bankInfo)]
        );
      } else {
        // Insert new setting
        await db.pool.execute(
          'INSERT INTO settings (setting_key, setting_value, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
          ['bank_info', JSON.stringify(bankInfo)]
        );
      }

      res.json({
        success: true,
        message: 'Cập nhật thông tin ngân hàng thành công',
        data: bankInfo
      });
    } catch (error) {
      console.error('Error updating bank info:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật thông tin ngân hàng'
      });
    }
  }

  // Get all settings
  static async getAllSettings(req, res) {
    try {
      const [rows] = await db.pool.execute(
        'SELECT * FROM settings ORDER BY setting_key'
      );
      
      const settings = {};
      rows.forEach(row => {
        try {
          settings[row.setting_key] = JSON.parse(row.setting_value);
        } catch (error) {
          settings[row.setting_key] = row.setting_value;
        }
      });

      res.json({
        success: true,
        data: settings
      });
    } catch (error) {
      console.error('Error getting settings:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy cài đặt hệ thống'
      });
    }
  }

  // Update settings
  static async updateSettings(req, res) {
    try {
      const settings = req.body;

      for (const [key, value] of Object.entries(settings)) {
        // Check if setting exists
        const [existing] = await db.pool.execute(
          'SELECT id FROM settings WHERE setting_key = ?',
          [key]
        );

        const settingValue = typeof value === 'object' ? JSON.stringify(value) : value;

        if (existing.length > 0) {
          // Update existing setting
          await db.pool.execute(
            'UPDATE settings SET setting_value = ?, updated_at = NOW() WHERE setting_key = ?',
            [settingValue, key]
          );
        } else {
          // Insert new setting
          await db.pool.execute(
            'INSERT INTO settings (setting_key, setting_value, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
            [key, settingValue]
          );
        }
      }

      res.json({
        success: true,
        message: 'Cập nhật cài đặt thành công'
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật cài đặt'
      });
    }
  }
}

module.exports = SettingsController;
