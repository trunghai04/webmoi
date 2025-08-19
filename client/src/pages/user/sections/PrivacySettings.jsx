import React from "react";

const PrivacySettings = () => {
  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log("Requesting account deletion");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</h1>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-800">Yêu cầu xóa tài khoản</p>
        </div>
        <button
          onClick={handleDeleteAccount}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Xóa bỏ
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;
