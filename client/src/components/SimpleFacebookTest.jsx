import React from 'react';
import SimpleFacebookLogin from './SimpleFacebookLogin';

const SimpleFacebookTest = ({ appId }) => {
  const handleSuccess = (data) => {
    console.log('Facebook login success:', data);
    alert(`Đăng nhập thành công với ${data.user.name}`);
  };

  const handleError = (error) => {
    console.error('Facebook login error:', error);
    alert(`Lỗi đăng nhập: ${error}`);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Simple Facebook Test</h3>
      
      <SimpleFacebookLogin
        appId={appId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
      
      <div className="mt-4 text-xs text-gray-500">
        <p>App ID: {appId}</p>
        <p>Kiểm tra console để xem chi tiết</p>
      </div>
    </div>
  );
};

export default SimpleFacebookTest;
