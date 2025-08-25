-- Test data for chat between customers and partners
-- Run this script to set up test chat data

-- Insert test users (if not exists)
INSERT IGNORE INTO users (username, email, password, full_name, role, phone, address, created_at, updated_at) VALUES
('customer1', 'customer1@test.com', '$2b$10$test', 'Nguyễn Văn Khách', 'user', '0123456789', 'Hà Nội', NOW(), NOW()),
('customer2', 'customer2@test.com', '$2b$10$test', 'Trần Thị Mua', 'user', '0987654321', 'TP.HCM', NOW(), NOW()),
('partner1', 'partner1@test.com', '$2b$10$test', 'Lê Văn Bán', 'partner', '0111222333', 'Đà Nẵng', NOW(), NOW()),
('partner2', 'partner2@test.com', '$2b$10$test', 'Phạm Thị Shop', 'partner', '0444555666', 'Cần Thơ', NOW(), NOW());

-- Get user IDs
SET @customer1_id = (SELECT id FROM users WHERE username = 'customer1');
SET @customer2_id = (SELECT id FROM users WHERE username = 'customer2');
SET @partner1_id = (SELECT id FROM users WHERE username = 'partner1');
SET @partner2_id = (SELECT id FROM users WHERE username = 'partner2');

-- Create chat rooms
INSERT INTO chat_rooms (user_id, partner_id, room_type, status, created_at, updated_at) VALUES
(@customer1_id, @partner1_id, 'user_partner', 'active', NOW(), NOW()),
(@customer2_id, @partner1_id, 'user_partner', 'active', NOW(), NOW()),
(@customer1_id, @partner2_id, 'user_partner', 'active', NOW(), NOW());

-- Get room IDs
SET @room1_id = (SELECT id FROM chat_rooms WHERE user_id = @customer1_id AND partner_id = @partner1_id);
SET @room2_id = (SELECT id FROM chat_rooms WHERE user_id = @customer2_id AND partner_id = @partner1_id);
SET @room3_id = (SELECT id FROM chat_rooms WHERE user_id = @customer1_id AND partner_id = @partner2_id);

