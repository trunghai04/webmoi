import React, { useState, useContext, useEffect } from "react";
import { FaCoins, FaGift, FaExchangeAlt, FaCheck, FaTimes, FaStar, FaShoppingCart } from "react-icons/fa";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/AuthContext";

const Rewards = () => {
  const { user } = useContext(AuthContext);
  const [coins, setCoins] = useState(1250);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Simulate loading rewards data
    setTimeout(() => {
      setRewards([
        {
          id: 1,
          name: "Voucher giảm giá 50K",
          description: "Giảm giá 50.000₫ cho đơn hàng từ 500.000₫",
          coinsRequired: 500,
          type: "voucher",
          image: "https://via.placeholder.com/200x150/FF6B6B/FFFFFF?text=Voucher+50K",
          validUntil: "2024-12-31",
          stock: 100,
          isHot: true
        },
        {
          id: 2,
          name: "Voucher giảm giá 100K",
          description: "Giảm giá 100.000₫ cho đơn hàng từ 1.000.000₫",
          coinsRequired: 1000,
          type: "voucher",
          image: "https://via.placeholder.com/200x150/4ECDC4/FFFFFF?text=Voucher+100K",
          validUntil: "2024-12-31",
          stock: 50,
          isHot: true
        },
        {
          id: 3,
          name: "Miễn phí vận chuyển",
          description: "Miễn phí vận chuyển cho đơn hàng tiếp theo",
          coinsRequired: 200,
          type: "shipping",
          image: "https://via.placeholder.com/200x150/45B7D1/FFFFFF?text=Free+Shipping",
          validUntil: "2024-12-31",
          stock: 200,
          isHot: false
        },
        {
          id: 4,
          name: "Tai nghe Bluetooth",
          description: "Tai nghe không dây chất lượng cao",
          coinsRequired: 5000,
          type: "product",
          image: "https://via.placeholder.com/200x150/96CEB4/FFFFFF?text=Headphones",
          validUntil: "2024-12-31",
          stock: 10,
          isHot: false
        },
        {
          id: 5,
          name: "Voucher giảm giá 200K",
          description: "Giảm giá 200.000₫ cho đơn hàng từ 2.000.000₫",
          coinsRequired: 2000,
          type: "voucher",
          image: "https://via.placeholder.com/200x150/FFEAA7/000000?text=Voucher+200K",
          validUntil: "2024-12-31",
          stock: 25,
          isHot: true
        },
        {
          id: 6,
          name: "Sạc dự phòng 10.000mAh",
          description: "Pin sạc dự phòng công suất cao",
          coinsRequired: 8000,
          type: "product",
          image: "https://via.placeholder.com/200x150/DDA0DD/FFFFFF?text=Power+Bank",
          validUntil: "2024-12-31",
          stock: 5,
          isHot: false
        },
        {
          id: 7,
          name: "Ưu đãi đặc biệt",
          description: "Giảm giá 20% cho tất cả sản phẩm",
          coinsRequired: 1500,
          type: "discount",
          image: "https://via.placeholder.com/200x150/FFB6C1/000000?text=20%+Off",
          validUntil: "2024-12-31",
          stock: 75,
          isHot: true
        },
        {
          id: 8,
          name: "Túi xách thời trang",
          description: "Túi xách đeo chéo phong cách",
          coinsRequired: 12000,
          type: "product",
          image: "https://via.placeholder.com/200x150/F8BBD9/000000?text=Bag",
          validUntil: "2024-12-31",
          stock: 3,
          isHot: false
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getFilteredRewards = () => {
    if (filter === 'all') return rewards;
    return rewards.filter(reward => reward.type === filter);
  };

  const handleExchange = (reward) => {
    if (coins < reward.coinsRequired) {
      toast.error("Không đủ xu để đổi quà này!");
      return;
    }
    setSelectedReward(reward);
    setShowConfirmModal(true);
  };

  const confirmExchange = () => {
    if (!selectedReward) return;
    
    // Simulate API call
    setTimeout(() => {
      setCoins(prev => prev - selectedReward.coinsRequired);
      setRewards(prev => prev.map(reward => 
        reward.id === selectedReward.id 
          ? { ...reward, stock: reward.stock - 1 }
          : reward
      ));
      toast.success(`Đã đổi thành công "${selectedReward.name}"!`);
      setShowConfirmModal(false);
      setSelectedReward(null);
    }, 1000);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'voucher': return 'bg-green-100 text-green-800';
      case 'shipping': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-purple-100 text-purple-800';
      case 'discount': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'voucher': return <FaGift />;
      case 'shipping': return <FaShoppingCart />;
      case 'product': return <FaStar />;
      case 'discount': return <FaExchangeAlt />;
      default: return <FaGift />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đổi quà</h1>
        <p className="text-gray-600">Sử dụng xu để đổi lấy các phần thưởng hấp dẫn</p>
      </div>

      {/* Coin Balance */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaCoins className="text-2xl" />
            <span className="text-lg font-bold">Xu hiện tại: {coins.toLocaleString()}</span>
          </div>
          <div className="text-sm opacity-90">≈ {(coins * 100).toLocaleString()} VND</div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter('voucher')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'voucher' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Voucher
          </button>
          <button
            onClick={() => setFilter('product')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'product' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sản phẩm
          </button>
          <button
            onClick={() => setFilter('shipping')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'shipping' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Vận chuyển
          </button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getFilteredRewards().map((reward) => (
          <div key={reward.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-full h-48 object-cover"
              />
              {reward.isHot && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  HOT
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reward.type)}`}>
                  {getTypeIcon(reward.type)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">{reward.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{reward.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-yellow-600">
                  <FaCoins />
                  <span className="font-bold">{reward.coinsRequired.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Còn lại: {reward.stock}
                </div>
              </div>
              
              <button
                onClick={() => handleExchange(reward)}
                disabled={coins < reward.coinsRequired || reward.stock === 0}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  coins >= reward.coinsRequired && reward.stock > 0
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {coins >= reward.coinsRequired && reward.stock > 0 ? 'Đổi ngay' : 'Không đủ xu'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {getFilteredRewards().length === 0 && (
        <div className="text-center py-12">
          <FaGift className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Không có quà nào</h3>
          <p className="text-gray-500">Hiện tại không có quà nào trong danh mục này</p>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <FaGift className="text-4xl text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Xác nhận đổi quà</h3>
              <p className="text-gray-600">Bạn có chắc chắn muốn đổi quà này?</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={selectedReward.image}
                  alt={selectedReward.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="font-bold text-gray-800">{selectedReward.name}</h4>
                  <p className="text-sm text-gray-600">{selectedReward.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Số xu cần:</span>
                <span className="font-bold text-yellow-600 flex items-center gap-1">
                  <FaCoins />
                  {selectedReward.coinsRequired.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Xu hiện tại:</span>
                <span className="font-bold text-gray-800">{coins.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1">
                <span className="text-gray-600">Xu còn lại:</span>
                <span className="font-bold text-green-600">
                  {(coins - selectedReward.coinsRequired).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmExchange}
                className="flex-1 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
