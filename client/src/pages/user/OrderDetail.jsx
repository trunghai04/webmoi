import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaTimesCircle,
  FaDownload,
  FaPrint,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
  FaPhone,
  FaCheck,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa';

const OrderDetail = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock order data
  const mockOrders = {
    'ORD001': {
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
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
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
    'ORD002': {
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
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
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
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: `/user/orders/${orderId}` } });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders[orderId];
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error('Không tìm thấy đơn hàng!');
        navigate('/user/orders');
      }
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate, orderId]);

  const getStatusColor = (status) => {
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
  };

  const getStatusIcon = (status) => {
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
  };

  const handleDownloadInvoice = (orderId) => {
    toast.info('Đang tải hóa đơn...');
    setTimeout(() => {
      toast.success('Đã tải hóa đơn thành công!');
    }, 2000);
  };

  const handlePrintInvoice = (orderId) => {
    window.print();
  };

  const handleReviewProduct = (orderId, itemId) => {
    navigate(`/product/${itemId}?review=true`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Không tìm thấy đơn hàng</h2>
          <p className="text-gray-500 mb-6">Đơn hàng bạn đang tìm kiếm không tồn tại</p>
          <button
            onClick={() => navigate('/user/orders')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách đơn hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isOrderPage={true} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/user/orders')}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <FaArrowLeft className="mr-2" />
              Quay lại danh sách đơn hàng
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết đơn hàng {order.id}</h1>
            <p className="text-gray-600">Thông tin chi tiết về đơn hàng của bạn</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div>
              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold mb-4 text-lg">Trạng thái đơn hàng</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{order.statusText}</h4>
                    <p className="text-gray-600">Đặt hàng: {formatDate(order.orderDate)}</p>
                  </div>
                </div>
                
                {/* Order Progress */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-xs" />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">Đặt hàng thành công</p>
                        <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>
                    
                    {order.status !== 'cancelled' && (
                      <>
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            ['processing', 'shipping', 'delivered'].includes(order.status) 
                              ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {['processing', 'shipping', 'delivered'].includes(order.status) && (
                              <FaCheck className="text-white text-xs" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Đang xử lý</p>
                            <p className="text-sm text-gray-500">Đơn hàng đang được chuẩn bị</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            ['shipping', 'delivered'].includes(order.status) 
                              ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {['shipping', 'delivered'].includes(order.status) && (
                              <FaCheck className="text-white text-xs" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Đang giao hàng</p>
                            <p className="text-sm text-gray-500">
                              {order.trackingNumber && `Mã theo dõi: ${order.trackingNumber}`}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {order.status === 'delivered' && (
                              <FaCheck className="text-white text-xs" />
                            )}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">Đã giao hàng</p>
                            <p className="text-sm text-gray-500">
                              {order.deliveredDate && formatDate(order.deliveredDate)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold mb-4 text-lg flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-blue-600" />
                  Thông tin giao hàng
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                    <p className="text-gray-600 flex items-center">
                      <FaPhone className="mr-2 text-gray-400" />
                      {order.shippingAddress.phone}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-gray-400" />
                      {order.shippingAddress.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div>
              {/* Payment Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold mb-4 text-lg">Thông tin thanh toán</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phương thức:</span>
                      <span className="font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền hàng:</span>
                      <span className="font-medium">{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span className="font-medium">Miễn phí</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-orange-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="font-bold mb-4 text-lg">Sản phẩm đã đặt</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                        <p className="text-gray-800 font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      {order.canReview && order.status === 'delivered' && (
                        <button
                          onClick={() => handleReviewProduct(order.id, item.id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Đánh giá
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('/user/orders')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => handleDownloadInvoice(order.id)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Tải hóa đơn
              </button>
              <button
                onClick={() => handlePrintInvoice(order.id)}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                In hóa đơn
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderDetail;
