-- =====================================================
-- MUASAMVIET DATABASE SCHEMA
-- =====================================================

DROP DATABASE IF EXISTS muasamviet;
CREATE DATABASE muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE muasamviet;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255),
  google_id VARCHAR(255) UNIQUE,
  facebook_id VARCHAR(255) UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  district VARCHAR(50),
  avatar VARCHAR(500) DEFAULT 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  role ENUM('user', 'admin', 'partner') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP NULL,
  notification_settings JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username),
  INDEX idx_role (role),
  INDEX idx_google_id (google_id),
  INDEX idx_facebook_id (facebook_id)
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  parent_id INT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_slug (slug),
  INDEX idx_parent_id (parent_id),
  INDEX idx_is_active (is_active)
);

-- =====================================================
-- PRODUCTS TABLE
-- =====================================================
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  stock_quantity INT NOT NULL DEFAULT 0,
  category_id INT NOT NULL,
  brand VARCHAR(100),
  sku VARCHAR(100) UNIQUE,
  images JSON,
  main_image VARCHAR(500),
  specifications JSON,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_slug (slug),
  INDEX idx_category_id (category_id),
  INDEX idx_price (price),
  INDEX idx_is_active (is_active),
  INDEX idx_is_featured (is_featured)
);

-- =====================================================
-- CART TABLE
-- =====================================================
CREATE TABLE cart (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
);

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('processing', 'shipping', 'delivered', 'cancelled') DEFAULT 'processing',
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method ENUM('cod', 'card', 'bank') NOT NULL,
  shipping_method ENUM('standard', 'express') DEFAULT 'standard',
  shipping_address JSON NOT NULL,
  tracking_number VARCHAR(100),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status)
);

-- =====================================================
-- ORDER_ITEMS TABLE
-- =====================================================
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image VARCHAR(500),
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

-- =====================================================
-- WISHLIST TABLE
-- =====================================================
CREATE TABLE wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_product (user_id, product_id),
  INDEX idx_user_id (user_id),
  INDEX idx_product_id (product_id)
);

-- =====================================================
-- REVIEWS TABLE
-- =====================================================
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  order_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  images JSON,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_product_order (user_id, product_id, order_id),
  INDEX idx_product_id (product_id),
  INDEX idx_rating (rating)
);

-- =====================================================
-- CHAT ROOMS TABLE
-- =====================================================
CREATE TABLE chat_rooms (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  partner_id INT,
  admin_id INT,
  room_type ENUM('user_partner', 'user_admin', 'support') DEFAULT 'user_partner',
  status ENUM('active', 'closed', 'archived') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (partner_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_partner_id (partner_id),
  INDEX idx_room_type (room_type),
  INDEX idx_status (status)
);

-- =====================================================
-- CHAT MESSAGES TABLE
-- =====================================================
CREATE TABLE chat_messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  room_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_type ENUM('text', 'image', 'file', 'notification') DEFAULT 'text',
  content TEXT NOT NULL,
  file_url VARCHAR(500),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_room_id (room_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_created_at (created_at)
);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('chat', 'order', 'system', 'promotion') DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_type (type),
  INDEX idx_is_read (is_read)
);

-- =====================================================
-- BANNERS TABLE
-- =====================================================
CREATE TABLE banners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  image_url VARCHAR(500) NOT NULL,
  link_url VARCHAR(500),
  sort_order INT DEFAULT 0,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active),
  INDEX idx_sort_order (sort_order)
);

-- =====================================================
-- SETTINGS TABLE
-- =====================================================
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
);

-- =====================================================
-- FEEDBACK TABLE
-- =====================================================
CREATE TABLE feedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- =====================================================
-- VOUCHERS TABLE
-- =====================================================
CREATE TABLE vouchers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(10,2) DEFAULT 0,
  max_discount DECIMAL(10,2),
  usage_limit INT,
  used_count INT DEFAULT 0,
  valid_from TIMESTAMP NOT NULL,
  valid_to TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_code (code),
  INDEX idx_is_active (is_active),
  INDEX idx_valid_from (valid_from),
  INDEX idx_valid_to (valid_to)
);

-- =====================================================
-- USER_VOUCHERS TABLE
-- =====================================================
CREATE TABLE user_vouchers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  voucher_id INT NOT NULL,
  used_at TIMESTAMP NULL,
  order_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  UNIQUE KEY unique_user_voucher (user_id, voucher_id),
  INDEX idx_user_id (user_id),
  INDEX idx_voucher_id (voucher_id)
);

