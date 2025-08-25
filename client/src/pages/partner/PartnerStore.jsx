import React, { useState } from 'react';
import { FaStore, FaTruck, FaCreditCard, FaPalette, FaLanguage, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PartnerStore = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    // Shipping settings
    freeShippingThreshold: 500000,
    standardShippingCost: 30000,
    expressShippingCost: 50000,
    pickupAvailable: true,
    returnPolicy: '7 ngày đổi trả',
    warrantyPolicy: '12 tháng bảo hành',
    
    // Payment settings
    acceptCash: true,
    acceptBankTransfer: true,
    acceptCreditCard: true,
    acceptCOD: true,
    
    // Store appearance
    storeTheme: 'light',
    primaryColor: '#f97316',
    language: 'vi',
    currency: 'VND',
    
    // Business hours
    businessHours: {
      monday: { open: '08:00', close: '22:00', closed: false },
      tuesday: { open: '08:00', close: '22:00', closed: false },
      wednesday: { open: '08:00', close: '22:00', closed: false },
      thursday: { open: '08:00', close: '22:00', closed: false },
      friday: { open: '08:00', close: '22:00', closed: false },
      saturday: { open: '09:00', close: '21:00', closed: false },
      sunday: { open: '10:00', close: '20:00', closed: false }
    }
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setStoreSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: {
          ...prev.businessHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đã lưu cài đặt cửa hàng thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt!');
    } finally {
      setIsLoading(false);
    }
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Thứ 2' },
    { key: 'tuesday', label: 'Thứ 3' },
    { key: 'wednesday', label: 'Thứ 4' },
    { key: 'thursday', label: 'Thứ 5' },
    { key: 'friday', label: 'Thứ 6' },
    { key: 'saturday', label: 'Thứ 7' },
    { key: 'sunday', label: 'Chủ nhật' }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cài Đặt Cửa Hàng</h1>
        <p className="text-gray-600">Quản lý cài đặt vận chuyển, thanh toán và giao diện cửa hàng</p>
      </div>

      <div className="space-y-6">
        {/* Shipping Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaTruck className="mr-2 text-blue-500" />
            Cài Đặt Vận Chuyển
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngưỡng miễn phí vận chuyển (VNĐ)
              </label>
              <input
                type="number"
                name="freeShippingThreshold"
                value={storeSettings.freeShippingThreshold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phí vận chuyển tiêu chuẩn (VNĐ)
              </label>
              <input
                type="number"
                name="standardShippingCost"
                value={storeSettings.standardShippingCost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phí vận chuyển nhanh (VNĐ)
              </label>
              <input
                type="number"
                name="expressShippingCost"
                value={storeSettings.expressShippingCost}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="pickupAvailable"
                checked={storeSettings.pickupAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Cho phép nhận hàng tại cửa hàng
              </label>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chính sách đổi trả
              </label>
              <textarea
                name="returnPolicy"
                value={storeSettings.returnPolicy}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chính sách bảo hành
              </label>
              <textarea
                name="warrantyPolicy"
                value={storeSettings.warrantyPolicy}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaCreditCard className="mr-2 text-green-500" />
            Phương Thức Thanh Toán
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptCash"
                checked={storeSettings.acceptCash}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Tiền mặt
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptBankTransfer"
                checked={storeSettings.acceptBankTransfer}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Chuyển khoản
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptCreditCard"
                checked={storeSettings.acceptCreditCard}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Thẻ tín dụng
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptCOD"
                checked={storeSettings.acceptCOD}
                onChange={handleInputChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                COD
              </label>
            </div>
          </div>
        </div>

        {/* Store Appearance */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FaPalette className="mr-2 text-purple-500" />
            Giao Diện Cửa Hàng
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giao diện
              </label>
              <select
                name="storeTheme"
                value={storeSettings.storeTheme}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="light">Sáng</option>
                <option value="dark">Tối</option>
                <option value="auto">Tự động</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Màu chủ đạo
              </label>
              <input
                type="color"
                name="primaryColor"
                value={storeSettings.primaryColor}
                onChange={handleInputChange}
                className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngôn ngữ
              </label>
              <select
                name="language"
                value={storeSettings.language}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đơn vị tiền tệ
              </label>
              <select
                name="currency"
                value={storeSettings.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="VND">VNĐ</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Giờ Làm Việc</h2>

          <div className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day.key} className="flex items-center space-x-4">
                <div className="w-24">
                  <span className="text-sm font-medium text-gray-700">{day.label}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!storeSettings.businessHours[day.key].closed}
                    onChange={(e) => handleBusinessHoursChange(day.key, 'closed', !e.target.checked)}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">Mở cửa</span>
                </div>

                {!storeSettings.businessHours[day.key].closed && (
                  <>
                    <input
                      type="time"
                      value={storeSettings.businessHours[day.key].open}
                      onChange={(e) => handleBusinessHoursChange(day.key, 'open', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={storeSettings.businessHours[day.key].close}
                      onChange={(e) => handleBusinessHoursChange(day.key, 'close', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </>
                )}

                {storeSettings.businessHours[day.key].closed && (
                  <span className="text-sm text-gray-500">Nghỉ</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang lưu...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Lưu cài đặt
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PartnerStore;
