import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

import Footer from '../../components/Footer';
import { getProductImage, handleImageError } from '../../utils/imageUtils';
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaPrint,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaSearch,
  FaFilter,
  FaCalendarAlt
} from 'react-icons/fa';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);


  // Mock order data
  const mockOrders = [
    {
      id: 'ORD001',
      orderDate: new Date('2024-01-15'),
      status: 'delivered',
      statusText: 'Đã giao hàng',
      total: 29990000,
      items: [
        {
          id: 1,
          name: 'iPhone 15 Pro Max',
          price: 29990000,
          quantity: 1,
          image: getProductImage('https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', 80, 80)
        }
      ],
      shippingAddress: {
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      paymentMethod: 'COD',
      trackingNumber: 'TRK123456789',
      deliveredDate: new Date('2024-01-18'),
      canReview: true
    },
    {
      id: 'ORD002',
      orderDate: new Date('2024-01-10'),
      status: 'shipping',
      statusText: 'Đang giao hàng',
      total: 25990000,
      items: [
        {
          id: 2,
          name: 'MacBook Air M2',
          price: 25990000,
          quantity: 1,
          image: getProductImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 80, 80)
        }
      ],
      shippingAddress: {
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      paymentMethod: 'Credit Card',
      trackingNumber: 'TRK987654321',
      estimatedDelivery: new Date('2024-01-20'),
      canReview: false
    },
    {
      id: 'ORD003',
      orderDate: new Date('2024-01-05'),
      status: 'processing',
      statusText: 'Đang xử lý',
      total: 5990000,
      items: [
        {
          id: 4,
          name: 'AirPods Pro 2',
          price: 5990000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400'
        }
      ],
      shippingAddress: {
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      paymentMethod: 'Bank Transfer',
      canReview: false
    },
    {
      id: 'ORD004',
      orderDate: new Date('2024-01-01'),
      status: 'cancelled',
      statusText: 'Đã hủy',
      total: 27990000,
      items: [
        {
          id: 3,
          name: 'Samsung Galaxy S24 Ultra',
          price: 27990000,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'
        }
      ],
      shippingAddress: {
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      paymentMethod: 'COD',
      cancelReason: 'Thay đổi ý định mua hàng',
      canReview: false
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/user/orders' } });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);



  // Filter orders
  useEffect(() => {
    let filtered = orders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-100';
      case 'shipping':
        return 'text-blue-600 bg-blue-100';
      case 'processing':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }, []);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'shipping':
        return <FaTruck className="text-blue-600" />;
      case 'processing':
        return <FaBox className="text-yellow-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaBox className="text-gray-600" />;
    }
  }, []);

  const handleViewOrderDetail = useCallback((order) => {
    navigate(`/user/orders/${order.id}`);
  }, [navigate]);



  const handleDownloadInvoice = useCallback((orderId) => {
    toast.info('Đang tải hóa đơn...');
    setTimeout(() => {
      toast.success('Đã tải hóa đơn thành công!');
    }, 2000);
  }, []);

  const handlePrintInvoice = useCallback((orderId) => {
    window.print();
  }, []);

  const handleReviewProduct = useCallback((orderId, itemId) => {
    navigate(`/product/${itemId}?review=true`);
  }, [navigate]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  }, []);

  const formatDate = useCallback((date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }, []);

  const renderStars = useCallback((rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch sử đơn hàng</h1>
            <p className="text-gray-600">Theo dõi tất cả đơn hàng của bạn</p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                  <option value="">Tất cả thời gian</option>
                  <option value="7">7 ngày qua</option>
                  <option value="30">30 ngày qua</option>
                  <option value="90">3 tháng qua</option>
                  <option value="365">1 năm qua</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Chưa có đơn hàng nào
              </h2>
              <p className="text-gray-500 mb-6">
                Bạn chưa có đơn hàng nào trong lịch sử
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Mua sắm ngay
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{order.id}</h3>
                          <p className="text-gray-600">{formatDate(order.orderDate)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          {formatPrice(order.total)}
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.statusText}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md"
                            onError={(e) => handleImageError(e, getProductImage(null, 80, 80))}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-gray-600">Số lượng: {item.quantity}</p>
                            <p className="text-gray-800 font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                          {order.canReview && order.status === 'delivered' && (
                            <button
                              onClick={() => handleReviewProduct(order.id, item.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                            >
                              Đánh giá
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleViewOrderDetail(order)}
                          className="flex items-center text-blue-600 hover:text-blue-700 cursor-pointer px-3 py-1 rounded hover:bg-blue-50"
                          type="button"
                        >
                          <FaEye className="mr-2" />
                          Xem chi tiết
                        </button>

                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="flex items-center text-gray-600 hover:text-gray-700"
                        >
                          <FaDownload className="mr-2" />
                          Tải hóa đơn
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(order.id)}
                          className="flex items-center text-gray-600 hover:text-gray-700"
                        >
                          <FaPrint className="mr-2" />
                          In hóa đơn
                        </button>
                      </div>
                      
                      {order.trackingNumber && (
                        <div className="text-sm text-gray-600">
                          Mã theo dõi: <span className="font-medium">{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderHistory;
