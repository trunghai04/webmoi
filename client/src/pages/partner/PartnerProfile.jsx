import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { FaStore, FaUpload, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PartnerProfile = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [storeData, setStoreData] = useState({
    storeName: 'Shop Thời Trang ABC',
    storeDescription: 'Chuyên cung cấp các sản phẩm thời trang chất lượng cao',
    email: user?.email || 'shop@example.com',
    phone: user?.phone || '0123456789',
    address: user?.address || '123 Đường ABC, Quận 1, TP.HCM',
    website: 'https://shopabc.com',
    logo: user?.avatar || '/uploads/store-logo.jpg',
    businessLicense: 'GP123456789',
    taxCode: '0123456789',
    commissionRate: 10.00
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStoreData(prev => ({
          ...prev,
          logo: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Đã cập nhật thông tin cửa hàng thành công!');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Hồ Sơ Cửa Hàng</h1>
        <p className="text-gray-600">Quản lý thông tin cửa hàng và cài đặt kinh doanh</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Store Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaStore className="mr-2 text-orange-500" />
              Thông Tin Cửa Hàng
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên cửa hàng *
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={storeData.storeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Nhập tên cửa hàng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả cửa hàng
                </label>
                <textarea
                  name="storeDescription"
                  value={storeData.storeDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Mô tả về cửa hàng của bạn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={storeData.website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo cửa hàng
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    {storeData.logo ? (
                      <img src={storeData.logo} alt="Store Logo" className="w-full h-full object-cover" />
                    ) : (
                      <FaStore className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <FaUpload className="mr-2" />
                      Tải lên logo
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông Tin Kinh Doanh</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giấy phép kinh doanh
                </label>
                <input
                  type="text"
                  name="businessLicense"
                  value={storeData.businessLicense}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Số giấy phép kinh doanh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  name="taxCode"
                  value={storeData.taxCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Mã số thuế"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tỷ lệ hoa hồng (%)
                </label>
                <input
                  type="number"
                  name="commissionRate"
                  value={storeData.commissionRate}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Tỷ lệ hoa hồng mà cửa hàng phải trả cho nền tảng</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông Tin Liên Hệ</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email liên hệ *
                </label>
                <input
                  type="email"
                  name="email"
                  value={storeData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={storeData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="0123456789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ cửa hàng
                </label>
                <textarea
                  name="address"
                  value={storeData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Địa chỉ cửa hàng"
                />
              </div>
            </div>
          </div>

          {/* Store Statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thống Kê Cửa Hàng</h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-600">Đơn hàng</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">89</div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">234</div>
                <div className="text-sm text-gray-600">Khách hàng</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">4.8</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <Link 
          to="/store/1" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <FaEye className="mr-2" />
          Xem trang cửa hàng
        </Link>
        
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
              Lưu thay đổi
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PartnerProfile;