-- Insert test messages for Room 1 (Customer1 - Partner1)
INSERT INTO chat_messages (room_id, sender_id, content, message_type, created_at) VALUES
(@room1_id, @customer1_id, 'Chào shop! Tôi muốn hỏi về sản phẩm áo thun nam', 'text', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(@room1_id, @partner1_id, 'Chào bạn! Shop có thể giúp gì cho bạn?', 'text', DATE_SUB(NOW(), INTERVAL 29 MINUTE)),
(@room1_id, @customer1_id, 'Sản phẩm có còn hàng không?', 'text', DATE_SUB(NOW(), INTERVAL 28 MINUTE)),
(@room1_id, @partner1_id, 'Có bạn nhé! Shop còn đủ size từ S đến XL', 'text', DATE_SUB(NOW(), INTERVAL 27 MINUTE)),
(@room1_id, @customer1_id, 'Giá bao nhiêu vậy shop?', 'text', DATE_SUB(NOW(), INTERVAL 26 MINUTE)),
(@room1_id, @partner1_id, 'Giá 150k/bộ bạn nhé, free ship toàn quốc', 'text', DATE_SUB(NOW(), INTERVAL 25 MINUTE)),
(@room1_id, @customer1_id, 'Ok shop, tôi sẽ đặt hàng', 'text', DATE_SUB(NOW(), INTERVAL 24 MINUTE)),
(@room1_id, @partner1_id, 'Cảm ơn bạn! Shop sẽ chuẩn bị hàng ngay', 'text', DATE_SUB(NOW(), INTERVAL 23 MINUTE));

-- Insert test messages for Room 2 (Customer2 - Partner1)
INSERT INTO chat_messages (room_id, sender_id, content, message_type, created_at) VALUES
(@room2_id, @customer2_id, 'Shop ơi, quần jean nữ có size 28 không?', 'text', DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
(@room2_id, @partner1_id, 'Chào bạn! Có size 28 nhé, bạn cao bao nhiêu?', 'text', DATE_SUB(NOW(), INTERVAL 19 MINUTE)),
(@room2_id, @customer2_id, 'Tôi cao 1m60, nặng 50kg', 'text', DATE_SUB(NOW(), INTERVAL 18 MINUTE)),
(@room2_id, @partner1_id, 'Với chiều cao và cân nặng của bạn, size 28 sẽ phù hợp', 'text', DATE_SUB(NOW(), INTERVAL 17 MINUTE)),
(@room2_id, @customer2_id, 'Có màu xanh đậm không shop?', 'text', DATE_SUB(NOW(), INTERVAL 16 MINUTE)),
(@room2_id, @partner1_id, 'Có bạn nhé! Shop có màu xanh đậm và xanh nhạt', 'text', DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
(@room2_id, @customer2_id, 'Tuyệt! Tôi sẽ đặt size 28 màu xanh đậm', 'text', DATE_SUB(NOW(), INTERVAL 14 MINUTE)),
(@room2_id, @partner1_id, 'Ok bạn! Shop sẽ chuẩn bị hàng', 'text', DATE_SUB(NOW(), INTERVAL 13 MINUTE));

-- Insert test messages for Room 3 (Customer1 - Partner2)
INSERT INTO chat_messages (room_id, sender_id, content, message_type, created_at) VALUES
(@room3_id, @customer1_id, 'Shop có giày sneaker nam không?', 'text', DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
(@room3_id, @partner2_id, 'Chào bạn! Có nhiều mẫu giày sneaker nam đẹp lắm', 'text', DATE_SUB(NOW(), INTERVAL 9 MINUTE)),
(@room3_id, @customer1_id, 'Có size 42 không?', 'text', DATE_SUB(NOW(), INTERVAL 8 MINUTE)),
(@room3_id, @partner2_id, 'Có bạn nhé! Size 42 còn đủ các màu', 'text', DATE_SUB(NOW(), INTERVAL 7 MINUTE)),
(@room3_id, @customer1_id, 'Giá bao nhiêu vậy?', 'text', DATE_SUB(NOW(), INTERVAL 6 MINUTE)),
(@room3_id, @partner2_id, 'Giá từ 200k-500k tùy mẫu bạn nhé', 'text', DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
(@room3_id, @customer1_id, 'Shop có thể gửi ảnh mẫu được không?', 'text', DATE_SUB(NOW(), INTERVAL 4 MINUTE)),
(@room3_id, @partner2_id, 'Được bạn! Shop sẽ gửi ảnh mẫu qua chat', 'text', DATE_SUB(NOW(), INTERVAL 3 MINUTE));

-- Update room timestamps
UPDATE chat_rooms SET updated_at = NOW() WHERE id IN (@room1_id, @room2_id, @room3_id);

-- Insert some notifications
INSERT INTO notifications (user_id, type, title, content, is_read, created_at) VALUES
(@customer1_id, 'chat', 'Tin nhắn mới', 'Bạn có tin nhắn mới từ shop', 0, NOW()),
(@customer2_id, 'chat', 'Tin nhắn mới', 'Bạn có tin nhắn mới từ shop', 0, NOW()),
(@partner1_id, 'chat', 'Tin nhắn mới', 'Bạn có tin nhắn mới từ khách hàng', 0, NOW()),
(@partner2_id, 'chat', 'Tin nhắn mới', 'Bạn có tin nhắn mới từ khách hàng', 0, NOW());

-- Display test data summary
SELECT 
    'Test Users Created:' as info,
    COUNT(*) as count
FROM users 
WHERE username IN ('customer1', 'customer2', 'partner1', 'partner2');

SELECT 
    'Chat Rooms Created:' as info,
    COUNT(*) as count
FROM chat_rooms 
WHERE user_id IN (@customer1_id, @customer2_id) 
   OR partner_id IN (@partner1_id, @partner2_id);

SELECT 
    'Messages Created:' as info,
    COUNT(*) as count
FROM chat_messages 
WHERE room_id IN (@room1_id, @room2_id, @room3_id);

SELECT 
    'Notifications Created:' as info,
    COUNT(*) as count
FROM notifications 
WHERE user_id IN (@customer1_id, @customer2_id, @partner1_id, @partner2_id);
