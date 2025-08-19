import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

const Address = () => {
  const [addresses] = useState([
    {
      id: 1,
      recipientName: "Trung Hải Đặng",
      phone: "(+84) 366 292 402",
      address: "Fagi Land Yên Xá, Số 9, Hẻm 87/59/24 Yên Xá Xã Tân Triều, Huyện Thanh Trì, Hà Nội",
      isDefault: true
    },
    {
      id: 2,
      recipientName: "hai dang",
      phone: "(+84) 986 555 288",
      address: "Chợ Kênh 7, Đường Nam Cây Dương, Tổ 3 Ấp Bình Thạnh Xã Bình Chánh, Huyện Châu Phú, An Giang",
      isDefault: false
    }
  ]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Địa chỉ của tôi</h1>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
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
                <button className="text-blue-600 hover:text-blue-700 text-sm">
                  Cập nhật
                </button>
                {!address.isDefault && (
                  <>
                    <button className="text-blue-600 hover:text-blue-700 text-sm">
                      Xóa
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 text-sm border border-gray-300 px-3 py-1 rounded">
                      Thiết lập mặc định
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Address;
