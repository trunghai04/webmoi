-- MuaSamViet Complete Database Schema (Fixed)
-- Drop database if exists and create new one
DROP DATABASE IF EXISTS muasamviet_db;
CREATE DATABASE muasamviet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE muasamviet_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    address TEXT,
    avatar VARCHAR(255) DEFAULT '/uploads/avatars/default-avatar.svg',
    role ENUM('user', 'admin', 'moderator', 'partner') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    reset_token VARCHAR(255),
    reset_token_expires DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_phone (phone)
);

-- Categories table
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    parent_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active)
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percent INT DEFAULT 0,
    stock INT DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    category_id INT NOT NULL,
    brand VARCHAR(100),
    weight DECIMAL(8,2),
    dimensions VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    flash_sale_price DECIMAL(10,2),
    flash_sale_start DATETIME,
    flash_sale_end DATETIME,
    views INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured),
    INDEX idx_is_flash_sale (is_flash_sale),
    INDEX idx_price (price),
    INDEX idx_rating (rating)
);

-- Product images table
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary)
);

-- Product reviews table
CREATE TABLE product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating)
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_fee DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('cod', 'bank_transfer', 'credit_card', 'vnpay', 'momo') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    shipping_address JSON NOT NULL,
    billing_address JSON,
    notes TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- Order items table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_image VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
);

-- Cart table
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
    INDEX idx_user_id (user_id)
);

-- Wishlist table
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id),
    INDEX idx_user_id (user_id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('order', 'promotion', 'system', 'chat') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Chat messages table
CREATE TABLE chat_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file') DEFAULT 'text',
    file_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_sender_id (sender_id),
    INDEX idx_receiver_id (receiver_id),
    INDEX idx_is_read (is_read),
    INDEX idx_created_at (created_at)
);

-- Feedback table
CREATE TABLE feedback (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    category ENUM('general', 'product', 'service', 'website', 'delivery', 'payment', 'other') NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    attachments JSON,
    status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Payment methods table
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active)
);

-- User addresses table
CREATE TABLE user_addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    district VARCHAR(100),
    ward VARCHAR(100),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default)
);

-- Flash sale events table
CREATE TABLE flash_sale_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_start_time (start_time),
    INDEX idx_end_time (end_time),
    INDEX idx_is_active (is_active)
);

-- Flash sale products table
CREATE TABLE flash_sale_products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    flash_sale_id INT NOT NULL,
    product_id INT NOT NULL,
    flash_sale_price DECIMAL(10,2) NOT NULL,
    quantity_limit INT,
    sold_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (flash_sale_id) REFERENCES flash_sale_events(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_flash_sale_product (flash_sale_id, product_id),
    INDEX idx_flash_sale_id (flash_sale_id),
    INDEX idx_product_id (product_id)
);

-- Insert default data

-- Categories
INSERT INTO categories (name, description, sort_order) VALUES
('Điện tử', 'Các sản phẩm điện tử công nghệ', 1),
('Thời trang', 'Quần áo, giày dép, phụ kiện', 2),
('Nhà cửa & Đời sống', 'Đồ gia dụng, nội thất, trang trí', 3),
('Sách & Văn phòng phẩm', 'Sách vở, dụng cụ học tập', 4),
('Thể thao & Dã ngoại', 'Dụng cụ thể thao, đồ dã ngoại', 5),
('Làm đẹp', 'Mỹ phẩm, chăm sóc cá nhân', 6),
('Mẹ & Bé', 'Đồ dùng cho mẹ và bé', 7),
('Ô tô & Xe máy', 'Phụ tùng, phụ kiện xe', 8);

-- Sub-categories
INSERT INTO categories (name, description, parent_id, sort_order) VALUES
('Điện thoại', 'Điện thoại di động', 1, 1),
('Laptop', 'Máy tính xách tay', 1, 2),
('Máy tính bảng', 'iPad, Samsung Tab', 1, 3),
('Phụ kiện điện tử', 'Tai nghe, sạc, ốp lưng', 1, 4),
('Áo nam', 'Áo thun, áo sơ mi nam', 2, 1),
('Áo nữ', 'Áo thun, áo sơ mi nữ', 2, 2),
('Quần nam', 'Quần jean, quần tây nam', 2, 3),
('Quần nữ', 'Quần jean, quần tây nữ', 2, 4),
('Giày nam', 'Giày thể thao, giày công sở nam', 2, 5),
('Giày nữ', 'Giày thể thao, giày cao gót nữ', 2, 6);

