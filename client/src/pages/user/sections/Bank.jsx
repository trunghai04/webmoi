import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Bank = () => {
  const [bankAccounts] = useState([
    {
      id: 1,
      bankName: "VCB - NH TMCP NGOAI THUONG VIE...",
      accountHolder: "Họ Và Tên: DANG TRUNG HAI",
      branch: "Chi nhánh: CN Tay Ho (Vietcombank)",
      accountNumber: "* 3806",
      status: "approved",
      isDefault: true
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Credit/Debit Cards Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Thẻ Tín Dụng/Ghi Nợ</h2>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <FaPlus className="text-sm" />
            Thêm Thẻ Mới
          </button>
        </div>
        <div className="text-center py-8 text-gray-600">
          Bạn chưa liên kết thẻ.
        </div>
      </div>

      {/* Bank Accounts Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tài Khoản Ngân Hàng Của Tôi</h2>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2">
            <FaPlus className="text-sm" />
            Thêm Ngân Hàng Liên Kết
          </button>
        </div>

        {bankAccounts.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Bạn chưa liên kết tài khoản ngân hàng.
          </div>
        ) : (
          <div className="space-y-4">
            {bankAccounts.map((account) => (
              <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Bank Logo */}
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">V</span>
                    </div>

                    {/* Account Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {account.bankName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {account.accountHolder}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {account.branch}
                      </p>
                      <p className="text-sm text-gray-800 font-medium">
                        {account.accountNumber}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-sm font-medium">
                        Đã duyệt
                      </span>
                      {account.isDefault && (
                        <span className="bg-teal-500 text-white text-xs px-2 py-1 rounded">
                          Mặc Định
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        Xóa
                      </button>
                      {!account.isDefault && (
                        <button className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-3 py-1 rounded">
                          Thiết Lập Mặc Định
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bank;
