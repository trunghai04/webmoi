const { pool } = require('./src/config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, phone, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['testuser', 'testuser@example.com', hashedPassword, 'Test User', '0123456789', 'user', 1]
    );
    
    console.log('Test user created successfully!');
    console.log('Username: testuser');
    console.log('Password: 123456');
    console.log('Email: testuser@example.com');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    process.exit(0);
  }
}

createTestUser();
