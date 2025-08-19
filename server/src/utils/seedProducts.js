const { pool } = require('../config/database');

const sampleProducts = [
	{ name: 'Bộ ấm chén gốm sứ', description: 'Phong cách tối giản', price: 350000, original_price: 420000, stock: 40, category_id: 3, brand: 'GomsuVN', is_featured: 1 },
	{ name: 'Tai nghe Bluetooth 5.3', description: 'Chống ồn chủ động', price: 690000, original_price: 990000, stock: 120, category_id: 1, brand: 'SoundPro', is_featured: 1 },
	{ name: 'Áo khoác chống nắng', description: 'Vải mát, co giãn', price: 159000, original_price: 199000, stock: 300, category_id: 2, brand: 'UVShield', is_featured: 0 },
	{ name: 'Chuột không dây', description: 'Pin 12 tháng', price: 129000, original_price: 199000, stock: 200, category_id: 1, brand: 'Clicky', is_featured: 0 },
	{ name: 'Bình giữ nhiệt 500ml', description: 'Giữ nóng 6h', price: 99000, original_price: 149000, stock: 150, category_id: 3, brand: 'ThermoVN', is_featured: 0 },
];

async function seed() {
	const conn = await pool.getConnection();
	try {
		await conn.beginTransaction();
		for (const p of sampleProducts) {
			const [res] = await conn.execute(
				`INSERT INTO products (name, description, price, original_price, stock, category_id, brand, is_featured)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
				[p.name, p.description, p.price, p.original_price, p.stock, p.category_id, p.brand, p.is_featured]
			);
			const productId = res.insertId;
			// Insert one primary image for some, leave some without to use default
			if (productId % 2 === 1) {
				await conn.execute(
					`INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, 1)`,
					[productId, '/uploads/products/default.svg']
				);
			}
		}
		await conn.commit();
		console.log('Seeded products successfully');
	} catch (e) {
		await conn.rollback();
		console.error('Seed failed:', e.message);
		process.exitCode = 1;
	} finally {
		conn.release();
		process.exit();
	}
}

seed();


