/*
  Quick DB validator for MuaSamViet
  - Prints columns for key tables
  - Prints sample products and integrity checks
*/
const { pool } = require('../config/database');

async function main() {
  const dbName = process.env.DB_NAME || 'muasamviet_db';
  const tables = ['products', 'product_images', 'categories', 'users', 'orders', 'order_items'];
  const placeholders = tables.map(() => '?').join(',');

  const result = {
    db: dbName,
    columns: {},
    counts: {},
    integrity: {},
    sample: {},
  };

  const conn = await pool.getConnection();
  try {
    // Columns for key tables
    const [cols] = await conn.execute(
      `SELECT TABLE_NAME,COLUMN_NAME,DATA_TYPE,IS_NULLABLE,COLUMN_DEFAULT,EXTRA 
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME IN (${placeholders})
       ORDER BY TABLE_NAME, ORDINAL_POSITION`,
      [dbName, ...tables]
    );
    for (const row of cols) {
      if (!result.columns[row.TABLE_NAME]) result.columns[row.TABLE_NAME] = [];
      result.columns[row.TABLE_NAME].push({
        column: row.COLUMN_NAME,
        type: row.DATA_TYPE,
        nullable: row.IS_NULLABLE,
        default: row.COLUMN_DEFAULT,
        extra: row.EXTRA,
      });
    }

    // Counts
    const [[{ c: prodCount }]] = await conn.execute('SELECT COUNT(*) c FROM products');
    const [[{ c: imgCount }]] = await conn.execute('SELECT COUNT(*) c FROM product_images');
    const [[{ c: catCount }]] = await conn.execute('SELECT COUNT(*) c FROM categories');
    result.counts = { products: prodCount, product_images: imgCount, categories: catCount };

    // Integrity: orphan images
    const [orphans] = await conn.execute(`
      SELECT pi.id, pi.product_id 
      FROM product_images pi 
      LEFT JOIN products p ON p.id = pi.product_id 
      WHERE p.id IS NULL 
      LIMIT 5`);
    result.integrity.orphan_images = orphans.length;

    // Integrity: products with missing category
    const [badCats] = await conn.execute(`
      SELECT p.id, p.name, p.category_id 
      FROM products p 
      LEFT JOIN categories c ON c.id = p.category_id 
      WHERE c.id IS NULL 
      LIMIT 5`);
    result.integrity.products_missing_category = badCats.length;

    // Integrity: products with NULL/invalid price
    const [[{ c: badPrice }]] = await conn.execute('SELECT COUNT(*) c FROM products WHERE price IS NULL OR price < 0');
    result.integrity.invalid_price = badPrice;

    // Featured / Flash-sale distribution
    const [[{ c: featured }]] = await conn.execute('SELECT COUNT(*) c FROM products WHERE is_featured = 1 AND is_active = 1');
    const [[{ c: flash }]] = await conn.execute('SELECT COUNT(*) c FROM products WHERE is_flash_sale = 1 AND is_active = 1');
    result.counts.featured_active = featured;
    result.counts.flash_active = flash;

    // Sample 5 products with resolved primary_image (mimic backend select)
    const [sample] = await conn.execute(`
      SELECT p.id, p.name, p.price, p.original_price, p.stock, p.category_id, p.brand,
             COALESCE((SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1), '/uploads/products/default.svg') AS primary_image
      FROM products p
      WHERE p.is_active = 1
      ORDER BY p.id DESC
      LIMIT 5`);
    result.sample.products = sample;

    console.log(JSON.stringify(result, null, 2));
  } catch (e) {
    console.error('DB check failed:', e);
    process.exitCode = 1;
  } finally {
    conn.release();
    process.exit();
  }
}

main();


