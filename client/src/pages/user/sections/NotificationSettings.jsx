import React, { useState } from "react";

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
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

  const handleToggle = (type, setting) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [setting]: !prev[type][setting]
      }
    }));
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
    </div>
  );
};

export default NotificationSettings;
