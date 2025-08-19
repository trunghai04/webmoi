import React, { useState } from "react";
import { FaCamera, FaQuestionCircle } from "react-icons/fa";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "ngtrunghi927",
    name: "Đăng",
    email: "",
    phone: "*********02",
    gender: "",
    birthDate: "**/**/2004"
  });

  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Handle save logic
    console.log("Saving profile:", formData);
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
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              readOnly
            />
            <p className="text-xs text-gray-500 mt-1">
              Tên Đăng nhập chỉ có thể thay đổi một lần.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            {formData.email ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-800">{formData.email}</span>
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Thay Đổi
                </button>
              </div>
            ) : (
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                Thêm
              </button>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="flex items-center justify-between">
              <span className="text-gray-800">{formData.phone}</span>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                Thay Đổi
              </button>
            </div>
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
            <div className="flex items-center justify-between">
              <span className="text-gray-800">{formData.birthDate}</span>
              <button className="text-blue-600 hover:text-blue-700 text-sm">
                Thay Đổi
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              onClick={handleSave}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>

        {/* Avatar Section */}
        <div className="w-48 flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center overflow-hidden">
            {avatar ? (
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <FaCamera className="text-gray-500 text-3xl" />
            )}
          </div>
          
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <div className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center">
              Chọn Ảnh
            </div>
          </label>
          
          <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
            <p>Dụng lượng file tối đa 1 MB</p>
            <p>Định dạng: .JPEG, .PNG</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
