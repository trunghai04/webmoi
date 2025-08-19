const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function seedUsers(n = 20) {
  const conn = await pool.getConnection();
  try {
    const users = [];
    for (let i = 1; i <= n; i += 1) {
      const username = `user${i}`;
      const email = `user${i}@example.com`;
      const phone = `09${String(10000000 + i).slice(0,8)}`;
      const password = await bcrypt.hash('password123', 12);
      const full_name = `Người dùng ${i}`;
      const avatar = '/uploads/avatars/default-avatar.svg';
      users.push([username, email, phone, password, full_name, null, null, avatar]);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('DELETE FROM users WHERE role = "user"');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    await conn.query(
      `INSERT INTO users (username,email,phone,password,full_name,birth_date,address,avatar,role,is_active,created_at)
       VALUES ${users.map(()=> '(?,?,?,?,?,?,?,? ,"user",1,NOW())').join(',')}`,
      users.flat()
    );
    console.log(`Seeded ${n} users`);
  } finally { conn.release(); }
}

async function seedProducts(m = 50) {
  const conn = await pool.getConnection();
  try {
    const names = ['Điện thoại', 'Tai nghe', 'Laptop', 'Bình giữ nhiệt', 'Chuột không dây', 'Bàn phím'];
    const brands = ['Apple','Samsung','Xiaomi','SoundPro','Clicky','ThermoVN'];
    for (let i = 0; i < m; i += 1) {
      const name = `${names[i % names.length]} mẫu ${i+1}`;
      const price = rand(50000, 5000000);
      const original = price + rand(0, 500000);
      const stock = rand(0, 500);
      const cat = rand(1, 5);
      const brand = brands[i % brands.length];
      const is_featured = rand(0,1);
      const [res] = await conn.execute(
        `INSERT INTO products (name,description,price,original_price,stock,category_id,brand,is_active,is_featured,created_at)
         VALUES (?,?,?,?,?,?,?,?,?,NOW())`,
        [name, `${name} mô tả`, price, original, stock, cat, brand, 1, is_featured]
      );
      const pid = res.insertId;
      // add 0-3 images; ensure one primary occasionally
      const imgCount = rand(0,3);
      for (let k = 0; k < imgCount; k += 1) {
        const isPrimary = k === 0 ? 1 : 0;
        await conn.execute(
          `INSERT INTO product_images (product_id,image_url,alt_text,is_primary,sort_order)
           VALUES (?,?,?,?,?)`,
          [pid, '/uploads/products/default.svg', name, isPrimary, k]
        );
      }
    }
    console.log(`Seeded ${m} products`);
  } finally { conn.release(); }
}

async function main() {
  await seedUsers(30);
  await seedProducts(80);
  console.log('Bulk seed completed');
  process.exit();
}

main();


