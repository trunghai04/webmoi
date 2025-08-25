const { pool } = require('./src/config/database');

async function approvePartnerApplication() {
  try {
    // Get pending applications
    const [applications] = await pool.execute(
      'SELECT * FROM partner_applications WHERE status = "pending"'
    );

    if (applications.length === 0) {
      console.log('Không có đơn đăng ký nào đang chờ xử lý');
      return;
    }

    console.log(`Tìm thấy ${applications.length} đơn đăng ký đang chờ:`);
    applications.forEach((app, index) => {
      console.log(`${index + 1}. ${app.store_name} - ${app.user_id}`);
    });

    // For demo, approve the first application
    const application = applications[0];
    
    // Create partner store
    const [storeResult] = await pool.execute(
      `INSERT INTO partner_stores 
       (user_id, store_name, store_description, business_type, business_license, phone, address, city, district) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        application.user_id,
        application.store_name,
        application.store_description,
        application.business_type,
        application.business_license,
        application.phone,
        application.address,
        application.city,
        application.district
      ]
    );

    // Update application status
    await pool.execute(
      'UPDATE partner_applications SET status = "approved" WHERE id = ?',
      [application.id]
    );

    // Update user role to partner
    await pool.execute(
      'UPDATE users SET role = "partner", partner_id = ? WHERE id = ?',
      [storeResult.insertId, application.user_id]
    );

    console.log('✅ Đã approve đơn đăng ký thành công!');
    console.log(`Store ID: ${storeResult.insertId}`);
    console.log(`User ID: ${application.user_id}`);
    console.log(`Store Name: ${application.store_name}`);

  } catch (error) {
    console.error('Error approving partner application:', error);
  } finally {
    process.exit(0);
  }
}

approvePartnerApplication();
