const { pool } = require('./src/config/database');

async function updateUserRole() {
  try {
    // Update user with ID 38 (from the log) to have partner role
    const [result] = await pool.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      ['partner', 38]
    );
    
    if (result.affectedRows > 0) {
      console.log('User role updated successfully!');
      console.log('User ID: 38');
      console.log('New role: partner');
      console.log('Please log out and log in again to see the changes.');
    } else {
      console.log('User not found or no changes made.');
    }
  } catch (error) {
    console.error('Error updating user role:', error);
  } finally {
    process.exit(0);
  }
}

updateUserRole();
