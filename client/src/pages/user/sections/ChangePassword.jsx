import React, { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import useNotification from "../../../hooks/useNotification";
import NotificationPopup from "../../../components/NotificationPopup";

const ChangePassword = () => {
  const { user } = useContext(AuthContext);
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();
  
  // ChangePassword component loaded
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasUppercase && hasLowercase && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.currentPassword) {
      showWarning('Vui lòng nhập mật khẩu hiện tại');
      return;
    }
    
    if (!formData.newPassword) {
      showWarning('Vui lòng nhập mật khẩu mới');
      return;
    }
    
    if (!validatePassword(formData.newPassword)) {
      showWarning('Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      showWarning('Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (formData.currentPassword === formData.newPassword) {
      showWarning('Mật khẩu mới phải khác mật khẩu hiện tại');
      return;
    }

    try {
      console.log("Changing password:", formData);
      
      // Simulate API call
      const response = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('msv_auth')).token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      if (response.ok) {
        showSuccess('Mật khẩu đã được thay đổi thành công!');
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
      } else {
        showError('Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      showError('Có lỗi xảy ra khi đổi mật khẩu');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đổi Mật Khẩu</h1>
        <p className="text-gray-600">
          Đảm bảo mật khẩu mới của bạn mạnh và khác với mật khẩu hiện tại
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        {/* Current Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu hiện tại
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập mật khẩu hiện tại"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
          </p>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Xác nhận mật khẩu mới
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Đổi Mật Khẩu
          </button>
        </div>
      </form>
      
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

export default ChangePassword;
