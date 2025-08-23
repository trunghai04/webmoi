import React, { useContext, useState } from "react";
import { FaSearch, FaEye, FaShoppingBag, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";
import { getProductImage, handleImageError } from "../../../utils/imageUtils";

const Orders = () => {
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [orders] = useState([
    {
      id: 'DH001',
      date: '2024-01-15',
      status: 'delivered',
      total: 1250000,
      items: [
        {
          name: 'iPhone 15 Pro Max 256GB',
          price: 1200000,
          quantity: 1,
          image: getProductImage('/api/placeholder/80/80', 80, 80)
        }
      ],
      address: 'Số 123, Đường ABC, Quận 1, TP.HCM'
    },
    {
      id: 'DH002', 
      date: '2024-01-20',
      status: 'shipping',
      total: 850000,
      items: [
        {
          name: 'Samsung Galaxy Watch 6',
          price: 800000,
          quantity: 1,
          image: getProductImage('/api/placeholder/80/80', 80, 80)
        }
      ],
      address: 'Số 456, Đường XYZ, Quận 2, TP.HCM'
    },
    {
      id: 'DH003',
      date: '2024-01-25', 
      status: 'pending',
      total: 2100000,
      items: [
        {
          name: 'MacBook Air M2 13inch',
          price: 2000000,
          quantity: 1,
          image: getProductImage('/api/placeholder/80/80', 80, 80)
        }
      ],
      address: 'Số 789, Đường DEF, Quận 3, TP.HCM'
    },
    {
      id: 'DH004',
      date: '2024-01-10',
      status: 'cancelled',
      total: 450000,
      items: [
        {
          name: 'AirPods Pro 2nd Gen',
          price: 400000,
          quantity: 1,
          image: getProductImage('/api/placeholder/80/80', 80, 80)
        }
      ],
      address: 'Số 101, Đường GHI, Quận 4, TP.HCM'
    }
  ]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: orders.length },
    { id: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length },
    { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
    { id: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Chờ xử lý', 
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: FaShoppingBag
        };
      case 'shipping':
        return { 
          label: 'Đang giao', 
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: FaTruck
        };
      case 'delivered':
        return { 
          label: 'Đã giao', 
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: FaCheckCircle
        };
      case 'cancelled':
        return { 
          label: 'Đã hủy', 
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: FaTimesCircle
        };
      default:
        return { 
          label: 'Không xác định', 
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: FaShoppingBag
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Đơn Mua</h1>
        <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <FaShoppingBag className="mx-auto text-4xl text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
            <p className="text-gray-500">
              {searchQuery ? 'Không tìm thấy đơn hàng phù hợp' : 'Bạn chưa có đơn hàng nào trong danh mục này'}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">Đơn hàng #{order.id}</h3>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-full ${statusInfo.color}`}>
                        <StatusIcon className="text-xs" />
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">{formatPrice(order.total)}</p>
                    <button className="mt-2 inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                      <FaEye className="text-xs" />
                      Chi tiết
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => handleImageError(e, getProductImage(null, 80, 80))}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm text-gray-600">Số lượng: {item.quantity}</span>
                          <span className="font-medium text-gray-800">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Address */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Địa chỉ giao hàng:</span> {order.address}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Orders;