-- =====================================================
-- COINS TABLE
-- =====================================================
CREATE TABLE coins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount INT NOT NULL DEFAULT 0,
  source ENUM('purchase', 'order', 'referral', 'admin') NOT NULL,
  description VARCHAR(255),
  order_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_source (source)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample users
INSERT INTO users (username, email, password, full_name, phone, address, city, district, role) VALUES
('admin', 'admin@muasamviet.com', '$2b$10$rQZ8K9mN2pL5vX7wY3hJ6tA1sB4cD8eF2gH5iJ7kL9mN3pQ6rS1tU4vW7xY0z', 'Admin MuaSamViet', '0123456789', '123 Đường ABC, Quận 1', 'hcm', 'district1', 'admin'),
('user1', 'user1@example.com', '$2b$10$rQZ8K9mN2pL5vX7wY3hJ6tA1sB4cD8eF2gH5iJ7kL9mN3pQ6rS1tU4vW7xY0z', 'Nguyễn Văn A', '0123456789', '123 Đường ABC, Quận 1, TP.HCM', 'hcm', 'district1', 'user'),
('user2', 'user2@example.com', '$2b$10$rQZ8K9mN2pL5vX7wY3hJ6tA1sB4cD8eF2gH5iJ7kL9mN3pQ6rS1tU4vW7xY0z', 'Trần Thị B', '0987654321', '456 Đường XYZ, Quận 2, TP.HCM', 'hcm', 'district2', 'user'),
('partner1', 'partner1@example.com', '$2b$10$rQZ8K9mN2pL5vX7wY3hJ6tA1sB4cD8eF2gH5iJ7kL9mN3pQ6rS1tU4vW7xY0z', 'Công ty ABC', '0909090909', '789 Đường DEF, Quận 3, TP.HCM', 'hcm', 'district3', 'partner');

