import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCoins, FaGift, FaHistory, FaPlus, FaMinus } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const Coins = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Simulate loading coins data
    setTimeout(() => {
      setCoins(1250);
      setTransactions([
        {
          id: 1,
          type: "earn",
          amount: 500,
          description: "Mua sắm đơn hàng #12345",
          date: "2024-01-15",
          status: "completed"
        },
        {
          id: 2,
          type: "spend",
          amount: 200,
          description: "Đổi voucher giảm giá",
          date: "2024-01-10",
          status: "completed"
        },
        {
          id: 3,
          type: "earn",
          amount: 300,
          description: "Đánh giá sản phẩm",
          date: "2024-01-05",
          status: "completed"
        },
        {
          id: 4,
          type: "earn",
          amount: 450,
          description: "Mua sắm đơn hàng #12340",
          date: "2024-01-01",
          status: "completed"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getCoinValue = () => {
    return (coins * 100).toLocaleString(); // 1 coin = 100 VND
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">MuaSamViet Xu</h1>
        <p className="text-gray-600">Quản lý xu tích lũy và lịch sử giao dịch</p>
      </div>

      {/* Coin Balance Card */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaCoins className="text-2xl" />
              <h2 className="text-xl font-bold">Số xu hiện tại</h2>
            </div>
            <div className="text-3xl font-bold mb-1">{coins.toLocaleString()}</div>
            <div className="text-yellow-100">≈ {getCoinValue()} VND</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Giá trị</div>
            <div className="text-2xl font-bold">{getCoinValue()} VND</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => navigate('/user/rewards')}
          className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaGift className="text-lg" />
          <span>Đổi quà</span>
        </button>
        <button 
          onClick={() => navigate('/user/transaction-history')}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
        >
          <FaHistory className="text-lg" />
          <span>Lịch sử</span>
        </button>
      </div>

      {/* Transaction History */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch sử giao dịch</h3>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <FaHistory className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có giao dịch nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === 'earn' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'earn' ? <FaPlus /> : <FaMinus />}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                  </div>
                </div>
                <div className={`font-bold ${
                  transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'earn' ? '+' : '-'}{transaction.amount} xu
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to earn coins */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Cách kiếm xu</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FaCoins className="text-yellow-500" />
            <span>Mua sắm: 1₫ = 1 xu</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCoins className="text-yellow-500" />
            <span>Đánh giá sản phẩm: 50 xu/đánh giá</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCoins className="text-yellow-500" />
            <span>Giới thiệu bạn bè: 100 xu/người</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coins;