-- Payment methods
INSERT INTO payment_methods (name, description, is_active, sort_order) VALUES
('Tiền mặt khi nhận hàng', 'Thanh toán khi nhận hàng (COD)', TRUE, 1),
('Chuyển khoản ngân hàng', 'Chuyển khoản qua ngân hàng', TRUE, 2),
('Thẻ tín dụng/ghi nợ', 'Thanh toán qua thẻ Visa/Mastercard', TRUE, 3),
('VNPay', 'Thanh toán qua VNPay', TRUE, 4),
('MoMo', 'Thanh toán qua ví MoMo', TRUE, 5),
('ZaloPay', 'Thanh toán qua ZaloPay', TRUE, 6);

-- Sample products
INSERT INTO products (name, description, price, original_price, stock, category_id, brand, is_featured, rating, total_reviews) VALUES
-- Electronics
('iPhone 15 Pro Max 256GB', 'Điện thoại iPhone 15 Pro Max 256GB - Titan tự nhiên, chip A17 Pro, camera 48MP', 29990000, 32990000, 50, 9, 'Apple', TRUE, 4.8, 125),
('Samsung Galaxy S24 Ultra', 'Điện thoại Samsung Galaxy S24 Ultra 256GB - Titanium Gray, S Pen tích hợp', 28990000, 31990000, 30, 9, 'Samsung', TRUE, 4.7, 89),
('MacBook Pro M3 14"', 'Laptop MacBook Pro 14 inch M3 512GB - Space Gray, chip M3 mạnh mẽ', 45990000, 49990000, 20, 10, 'Apple', TRUE, 4.9, 67),
('iPad Pro 12.9" M2', 'Máy tính bảng iPad Pro 12.9 inch M2 128GB - Space Gray', 25990000, 28990000, 25, 11, 'Apple', FALSE, 4.6, 45),
('AirPods Pro 2', 'Tai nghe không dây AirPods Pro 2 - Chống ồn chủ động', 5990000, 6990000, 100, 12, 'Apple', FALSE, 4.5, 234),

-- Fashion
('Áo thun nam cotton', 'Áo thun nam cotton 100% - Nhiều màu sắc, form regular', 199000, 299000, 200, 13, 'Nike', FALSE, 4.3, 156),
('Áo sơ mi nam công sở', 'Áo sơ mi nam công sở - Vải cotton cao cấp, form slim', 399000, 499000, 150, 13, 'Uniqlo', FALSE, 4.4, 89),
('Áo thun nữ basic', 'Áo thun nữ basic - Cotton mềm mại, nhiều màu', 159000, 259000, 180, 14, 'H&M', FALSE, 4.2, 134),
('Quần jean nam slim', 'Quần jean nam slim fit - Vải denim cao cấp', 599000, 799000, 120, 15, 'Levi\'s', FALSE, 4.1, 78),
('Quần jean nữ skinny', 'Quần jean nữ skinny fit - Co giãn tốt', 499000, 699000, 100, 16, 'Zara', FALSE, 4.0, 92),
('Giày thể thao nam', 'Giày thể thao nam - Đế cao su, lót êm', 899000, 1299000, 80, 17, 'Adidas', FALSE, 4.6, 167),
('Giày cao gót nữ', 'Giày cao gót nữ 7cm - Da thật, đế chắc', 699000, 999000, 60, 18, 'Charles & Keith', FALSE, 4.3, 89),

-- Home & Living
('Bộ chăn ga gối', 'Bộ chăn ga gối cotton 100% - Họa tiết hoa', 899000, 1199000, 50, 3, 'Everon', FALSE, 4.4, 67),
('Nồi cơm điện', 'Nồi cơm điện 1.8L - Nấu cơm ngon, tiết kiệm điện', 599000, 799000, 40, 3, 'Panasonic', FALSE, 4.5, 45),
('Máy hút bụi', 'Máy hút bụi không dây - Pin lithium, lực hút mạnh', 2999000, 3999000, 30, 3, 'Dyson', FALSE, 4.7, 34),