-- Insert sample categories
INSERT INTO categories (name, slug, description, parent_id, sort_order) VALUES
('Điện thoại', 'dien-thoai', 'Các loại điện thoại di động', NULL, 1),
('Laptop', 'laptop', 'Máy tính xách tay', NULL, 2),
('Phụ kiện', 'phu-kien', 'Phụ kiện điện tử', NULL, 3),
('iPhone', 'iphone', 'Điện thoại iPhone', 1, 1),
('Samsung', 'samsung', 'Điện thoại Samsung', 1, 2),
('MacBook', 'macbook', 'Laptop Apple', 2, 1),
('Dell', 'dell', 'Laptop Dell', 2, 2),
('Tai nghe', 'tai-nghe', 'Tai nghe các loại', 3, 1);

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, original_price, category_id, stock_quantity, brand, sku, images, main_image, is_featured, rating, review_count) VALUES
('iPhone 15 Pro Max', 'iphone-15-pro-max', 'iPhone 15 Pro Max 256GB với chip A17 Pro, camera 48MP', 'iPhone 15 Pro Max 256GB', 29990000, 32990000, 4, 10, 'Apple', 'IP15PM256', '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"]', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', TRUE, 4.8, 25),
('MacBook Air M2', 'macbook-air-m2', 'MacBook Air M2 13 inch với chip M2 mạnh mẽ', 'MacBook Air M2 13 inch', 25990000, 27990000, 6, 5, 'Apple', 'MBA-M2-13', '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"]', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', TRUE, 4.9, 18),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Samsung Galaxy S24 Ultra 256GB với S Pen', 'Samsung Galaxy S24 Ultra 256GB', 27990000, 29990000, 5, 8, 'Samsung', 'SGS24U256', '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400"]', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', TRUE, 4.7, 22),
('AirPods Pro 2', 'airpods-pro-2', 'AirPods Pro 2 với Active Noise Cancellation', 'AirPods Pro 2', 5990000, 6990000, 8, 15, 'Apple', 'APP2', '["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400"]', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', FALSE, 4.6, 30);

-- Insert sample orders
INSERT INTO orders (user_id, order_number, status, subtotal, shipping_fee, tax, total, payment_method, shipping_method, shipping_address) VALUES
(2, 'ORD001', 'delivered', 29990000, 30000, 2999000, 33289000, 'cod', 'standard', '{"fullName": "Nguyễn Văn A", "phone": "0123456789", "email": "user1@example.com", "address": "123 Đường ABC, Quận 1, TP.HCM", "city": "hcm", "district": "district1"}'),
(2, 'ORD002', 'shipping', 25990000, 50000, 2599000, 28639000, 'card', 'express', '{"fullName": "Nguyễn Văn A", "phone": "0123456789", "email": "user1@example.com", "address": "123 Đường ABC, Quận 1, TP.HCM", "city": "hcm", "district": "district1"}'),
(3, 'ORD003', 'processing', 5990000, 30000, 599000, 6619000, 'bank', 'standard', '{"fullName": "Trần Thị B", "phone": "0987654321", "email": "user2@example.com", "address": "456 Đường XYZ, Quận 2, TP.HCM", "city": "hcm", "district": "district2"}');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, product_image, price, quantity, total) VALUES
(1, 1, 'iPhone 15 Pro Max', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 29990000, 1, 29990000),
(2, 2, 'MacBook Air M2', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 25990000, 1, 25990000),
(3, 4, 'AirPods Pro 2', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400', 5990000, 1, 5990000);

-- Insert sample wishlist data
INSERT INTO wishlist (user_id, product_id) VALUES
(2, 1),
(2, 2),
(2, 4),
(3, 3);

-- Insert sample reviews
INSERT INTO reviews (user_id, product_id, order_id, rating, title, comment) VALUES
(2, 1, 1, 5, 'Sản phẩm tuyệt vời', 'iPhone 15 Pro Max rất đẹp và mượt mà, camera chất lượng cao'),
(2, 2, 2, 5, 'MacBook Air M2 xuất sắc', 'Hiệu năng mạnh mẽ, pin trâu, thiết kế đẹp'),
(3, 4, 3, 4, 'AirPods Pro 2 chất lượng', 'Âm thanh tốt, ANC hiệu quả');

-- Insert sample banners
INSERT INTO banners (title, image_url, link_url, sort_order) VALUES
('Flash Sale iPhone 15', 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200', '/flash-sale', 1),
('MacBook Air M2 Giảm Giá', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200', '/products/macbook-air-m2', 2),
('Phụ Kiện Chính Hãng', 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200', '/categories/phu-kien', 3);

-- Insert sample settings
INSERT INTO settings (setting_key, setting_value) VALUES 
('bank_info', '{"bankName":"Vietcombank","accountNumber":"1234567890","accountHolder":"CONG TY MUA SAM VIET","bankBin":"970436"}'),
('site_info', '{"name":"MuaSamViet","description":"Cửa hàng điện tử trực tuyến","email":"contact@muasamviet.com","phone":"1900-1234"}'),
('shipping_fee', '{"standard":30000,"express":50000,"free_threshold":500000}'),
('tax_rate', '10');

-- Insert sample vouchers
INSERT INTO vouchers (code, name, description, discount_type, discount_value, min_order_value, max_discount, usage_limit, valid_from, valid_to) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'Giảm 10% cho đơn hàng đầu tiên', 'percentage', 10, 500000, 1000000, 100, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('FREESHIP', 'Miễn phí vận chuyển', 'Miễn phí vận chuyển cho đơn hàng từ 500k', 'fixed', 30000, 500000, 30000, 50, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY));

-- Insert sample user vouchers
INSERT INTO user_vouchers (user_id, voucher_id) VALUES
(2, 1),
(2, 2),
(3, 1);

-- Insert sample coins
INSERT INTO coins (user_id, amount, source, description, order_id) VALUES
(2, 1000, 'order', 'Tích điểm từ đơn hàng ORD001', 1),
(2, 500, 'order', 'Tích điểm từ đơn hàng ORD002', 2);

-- Insert sample chat rooms
INSERT INTO chat_rooms (user_id, partner_id, room_type) VALUES
(2, 4, 'user_partner'),
(3, 4, 'user_partner');

-- Insert sample chat messages
INSERT INTO chat_messages (room_id, sender_id, content, message_type) VALUES
(1, 2, 'Xin chào, tôi muốn hỏi về sản phẩm iPhone 15 Pro Max', 'text'),
(1, 4, 'Chào bạn, iPhone 15 Pro Max hiện có sẵn hàng và đang giảm giá 10%', 'text'),
(2, 3, 'Tôi có câu hỏi về MacBook Air M2', 'text'),
(2, 4, 'Chào bạn, MacBook Air M2 có chip M2 mạnh mẽ và pin trâu', 'text');

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, content) VALUES
(2, 'order', 'Đơn hàng ORD001 đã giao thành công', 'Đơn hàng iPhone 15 Pro Max của bạn đã được giao thành công'),
(2, 'promotion', 'Flash Sale iPhone 15', 'Giảm giá 20% cho iPhone 15 series'),
(3, 'system', 'Cập nhật hệ thống', 'Hệ thống sẽ bảo trì từ 2h-4h sáng ngày mai');

-- Insert sample feedback
INSERT INTO feedback (user_id, name, email, phone, subject, message, status, priority) VALUES
(2, 'Nguyễn Văn A', 'user1@example.com', '0123456789', 'Góp ý về dịch vụ', 'Dịch vụ giao hàng rất nhanh và chuyên nghiệp', 'resolved', 'low'),
(3, 'Trần Thị B', 'user2@example.com', '0987654321', 'Khiếu nại sản phẩm', 'Sản phẩm bị lỗi khi nhận hàng', 'in_progress', 'high'),
(NULL, 'Khách hàng', 'guest@example.com', '0909090909', 'Tư vấn mua hàng', 'Tôi muốn tư vấn về laptop gaming', 'pending', 'medium');

-- Update orders with tracking numbers
UPDATE orders SET 
  tracking_number = 'TRK123456789',
  updated_at = DATE_SUB(NOW(), INTERVAL 3 DAY)
WHERE id = 1;

UPDATE orders SET 
  tracking_number = 'TRK987654321',
  updated_at = DATE_SUB(NOW(), INTERVAL 1 DAY)
WHERE id = 2;

-- =====================================================
-- CREATE VIEWS
-- =====================================================

-- View for product details with category info
CREATE VIEW product_details AS
SELECT 
  p.*,
  c.name as category_name,
  c.slug as category_slug,
  pc.name as parent_category_name
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN categories pc ON c.parent_id = pc.id
WHERE p.is_active = TRUE;

-- View for order summary
CREATE VIEW order_summary AS
SELECT 
  o.*,
  u.full_name as customer_name,
  u.email as customer_email,
  u.phone as customer_phone,
  COUNT(oi.id) as total_items
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id;

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
  u.id,
  u.username,
  u.full_name,
  u.email,
  COUNT(DISTINCT o.id) as total_orders,
  SUM(o.total) as total_spent,
  COUNT(DISTINCT w.product_id) as wishlist_items,
  COUNT(DISTINCT r.id) as total_reviews,
  AVG(r.rating) as avg_rating
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
LEFT JOIN wishlist w ON u.id = w.user_id
LEFT JOIN reviews r ON u.id = r.user_id
WHERE u.role = 'user'
GROUP BY u.id;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Composite indexes for better query performance
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_reviews_product_rating ON reviews(product_id, rating);
CREATE INDEX idx_chat_messages_room_time ON chat_messages(room_id, created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- =====================================================
-- PARTNER/SELLER TABLES
-- =====================================================

-- Partner applications table (seller registration workflow)
CREATE TABLE partner_applications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_description TEXT,
  business_type ENUM('individual', 'company') NOT NULL,
  business_license VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  documents JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status)
);

-- Partner stores table (approved sellers)
CREATE TABLE partner_stores (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  store_name VARCHAR(255) NOT NULL,
  store_description TEXT,
  store_logo VARCHAR(255),
  store_banner VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  business_type ENUM('individual', 'company') NOT NULL,
  business_license VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_store (user_id),
  INDEX idx_user_id (user_id),
  INDEX idx_is_active (is_active)
);

-- Link users to partner store (nullable)
ALTER TABLE users ADD COLUMN partner_id INT NULL;
ALTER TABLE users ADD CONSTRAINT fk_user_partner FOREIGN KEY (partner_id) REFERENCES partner_stores(id) ON DELETE SET NULL;

-- =====================================================
-- FINAL COMMENTS
-- =====================================================
/*
Database Schema for MuaSamViet E-commerce Platform

This database includes:

1. Core Tables:
   - users: User management with roles (user, admin, partner)
   - categories: Product categories with hierarchical structure
   - products: Product catalog with detailed information
   - cart: Shopping cart functionality
   - orders: Order management
   - order_items: Order line items

2. User Experience Tables:
   - wishlist: User wishlists
   - reviews: Product reviews and ratings
   - notifications: User notifications
   - feedback: Customer feedback system

3. Communication Tables:
   - chat_rooms: Chat room management
   - chat_messages: Chat message storage

4. Business Tables:
   - banners: Promotional banners
   - settings: System settings
   - vouchers: Discount vouchers
   - user_vouchers: User voucher usage
   - coins: Loyalty points system

5. Performance Optimizations:
   - Views for common queries
   - Indexes for query optimization

6. Sample Data:
   - Users, categories, products
   - Orders, reviews, notifications
   - Chat messages, feedback
   - Vouchers and settings

The database is designed to support a full-featured e-commerce platform with user management, product catalog, shopping cart, order processing, customer support, and loyalty programs.
*/
