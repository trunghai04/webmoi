import React, { useState, useContext, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import useNotification from "../../../hooks/useNotification";
import useConfirm from "../../../hooks/useConfirm";
import NotificationPopup from "../../../components/NotificationPopup";
import ConfirmPopup from "../../../components/ConfirmPopup";

const Address = () => {
  const { user } = useContext(AuthContext);
  const { notification, showSuccess, showError, showWarning, hideNotification } = useNotification();
  const { confirmDialog, showDeleteConfirm, hideConfirm } = useConfirm();
  
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('userAddresses');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      {
        id: 1,
        recipientName: user?.name || user?.username || "Nguyễn Văn A",
        phone: user?.phone || "(+84) 366 292 402",
        address: "Fagi Land Yên Xá, Số 9, Hẻm 87/59/24 Yên Xá Xã Tân Triều, Huyện Thanh Trì, Hà Nội",
        isDefault: true
      },
      {
        id: 2,
        recipientName: user?.name || user?.username || "Nguyễn Văn A",
        phone: user?.phone || "(+84) 986 555 288",
        address: "Chợ Kênh 7, Đường Nam Cây Dương, Tổ 3 Ấp Bình Thạnh Xã Bình Chánh, Huyện Châu Phú, An Giang",
        isDefault: false
      }
    ];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    recipientName: user?.name || user?.username || "",
    phone: user?.phone || "",
    address: ""
  });

  // Lưu vào localStorage khi addresses thay đổi
  useEffect(() => {
    localStorage.setItem('userAddresses', JSON.stringify(addresses));
  }, [addresses]);

  const handleAddAddress = () => {
    if (formData.recipientName && formData.phone && formData.address) {
      const newAddress = {
        id: Date.now(),
        ...formData,
        isDefault: addresses.length === 0
      };
      setAddresses([...addresses, newAddress]);
      setFormData({
        recipientName: user?.name || user?.username || "",
        phone: user?.phone || "",
        address: ""
      });
      setShowAddForm(false);
      showSuccess('Địa chỉ đã được thêm thành công!');
    } else {
      showWarning('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleUpdateAddress = () => {
    if (formData.recipientName && formData.phone && formData.address) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...editingAddress, ...formData } : addr
      ));
      setEditingAddress(null);
      setFormData({
        recipientName: user?.name || user?.username || "",
        phone: user?.phone || "",
        address: ""
      });
      showSuccess('Địa chỉ đã được cập nhật thành công!');
    } else {
      showWarning('Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleDeleteAddress = (id) => {
    showDeleteConfirm(
      'Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác.',
      () => {
        setAddresses(addresses.filter(addr => addr.id !== id));
        showSuccess('Địa chỉ đã được xóa thành công!');
      }
    );
  };

  const handleSetDefault = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showSuccess('Đã thiết lập làm địa chỉ mặc định!');
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      recipientName: address.recipientName,
      phone: address.phone,
      address: address.address
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Địa chỉ của tôi</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
        >
          <FaPlus className="text-sm" />
          Thêm địa chỉ mới
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Địa chỉ</h2>
        
        {addresses.map((address, index) => (
          <div key={address.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {address.recipientName}
                  </h3>
                  {address.isDefault && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded border border-red-500">
                      Mặc định
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-1">{address.phone}</p>
                <p className="text-gray-800">{address.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEdit(address)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Cập nhật
                </button>
                {!address.isDefault && (
                  <>
                    <button 
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                    <button 
                      onClick={() => handleSetDefault(address.id)}
                      className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-3 py-1 rounded"
                    >
                      Thiết lập mặc định
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Address Form */}
      {(showAddForm || editingAddress) && (
        <div className="mt-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={formData.recipientName}
                onChange={(e) => setFormData({...formData, recipientName: e.target.value})}
                placeholder="Nhập họ và tên người nhận"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Nhập số điện thoại"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ chi tiết
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Nhập địa chỉ chi tiết (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingAddress(null);
                setFormData({
                  recipientName: user?.name || user?.username || "",
                  phone: user?.phone || "",
                  address: ""
                });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
      
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

export default Address;
