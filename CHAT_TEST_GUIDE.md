# 🗣️ Hướng dẫn Test Chat giữa Khách hàng và Người bán

## 📋 Chuẩn bị

### 1. Chạy script SQL để tạo dữ liệu test
```bash
# Kết nối vào MySQL và chạy script
mysql -u root -p muasamviet < test_chat_data.sql
```

### 2. Đảm bảo server đang chạy
```bash
# Terminal 1: Chạy backend
cd server
npm run dev

# Terminal 2: Chạy frontend  
cd client
npm run dev
```

## 🧪 Cách Test Chat

### **Bước 1: Tạo tài khoản test**

#### Tài khoản Khách hàng:
- **Username:** `customer1` / **Password:** `123456`
- **Username:** `customer2` / **Password:** `123456`

#### Tài khoản Người bán:
- **Username:** `partner1` / **Password:** `123456`  
- **Username:** `partner2` / **Password:** `123456`

### **Bước 2: Test Chat Real-time**

#### **Test Case 1: Khách hàng chat với Người bán**
1. **Mở 2 tab trình duyệt**
2. **Tab 1:** Đăng nhập với `customer1`
3. **Tab 2:** Đăng nhập với `partner1`
4. **Cả 2 tab:** Truy cập `/chat`
5. **Chọn cuộc trò chuyện** giữa customer1 và partner1
6. **Gửi tin nhắn** từ tab này và xem hiển thị ở tab kia

#### **Test Case 2: Nhiều cuộc trò chuyện**
1. **Mở 3 tab trình duyệt**
2. **Tab 1:** `customer1` chat với `partner1`
3. **Tab 2:** `customer2` chat với `partner1`  
4. **Tab 3:** `customer1` chat với `partner2`
5. **Test gửi tin nhắn** giữa các cuộc trò chuyện khác nhau

#### **Test Case 3: Test từ Dashboard**
1. **Đăng nhập** với tài khoản `partner1`
2. **Truy cập** `/partner` (Dashboard người bán)
3. **Click** "Chat khách hàng" trong Quick Actions
4. **Xem danh sách** cuộc trò chuyện với khách hàng

### **Bước 3: Test các tính năng**

#### **✅ Tính năng cần test:**
- [ ] **Real-time messaging** - Tin nhắn hiển thị ngay lập tức
- [ ] **Typing indicators** - Hiển thị "đang gõ..."
- [ ] **Message history** - Lưu trữ tin nhắn cũ
- [ ] **Notifications** - Thông báo tin nhắn mới
- [ ] **Room management** - Quản lý phòng chat
- [ ] **User status** - Trạng thái online/offline
- [ ] **File upload** - Gửi ảnh, file (nếu có)

#### **🔧 Test Socket.IO Connection:**
1. **Mở Developer Tools** (F12)
2. **Tab Console** - Xem log kết nối Socket.IO
3. **Tab Network** - Xem WebSocket connections
4. **Kiểm tra** không có lỗi connection

## 📊 Dữ liệu Test có sẵn

### **Chat Rooms:**
- **Room 1:** customer1 ↔ partner1 (8 tin nhắn)
- **Room 2:** customer2 ↔ partner1 (8 tin nhắn)  
- **Room 3:** customer1 ↔ partner2 (8 tin nhắn)

### **Nội dung tin nhắn mẫu:**
- Hỏi về sản phẩm, giá cả
- Tư vấn size, màu sắc
- Đặt hàng, xác nhận
- Hỗ trợ khách hàng

## 🐛 Troubleshooting

### **Lỗi thường gặp:**

#### **1. Không kết nối được Socket.IO**
```bash
# Kiểm tra server có chạy không
curl http://localhost:5000/api/health

# Kiểm tra CORS settings
# Xem file server/src/server.js
```

#### **2. Không hiển thị tin nhắn**
```bash
# Kiểm tra database
mysql -u root -p muasamviet
SELECT * FROM chat_messages LIMIT 5;
SELECT * FROM chat_rooms LIMIT 5;
```

#### **3. Lỗi authentication**
```bash
# Kiểm tra token trong localStorage
# Xem AuthContext có hoạt động không
```

### **Debug Commands:**
```bash
# Xem log server
cd server && npm run dev

# Xem log client  
cd client && npm run dev

# Kiểm tra database
mysql -u root -p muasamviet -e "SELECT COUNT(*) FROM chat_messages;"
```

## 🎯 Kết quả mong đợi

### **✅ Test thành công khi:**
- Tin nhắn gửi và nhận real-time
- Hiển thị đúng người gửi/nhận
- Lưu trữ tin nhắn trong database
- Thông báo tin nhắn mới
- Giao diện responsive và đẹp

### **❌ Cần fix nếu:**
- Tin nhắn không hiển thị real-time
- Lỗi kết nối Socket.IO
- Không lưu được tin nhắn
- Giao diện bị lỗi

## 📝 Ghi chú

- **Backup:** Dữ liệu test sẽ được tạo với `INSERT IGNORE`
- **Cleanup:** Có thể xóa dữ liệu test sau khi test xong
- **Production:** Đảm bảo xóa dữ liệu test trước khi deploy

---

**Happy Testing! 🚀**
