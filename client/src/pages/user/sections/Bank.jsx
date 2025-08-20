import React, { useState, useContext, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import useNotification from "../../../hooks/useNotification";
import useConfirm from "../../../hooks/useConfirm";
import NotificationPopup from "../../../components/NotificationPopup";
import ConfirmPopup from "../../../components/ConfirmPopup";

const Bank = () => {
  const { user } = useContext(AuthContext);
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();
  const { confirmDialog, showDeleteConfirm, hideConfirm } = useConfirm();
  
  // Bank component loaded
  
  const [bankAccounts, setBankAccounts] = useState(() => {
    const saved = localStorage.getItem('userBankAccounts');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        bankName: "VCB - NH TMCP NGOAI THUONG VIE...",
        accountHolder: `Họ Và Tên: ${user?.name || user?.username || 'NGUYEN VAN A'}`,
        branch: "Chi nhánh: CN Tay Ho (Vietcombank)",
        accountNumber: "* 3806",
        status: "approved",
        isDefault: true
      }
    ];
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountHolder: user?.name || user?.username || "",
    branch: "",
    accountNumber: ""
  });

  // Lưu vào localStorage khi bankAccounts thay đổi
  useEffect(() => {
    localStorage.setItem('userBankAccounts', JSON.stringify(bankAccounts));
  }, [bankAccounts]);

  const handleAddAccount = () => {
    if (newAccount.bankName && newAccount.accountNumber) {
      const newBankAccount = {
        id: Date.now(),
        ...newAccount,
        status: "pending",
        isDefault: false
      };
      setBankAccounts([...bankAccounts, newBankAccount]);
      setNewAccount({
        bankName: "",
        accountHolder: user?.name || user?.username || "",
        branch: "",
        accountNumber: ""
      });
      setShowAddForm(false);
      showSuccess('Tài khoản ngân hàng đã được thêm thành công!');
    } else {
      showWarning('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleDeleteAccount = (id) => {
    showDeleteConfirm(
      'Bạn có chắc chắn muốn xóa tài khoản ngân hàng này? Hành động này không thể hoàn tác.',
      () => {
        setBankAccounts(bankAccounts.filter(account => account.id !== id));
        showSuccess('Tài khoản đã được xóa thành công!');
      }
    );
  };

  const handleSetDefault = (id) => {
    setBankAccounts(bankAccounts.map(account => ({
      ...account,
      isDefault: account.id === id
    })));
    showSuccess('Đã thiết lập làm tài khoản mặc định!');
  };

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
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
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
                      <button 
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-600 hover:text-red-700 text-sm"
                      >
                        Xóa
                      </button>
                      {!account.isDefault && (
                        <button 
                          onClick={() => handleSetDefault(account.id)}
                          className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-3 py-1 rounded"
                        >
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

        {/* Add Bank Account Form */}
        {showAddForm && (
          <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thêm Tài Khoản Ngân Hàng</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Ngân Hàng
                </label>
                <input
                  type="text"
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({...newAccount, bankName: e.target.value})}
                  placeholder="VD: Vietcombank, BIDV, Techcombank..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số Tài Khoản
                </label>
                <input
                  type="text"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                  placeholder="Nhập số tài khoản"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Chủ Tài Khoản
                </label>
                <input
                  type="text"
                  value={newAccount.accountHolder}
                  onChange={(e) => setNewAccount({...newAccount, accountHolder: e.target.value})}
                  placeholder="Tên chủ tài khoản"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chi Nhánh
                </label>
                <input
                  type="text"
                  value={newAccount.branch}
                  onChange={(e) => setNewAccount({...newAccount, branch: e.target.value})}
                  placeholder="Chi nhánh ngân hàng"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleAddAccount}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Thêm Tài Khoản
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
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

export default Bank;
