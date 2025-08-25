import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { 
  FaArrowLeft,
  FaBell,
  FaEnvelope,
  FaShoppingCart,
  FaStar,
  FaUser,
  FaBox,
  FaTruck,
  FaCheck,
  FaTimes,
  FaTrash,
  FaFilter,
  FaSearch,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const PartnerNotifications = () => {
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [showRead, setShowRead] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  const [mockNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'Đơn hàng mới #ORD156',
      message: 'Khách hàng Nguyễn Văn A đã đặt hàng trị giá 450,000₫',
      timestamp: '2024-01-15T14:30:00',
      read: false,
      priority: 'high',
      action: 'view_order',
      actionData: { orderId: 'ORD156' }
    },
    {
      id: 2,
      type: 'product',
      title: 'Sản phẩm sắp hết hàng',
      message: 'Sản phẩm "Áo thun nam basic" chỉ còn 5 sản phẩm trong kho',
      timestamp: '2024-01-15T12:15:00',
      read: false,
      priority: 'medium',
      action: 'view_product',
      actionData: { productId: 1 }
    },
    {
      id: 3,
      type: 'review',
      title: 'Đánh giá mới 5 sao',
      message: 'Sản phẩm "Quần jean nữ" nhận được đánh giá 5 sao từ khách hàng',
      timestamp: '2024-01-15T10:45:00',
      read: true,
      priority: 'low',
      action: 'view_review',
      actionData: { productId: 2, reviewId: 15 }
    },
    {
      id: 4,
      type: 'customer',
      title: 'Khách hàng mới đăng ký',
      message: 'Trần Thị B đã đăng ký tài khoản mới',
      timestamp: '2024-01-15T09:20:00',
      read: true,
      priority: 'low',
      action: 'view_customer',
      actionData: { customerId: 45 }
    },
    {
      id: 5,
      type: 'order',
      title: 'Đơn hàng đã giao thành công',
      message: 'Đơn hàng #ORD155 đã được giao thành công cho khách hàng',
      timestamp: '2024-01-15T08:30:00',
      read: true,
      priority: 'medium',
      action: 'view_order',
      actionData: { orderId: 'ORD155' }
    },
    {
      id: 6,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật với các tính năng mới',
      timestamp: '2024-01-14T16:00:00',
      read: true,
      priority: 'low',
      action: 'view_update',
      actionData: { updateId: 'v2.1.0' }
    },
    {
      id: 7,
      type: 'promotion',
      title: 'Khuyến mãi mới',
      message: 'Chương trình khuyến mãi "Giảm giá 20%" đã được kích hoạt',
      timestamp: '2024-01-14T14:00:00',
      read: false,
      priority: 'high',
      action: 'view_promotion',
      actionData: { promotionId: 'PROMO001' }
    },
    {
      id: 8,
      type: 'order',
      title: 'Đơn hàng bị hủy',
      message: 'Đơn hàng #ORD154 đã bị khách hàng hủy',
      timestamp: '2024-01-14T11:30:00',
      read: false,
      priority: 'high',
      action: 'view_order',
      actionData: { orderId: 'ORD154' }
    }
  ]);

  useEffect(() => {
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, [mockNotifications]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'order': return <FaShoppingCart className="text-blue-500" />;
      case 'product': return <FaBox className="text-green-500" />;
      case 'review': return <FaStar className="text-yellow-500" />;
      case 'customer': return <FaUser className="text-purple-500" />;
      case 'system': return <FaBell className="text-gray-500" />;
      case 'promotion': return <FaEnvelope className="text-orange-500" />;
      default: return <FaBell className="text-gray-500" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-800';
      case 'product': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'customer': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      case 'promotion': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'order': return 'Đơn hàng';
      case 'product': return 'Sản phẩm';
      case 'review': return 'Đánh giá';
      case 'customer': return 'Khách hàng';
      case 'system': return 'Hệ thống';
      case 'promotion': return 'Khuyến mãi';
      default: return 'Khác';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Vừa xong';
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const handleAction = (notification) => {
    markAsRead(notification.id);
    
    switch (notification.action) {
      case 'view_order':
        // Navigate to order detail
        console.log('View order:', notification.actionData.orderId);
        break;
      case 'view_product':
        // Navigate to product detail
        console.log('View product:', notification.actionData.productId);
        break;
      case 'view_review':
        // Navigate to review
        console.log('View review:', notification.actionData);
        break;
      case 'view_customer':
        // Navigate to customer detail
        console.log('View customer:', notification.actionData.customerId);
        break;
      default:
        break;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesReadStatus = showRead || !notification.read;
    return matchesSearch && matchesType && matchesReadStatus;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/account/partner" className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
              <p className="text-gray-600 text-sm">
                {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : 'Tất cả thông báo đã đọc'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRead(!showRead)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showRead ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              <span>{showRead ? 'Ẩn đã đọc' : 'Hiện đã đọc'}</span>
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm thông báo..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tất cả loại</option>
                  <option value="order">Đơn hàng</option>
                  <option value="product">Sản phẩm</option>
                  <option value="review">Đánh giá</option>
                  <option value="customer">Khách hàng</option>
                  <option value="system">Hệ thống</option>
                  <option value="promotion">Khuyến mãi</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có thông báo</h3>
              <p className="text-gray-500">Không có thông báo nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getTypeIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <h3 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(notification.type)}`}>
                            {getTypeText(notification.type)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">{formatTime(notification.timestamp)}</span>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Xóa thông báo"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      
                      <div className="mt-3 flex items-center space-x-3">
                        <button
                          onClick={() => handleAction(notification)}
                          className="text-sm text-orange-600 hover:text-orange-800 font-medium transition-colors"
                        >
                          Xem chi tiết
                        </button>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            Đánh dấu đã đọc
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

        {/* Notification Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng thông báo</p>
                <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaBell className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chưa đọc</p>
                <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaEnvelope className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đơn hàng</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications.filter(n => n.type === 'order').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaShoppingCart className="text-green-500 text-xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đánh giá</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications.filter(n => n.type === 'review').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FaStar className="text-yellow-500 text-xl" />
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PartnerNotifications;
