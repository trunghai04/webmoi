-- Simple chat test data
-- Run this in MySQL Workbench or phpMyAdmin

-- Check if tables exist
SELECT 'Checking tables...' as status;

-- Insert test users (simple version)
INSERT IGNORE INTO users (username, email, password, full_name, role, phone, address, created_at, updated_at) VALUES
('customer1', 'customer1@test.com', '$2b$10$test', 'Nguyễn Văn Khách', 'user', '0123456789', 'Hà Nội', NOW(), NOW()),
('partner1', 'partner1@test.com', '$2b$10$test', 'Lê Văn Bán', 'partner', '0111222333', 'Đà Nẵng', NOW(), NOW());

-- Get user IDs
SET @customer1_id = (SELECT id FROM users WHERE username = 'customer1' LIMIT 1);
SET @partner1_id = (SELECT id FROM users WHERE username = 'partner1' LIMIT 1);

-- Create chat room
INSERT IGNORE INTO chat_rooms (user_id, partner_id, room_type, status, created_at, updated_at) VALUES
(@customer1_id, @partner1_id, 'user_partner', 'active', NOW(), NOW());

-- Get room ID
SET @room1_id = (SELECT id FROM chat_rooms WHERE user_id = @customer1_id AND partner_id = @partner1_id LIMIT 1);

-- Insert test messages
INSERT INTO chat_messages (room_id, sender_id, content, message_type, created_at) VALUES
(@room1_id, @customer1_id, 'Chào shop! Tôi muốn hỏi về sản phẩm', 'text', NOW()),
(@room1_id, @partner1_id, 'Chào bạn! Shop có thể giúp gì?', 'text', NOW()),
(@room1_id, @customer1_id, 'Sản phẩm có còn hàng không?', 'text', NOW()),
(@room1_id, @partner1_id, 'Có bạn nhé! Shop còn đủ size', 'text', NOW());

-- Show results
SELECT 'Test data created successfully!' as result;
SELECT COUNT(*) as total_users FROM users WHERE username IN ('customer1', 'partner1');
SELECT COUNT(*) as total_rooms FROM chat_rooms WHERE user_id = @customer1_id OR partner_id = @partner1_id;
SELECT COUNT(*) as total_messages FROM chat_messages WHERE room_id = @room1_id;