-- Books & Stationery
('Sách "Đắc Nhân Tâm"', 'Sách "Đắc Nhân Tâm" - Dale Carnegie, bản dịch tiếng Việt', 89000, 129000, 200, 4, 'NXB Tổng hợp', FALSE, 4.8, 456),
('Bộ bút bi 12 màu', 'Bộ bút bi 12 màu - Mực đậm, viết mượt', 99000, 149000, 300, 4, 'Bến Nghé', FALSE, 4.2, 234),

-- Sports & Outdoor
('Bóng đá size 5', 'Bóng đá size 5 - Da PU, độ nảy tốt', 299000, 399000, 80, 5, 'Nike', FALSE, 4.3, 123),
('Vợt cầu lông', 'Vợt cầu lông carbon - Cán cầm êm, lưới chắc', 899000, 1199000, 60, 5, 'Yonex', FALSE, 4.6, 78),

-- Beauty
('Kem dưỡng ẩm', 'Kem dưỡng ẩm cho da khô - Thành phần tự nhiên', 299000, 399000, 150, 6, 'Innisfree', FALSE, 4.4, 189),
('Son môi matte', 'Son môi matte lâu trôi - 12 màu hot', 199000, 299000, 200, 6, '3CE', FALSE, 4.5, 267);

-- Product images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES
-- iPhone 15 Pro Max
(1, '/uploads/products/iphone-15-pro-max-1.jpg', TRUE),
(1, '/uploads/products/iphone-15-pro-max-2.jpg', FALSE),
(1, '/uploads/products/iphone-15-pro-max-3.jpg', FALSE),
-- Samsung S24 Ultra
(2, '/uploads/products/samsung-s24-ultra-1.jpg', TRUE),
(2, '/uploads/products/samsung-s24-ultra-2.jpg', FALSE),
-- MacBook Pro
(3, '/uploads/products/macbook-pro-m3-1.jpg', TRUE),
(3, '/uploads/products/macbook-pro-m3-2.jpg', FALSE),
-- iPad Pro
(4, '/uploads/products/ipad-pro-1.jpg', TRUE),
-- AirPods Pro
(5, '/uploads/products/airpods-pro-1.jpg', TRUE),
-- Fashion items
(6, '/uploads/products/ao-thun-nam-1.jpg', TRUE),
(7, '/uploads/products/ao-so-mi-nam-1.jpg', TRUE),
(8, '/uploads/products/ao-thun-nu-1.jpg', TRUE),
(9, '/uploads/products/quan-jean-nam-1.jpg', TRUE),
(10, '/uploads/products/quan-jean-nu-1.jpg', TRUE),
(11, '/uploads/products/giay-the-thao-nam-1.jpg', TRUE),
(12, '/uploads/products/giay-cao-got-nu-1.jpg', TRUE),
-- Home items
(13, '/uploads/products/chan-ga-goi-1.jpg', TRUE),
(14, '/uploads/products/noi-com-dien-1.jpg', TRUE),
(15, '/uploads/products/may-hut-bui-1.jpg', TRUE),
-- Books
(16, '/uploads/products/sach-dac-nhan-tam-1.jpg', TRUE),
(17, '/uploads/products/bo-but-bi-1.jpg', TRUE),
-- Sports
(18, '/uploads/products/bong-da-1.jpg', TRUE),
(19, '/uploads/products/vot-cau-long-1.jpg', TRUE),
-- Beauty
(20, '/uploads/products/kem-duong-am-1.jpg', TRUE),
(21, '/uploads/products/son-moi-1.jpg', TRUE);

-- Flash sale events
INSERT INTO flash_sale_events (name, description, start_time, end_time) VALUES
('Flash Sale Thứ 4', 'Giảm giá sốc các sản phẩm điện tử', '2024-01-24 20:00:00', '2024-01-24 23:59:59'),
('Flash Sale Cuối Tuần', 'Sale lớn cuối tuần - Giảm đến 50%', '2024-01-27 09:00:00', '2024-01-28 23:59:59');

-- Flash sale products
INSERT INTO flash_sale_products (flash_sale_id, product_id, flash_sale_price, quantity_limit) VALUES
(1, 1, 27990000, 20),
(1, 2, 25990000, 15),
(1, 5, 4990000, 50),
(2, 6, 149000, 100),
(2, 8, 119000, 80),
(2, 11, 699000, 40);

