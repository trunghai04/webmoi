const { pool } = require('./src/config/database');

async function createTestApplication() {
  try {
    // Create a test partner application for user ID 38
    const [result] = await pool.execute(
      `INSERT INTO partner_applications 
       (user_id, store_name, store_description, business_type, business_license, phone, address, city, district, documents) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        38, // user_id
        'Cửa hàng Test',
        'Cửa hàng bán đồ điện tử và thời trang',
        'individual',
        'GP123456789',
        '0123456789',
        '123 Đường ABC, Quận 1',
        'TP.HCM',
        'Quận 1',
        JSON.stringify({})
      ]
    );

    console.log('✅ Đã tạo đơn đăng ký test thành công!');
    console.log(`Application ID: ${result.insertId}`);
    console.log(`User ID: 38`);
    console.log(`Store Name: Cửa hàng Test`);

  } catch (error) {
    console.error('Error creating test application:', error);
  } finally {
    process.exit(0);
  }
}

createTestApplication();
