import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useNotification from "../../../hooks/useNotification";
import useConfirm from "../../../hooks/useConfirm";
import NotificationPopup from "../../../components/NotificationPopup";
import ConfirmPopup from "../../../components/ConfirmPopup";

const NotificationSettings = () => {
  const { user } = useContext(AuthContext);
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();
  const { confirmDialog, showWarningConfirm, hideConfirm } = useConfirm();
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('userNotificationSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      email: {
        orderUpdates: true,
        promotions: false,
        surveys: false
      },
      sms: {
        promotions: true
      },
      zalo: {
        promotions: true
      }
    };
  });

  const [hasChanges, setHasChanges] = useState(false);

  // Lưu vào localStorage khi settings thay đổi
  useEffect(() => {
    localStorage.setItem('userNotificationSettings', JSON.stringify(settings));
  }, [settings]);

  const handleToggle = (type, setting) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting]
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      console.log("Saving notification settings:", settings);
      
      // Simulate API call
      const response = await fetch('http://localhost:5000/api/auth/notification-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('msv_auth')).token}`
        },
        body: JSON.stringify(settings)
      });
      
      if (response.ok) {
        showSuccess('Cài đặt thông báo đã được lưu thành công!');
        setHasChanges(false);
      } else {
        showError('Có lỗi xảy ra khi lưu cài đặt');
      }
    } catch (error) {
      console.error('Error saving notification settings:', error);
      showError('Có lỗi xảy ra khi lưu cài đặt');
    }
  };

  const handleReset = () => {
    showWarningConfirm(
      'Khôi phục cài đặt mặc định',
      'Bạn có chắc chắn muốn khôi phục về cài đặt mặc định? Tất cả thay đổi chưa lưu sẽ bị mất.',
      () => {
        setSettings({
          email: {
            orderUpdates: true,
            promotions: false,
            surveys: false
          },
          sms: {
            promotions: true
          },
          zalo: {
            promotions: true
          }
        });
        setHasChanges(true);
      }
    );
  };

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Cài Đặt Thông Báo</h1>

      <div className="space-y-8">
        {/* Email Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Email thông báo</h2>
          <p className="text-sm text-gray-600 mb-4">
            Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Cập nhật đơn hàng</h3>
                <p className="text-sm text-gray-600">Cập nhật về tình trạng vận chuyển của tất cả các đơn hàng</p>
              </div>
              <ToggleSwitch
                enabled={settings.email.orderUpdates}
                onChange={() => handleToggle('email', 'orderUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Khuyến mãi</h3>
                <p className="text-sm text-gray-600">Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
              </div>
              <ToggleSwitch
                enabled={settings.email.promotions}
                onChange={() => handleToggle('email', 'promotions')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">Khảo sát</h3>
                <p className="text-sm text-gray-600">Đồng ý nhận khảo sát để cho chúng tôi được lắng nghe bạn</p>
              </div>
              <ToggleSwitch
                enabled={settings.email.surveys}
                onChange={() => handleToggle('email', 'surveys')}
              />
            </div>
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông báo SMS</h2>
          <p className="text-sm text-gray-600 mb-4">
            Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Khuyến mãi</h3>
              <p className="text-sm text-gray-600">Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
            </div>
            <ToggleSwitch
              enabled={settings.sms.promotions}
              onChange={() => handleToggle('sms', 'promotions')}
            />
          </div>
        </div>

        {/* Zalo Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông báo Zalo</h2>
          <p className="text-sm text-gray-600 mb-4">
            Thông báo và nhắc nhở quan trọng về tài khoản sẽ không thể bị tắt
          </p>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">Khuyến mãi (MuaSamViet)</h3>
              <p className="text-sm text-gray-600">Cập nhật về các ưu đãi và khuyến mãi sắp tới</p>
            </div>
            <ToggleSwitch
              enabled={settings.zalo.promotions}
              onChange={() => handleToggle('zalo', 'promotions')}
            />
          </div>
        </div>
      </div>

      {/* Save/Reset Buttons */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {hasChanges && (
            <span className="text-orange-600 font-medium">
              Bạn có thay đổi chưa được lưu
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Khôi phục mặc định
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-2 rounded-lg transition-colors ${
              hasChanges
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Lưu thay đổi
          </button>
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
      
      {/* Confirm Popup */}
      <ConfirmPopup
        isOpen={confirmDialog.isOpen}
        onClose={hideConfirm}
        onConfirm={confirmDialog.onConfirm}
        type={confirmDialog.type}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
      />
    </div>
  );
};

export default NotificationSettings;
