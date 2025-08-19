import React, { useState } from "react";

const PersonalInfo = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    cccdNumber: "",
    address: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Submitting personal info:", formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Thông tin cá nhân</h1>
        <p className="text-gray-600">
          Vui lòng đảm bảo nội dung bạn cung cấp trùng khớp với thông tin trên CCCD của bạn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Họ và tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Họ và tên đầy đủ trên CCCD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* CCCD Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số CCCD
          </label>
          <input
            type="text"
            name="cccdNumber"
            value={formData.cccdNumber}
            onChange={handleChange}
            placeholder="Số định danh cá nhân trên CCCD"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ
          </label>
          <div className="relative">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Địa chỉ Nơi thường trú trên CCCD"
              rows={3}
              maxLength={200}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {formData.address.length}/200
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Xác Nhận
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
