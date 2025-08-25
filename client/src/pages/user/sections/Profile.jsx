import React, { useState, useContext, useRef } from "react";
import { FaCamera, FaQuestionCircle, FaUser, FaSpinner } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import useNotification from "../../../hooks/useNotification";
import NotificationPopup from "../../../components/NotificationPopup";

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const { notification, showSuccess, showError, hideNotification } = useNotification();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    birth_date: user?.birth_date || "",
    address: user?.address || ""
  });

  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (1MB)
      if (file.size > 1024 * 1024) {
        showError('File quá lớn. Kích thước tối đa là 1MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        showError('Chỉ chấp nhận file hình ảnh.');
        return;
      }

      setAvatarFile(file);
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const token = JSON.parse(localStorage.getItem('msv_auth')).token;
      const response = await fetch('http://localhost:5000/api/auth/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.avatar;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi upload avatar');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem('msv_auth')).token;
      
      // Upload avatar first if there's a new one
      let newAvatarPath = null;
      if (avatarFile) {
        try {
          newAvatarPath = await uploadAvatar();
          showSuccess('Avatar đã được cập nhật thành công!');
        } catch (error) {
          showError('Lỗi upload avatar: ' + error.message);
          setIsLoading(false);
          return;
        }
      }

      // Update profile information
      const profileData = {
        ...formData,
        avatar: newAvatarPath || user?.avatar
      };

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        const data = await response.json();
        showSuccess('Hồ sơ đã được cập nhật thành công!');
        
        // Update local user data
        if (updateUser) {
          updateUser({
            ...user,
            ...formData,
            avatar: newAvatarPath || user?.avatar
          });
        }
        
        // Reset avatar file
        setAvatarFile(null);
      } else {
        const errorData = await response.json();
        showError(errorData.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      showError('Có lỗi xảy ra khi cập nhật hồ sơ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Hồ Sơ Của Tôi</h1>
        <p className="text-gray-600">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <div className="flex gap-8">
        {/* Form Section */}
        <div className="flex-1 space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={user?.username || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-gray-50"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              Tên đăng nhập không thể thay đổi.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập họ và tên"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập email"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập địa chỉ"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Giới tính
              <FaQuestionCircle className="text-gray-400 text-xs" />
            </label>
            <div className="space-y-2">
              {["Nam", "Nữ", "Khác"].map((gender) => (
                <label key={gender} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={formData.gender === gender}
                    onChange={handleChange}
                    className="text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              Ngày sinh
              <FaQuestionCircle className="text-gray-400 text-xs" />
            </label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <FaSpinner className="animate-spin" />}
              {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="w-48 flex flex-col items-center">
          <div 
            className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-gray-500 text-3xl" />
            )}

          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          
          <button
            onClick={handleAvatarClick}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
          >
            Chọn Ảnh
          </button>
          
          <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
            <p>Dụng lượng file tối đa 1 MB</p>
            <p>Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </div>
      
      {/* Notification Popup */}
      <NotificationPopup
        isOpen={notification.isOpen}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        duration={notification.duration}
      />
    </div>
  );
};

export default Profile;