-- Create admin user (password: admin123)
INSERT INTO users (username, email, phone, password, full_name, role) VALUES
('admin', 'admin@muasamviet.com', '0123456789', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', 'Administrator', 'admin');

-- Create sample user (password: user123)
INSERT INTO users (username, email, phone, password, full_name, birth_date, address) VALUES
('ngtrunghi927', 'ngtrunghi927@gmail.com', '0123456789', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', 'Nguyễn Trung Nghĩa', '1995-06-15', '123 Đường ABC, Quận 1, TP.HCM');

-- Create sample partner (password: partner123)
INSERT INTO users (username, email, phone, password, full_name, role, address) VALUES
('partner1', 'partner1@muasamviet.com', '0987654321', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', 'Công ty TNHH ABC', 'partner', '456 Đường XYZ, Quận 2, TP.HCM');

-- Sample notifications
INSERT INTO notifications (user_id, title, message, type, is_read) VALUES
(1, 'Đơn hàng đã được xác nhận', 'Đơn hàng #MSV001 của bạn đã được xác nhận và đang được xử lý', 'order', FALSE),
(1, 'Flash Sale sắp bắt đầu', 'Flash Sale Thứ 4 sẽ bắt đầu lúc 20:00 hôm nay. Đừng bỏ lỡ!', 'promotion', FALSE),
(1, 'Sản phẩm yêu thích giảm giá', 'iPhone 15 Pro Max trong danh sách yêu thích của bạn đã giảm giá 15%', 'promotion', TRUE);

-- Sample feedback
INSERT INTO feedback (user_id, name, email, phone, category, rating, subject, message) VALUES
(1, 'Nguyễn Văn A', 'nguyenvana@email.com', '0123456789', 'service', 5, 'Dịch vụ giao hàng tuyệt vời', 'Giao hàng nhanh, nhân viên thân thiện, sản phẩm chất lượng tốt'),
(NULL, 'Trần Thị B', 'tranthib@email.com', '0987654321', 'product', 4, 'Sản phẩm tốt nhưng giá hơi cao', 'Sản phẩm chất lượng tốt nhưng giá có thể giảm thêm một chút'),
(1, 'Lê Văn C', 'levanc@email.com', '0369852147', 'website', 5, 'Website dễ sử dụng', 'Giao diện đẹp, dễ tìm kiếm sản phẩm, thanh toán thuận tiện');

-- Sample user addresses
INSERT INTO user_addresses (user_id, full_name, phone, address, city, district, ward, is_default) VALUES
(2, 'Nguyễn Trung Nghĩa', '0123456789', '123 Đường ABC, Phường 1', 'TP.HCM', 'Quận 1', 'Phường 1', TRUE),
(2, 'Nguyễn Trung Nghĩa', '0123456789', '456 Đường XYZ, Phường 2', 'TP.HCM', 'Quận 2', 'Phường 2', FALSE);

-- Sample cart items
INSERT INTO cart (user_id, product_id, quantity) VALUES
(2, 1, 1),
(2, 6, 2),
(2, 11, 1);

-- Sample wishlist
INSERT INTO wishlist (user_id, product_id) VALUES
(2, 3),
(2, 5),
(2, 13);

-- Sample chat messages
INSERT INTO chat_messages (sender_id, receiver_id, message, is_read) VALUES
(2, 1, 'Xin chào! Tôi cần hỗ trợ về sản phẩm iPhone 15 Pro Max', FALSE),
(1, 2, 'Chào bạn! Tôi có thể giúp gì cho bạn về sản phẩm này?', TRUE),
(2, 1, 'Sản phẩm có bảo hành bao lâu?', FALSE);

-- Update product ratings based on reviews
UPDATE products p 
SET rating = (
    SELECT AVG(rating) 
    FROM product_reviews pr 
    WHERE pr.product_id = p.id
),
total_reviews = (
    SELECT COUNT(*) 
    FROM product_reviews pr 
    WHERE pr.product_id = p.id
)
WHERE EXISTS (SELECT 1 FROM product_reviews pr WHERE pr.product_id = p.id);
