const { pool } = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, phone, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['testpartner2', 'testpartner2@example.com', hashedPassword, 'Test Partner 2', '0987654321', 'partner', 1]
    );
    
    console.log('Test partner user created successfully!');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();
