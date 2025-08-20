import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUniversity, FaSave, FaSpinner } from 'react-icons/fa';

const BankSettings = () => {
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    bankBin: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load bank information
  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_BASE}/api/settings/bank-info`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : ''}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setBankInfo(data.data);
        } else {
          toast.error('Không thể tải thông tin ngân hàng');
        }
      } catch (error) {
        console.error('Error fetching bank info:', error);
        toast.error('Lỗi khi tải thông tin ngân hàng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankInfo();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBankInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!bankInfo.bankName || !bankInfo.accountNumber || !bankInfo.accountHolder) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSaving(true);
    
    try {
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/settings/bank-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : ''}`
        },
        body: JSON.stringify(bankInfo)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Cập nhật thông tin ngân hàng thành công');
      } else {
        toast.error(data.message || 'Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Error updating bank info:', error);
      toast.error('Lỗi khi cập nhật thông tin ngân hàng');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải thông tin ngân hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <FaUniversity className="text-3xl text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Cài đặt thông tin ngân hàng</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên ngân hàng *
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={bankInfo.bankName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: Vietcombank"
                  required
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tài khoản *
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  value={bankInfo.accountNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 1234567890"
                  required
                />
              </div>

              {/* Account Holder */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chủ tài khoản *
                </label>
                <input
                  type="text"
                  name="accountHolder"
                  value={bankInfo.accountHolder}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: CONG TY MUA SAM VIET"
                  required
                />
              </div>

              {/* Bank BIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã BIN ngân hàng
                </label>
                <input
                  type="text"
                  name="bankBin"
                  value={bankInfo.bankBin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ví dụ: 970436 (Vietcombank)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mã BIN dùng để tạo mã QR chuyển khoản
                </p>
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Xem trước thông tin:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="ml-2 font-medium">{bankInfo.bankName || 'Chưa nhập'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Số tài khoản:</span>
                  <span className="ml-2 font-medium font-mono">{bankInfo.accountNumber || 'Chưa nhập'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Chủ tài khoản:</span>
                  <span className="ml-2 font-medium">{bankInfo.accountHolder || 'Chưa nhập'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Mã BIN:</span>
                  <span className="ml-2 font-medium">{bankInfo.bankBin || 'Chưa nhập'}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className={`flex items-center px-6 py-2 text-white rounded-md ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSaving ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Lưu thông tin
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Hướng dẫn:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Thông tin ngân hàng sẽ được hiển thị cho khách hàng khi chọn thanh toán bằng chuyển khoản</li>
              <li>• Mã BIN dùng để tạo mã QR chuyển khoản tự động</li>
              <li>• Khách hàng có thể quét mã QR hoặc nhập thông tin thủ công</li>
              <li>• Thông tin sẽ được cập nhật ngay lập tức sau khi lưu</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankSettings;
