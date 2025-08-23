# Hướng dẫn Setup Social Login

## Google Login Setup

### 1. Tạo Google OAuth 2.0 Client ID

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API và Google Identity API
4. Vào "Credentials" > "Create Credentials" > "OAuth 2.0 Client IDs"
5. Chọn "Web application"
6. Thêm Authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `http://localhost:3000` (nếu cần)
   - Domain production của bạn
7. Thêm Authorized redirect URIs:
   - `http://localhost:5173`
   - Domain production của bạn
8. Copy Client ID và cập nhật trong `client/src/config/social.js`

### 2. Cập nhật Google Client ID

```javascript
// client/src/config/social.js
export const SOCIAL_CONFIG = {
  GOOGLE: {
    CLIENT_ID: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    SCOPES: ['email', 'profile']
  },
  // ...
};
```

## Facebook Login Setup

### 1. Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo app mới
3. Thêm Facebook Login product
4. Cấu hình OAuth redirect URIs:
   - `http://localhost:5173`
   - Domain production của bạn
5. Copy App ID và cập nhật trong `client/index.html`

### 2. Cập nhật Facebook App ID

```html
<!-- client/index.html -->
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId: 'YOUR_ACTUAL_FACEBOOK_APP_ID',
      cookie: true,
      xfbml: true,
      version: 'v18.0'
    });
  };
</script>
```

## Lưu ý quan trọng

1. **Development vs Production**: Đảm bảo cấu hình đúng domain cho môi trường development và production
2. **HTTPS**: Trong production, bạn cần sử dụng HTTPS
3. **Privacy Policy**: Facebook yêu cầu có Privacy Policy URL
4. **App Review**: Facebook có thể yêu cầu review app trước khi publish

## Testing

1. Mở http://localhost:5173
2. Vào trang đăng nhập
3. Click vào nút Google hoặc Facebook
4. Kiểm tra console để xem có lỗi gì không

## Troubleshooting

### Google Login không hoạt động:
- Kiểm tra Client ID có đúng không
- Đảm bảo domain được thêm vào Authorized origins
- Kiểm tra Google SDK có load thành công không

### Facebook Login không hoạt động:
- Kiểm tra App ID có đúng không
- Đảm bảo domain được thêm vào OAuth redirect URIs
- Kiểm tra Facebook SDK có load thành công không
