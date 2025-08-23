import React, { useState, useContext, useEffect } from "react";
import { FaGift, FaCalendarAlt, FaPercent, FaTag } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const Vouchers = () => {
  const { user } = useContext(AuthContext);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading vouchers
    setTimeout(() => {
      setVouchers([
        {
          id: 1,
          code: "SALE50",
          title: "Giảm 50% cho đơn hàng đầu tiên",
          description: "Áp dụng cho tất cả sản phẩm",
          discount: "50%",
          minOrder: "100,000₫",
          validUntil: "2024-12-31",
          isUsed: false,
          type: "percentage"
        },
        {
          id: 2,
          code: "FREESHIP",
          title: "Miễn phí vận chuyển",
          description: "Áp dụng cho đơn hàng từ 500,000₫",
          discount: "Miễn phí",
          minOrder: "500,000₫",
          validUntil: "2024-11-30",
          isUsed: false,
          type: "shipping"
        },
        {
          id: 3,
          code: "NEWUSER",
          title: "Giảm 100,000₫ cho người dùng mới",
          description: "Áp dụng cho đơn hàng từ 200,000₫",
          discount: "100,000₫",
          minOrder: "200,000₫",
          validUntil: "2024-10-31",
          isUsed: true,
          type: "amount"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    // You can add a toast notification here
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Kho Voucher</h1>
        <p className="text-gray-600">Quản lý voucher và mã giảm giá của bạn</p>
      </div>

      {vouchers.length === 0 ? (
        <div className="text-center py-12">
          <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có voucher nào</h3>
          <p className="text-gray-500">Bạn sẽ nhận được voucher khi mua sắm hoặc tham gia các chương trình khuyến mãi</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                voucher.isUsed
                  ? "bg-gray-50 border-gray-200 opacity-60"
                  : "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FaGift className={`text-lg ${voucher.isUsed ? 'text-gray-400' : 'text-orange-500'}`} />
                    <h3 className="font-semibold text-gray-800">{voucher.title}</h3>
                    {voucher.isUsed && (
                      <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        Đã sử dụng
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{voucher.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <FaPercent className="text-orange-500" />
                      <span className="font-medium text-orange-600">{voucher.discount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTag className="text-gray-500" />
                      <span>Từ {voucher.minOrder}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <FaCalendarAlt />
                    <span>Hạn sử dụng: {voucher.validUntil}</span>
                  </div>
                </div>
                
                <div className="ml-4 text-right">
                  <div className="bg-white border-2 border-dashed border-orange-300 rounded-lg p-3 mb-2">
                    <div className="font-mono font-bold text-lg text-orange-600">{voucher.code}</div>
                  </div>
                  {!voucher.isUsed && (
                    <button
                      onClick={() => copyToClipboard(voucher.code)}
                      className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors"
                    >
                      Sao chép
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Vouchers;

