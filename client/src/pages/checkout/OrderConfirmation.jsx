import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { 
  FaCheckCircle, 
  FaTruck, 
  FaCreditCard, 
  FaEnvelope,
  FaPhone,
  FaHome,
  FaArrowLeft,
  FaDownload,
  FaPrint,
  FaShare,
  FaWhatsapp,
  FaFacebook,
  FaTwitter
} from 'react-icons/fa';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const [orderData, setOrderData] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.orderId && location.state?.orderSummary) {
      setOrderData({
        orderId: location.state.orderId,
        orderSummary: location.state.orderSummary,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        trackingNumber: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
      });
    } else {
      // Redirect if no order data
      navigate('/');
      toast.error('Không tìm thấy thông tin đơn hàng');
    }
  }, [location.state, navigate]);

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
    }).format(date);
  };

  const handleDownloadInvoice = () => {
    // Simulate download
    toast.info('Đang tải hóa đơn...');
    setTimeout(() => {
      toast.success('Đã tải hóa đơn thành công!');
    }, 2000);
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Đơn hàng của tôi - MuaSamViet',
        text: `Tôi vừa đặt hàng thành công với mã đơn hàng: ${orderData?.orderId}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link vào clipboard!');
    }
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleTrackOrder = () => {
    navigate('/user/orders');
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFixed={true}
        hideSearch={true}
        hideLogoShrink={true}
        hideTopNav={true}
      />

      {/* Spacer for header */}
      <div className="h-20 md:h-24 lg:h-32"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-8 text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <FaCheckCircle className="text-6xl text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Đặt hàng thành công!
            </h1>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã mua sắm tại MuaSamViet. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-blue-800 font-medium">
                Mã đơn hàng: <span className="font-bold">{orderData.orderId}</span>
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <FaTruck className="mr-3 text-blue-600" />
                  Thông tin đơn hàng
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn hàng</p>
                    <p className="font-medium">{orderData.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                    <p className="font-medium">{formatDate(new Date())}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã theo dõi</p>
                    <p className="font-medium">{orderData.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dự kiến giao hàng</p>
                    <p className="font-medium">{formatDate(orderData.estimatedDelivery)}</p>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(orderData.orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(orderData.orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>{formatPrice(orderData.orderSummary.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-3">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(orderData.orderSummary.total)}</span>
                  </div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-bold mb-4">Các bước tiếp theo</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Xác nhận đơn hàng</h3>
                      <p className="text-gray-600 text-sm">Chúng tôi sẽ gửi email xác nhận trong vòng 24 giờ</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Chuẩn bị hàng</h3>
                      <p className="text-gray-600 text-sm">Đơn hàng sẽ được chuẩn bị và đóng gói</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Giao hàng</h3>
                      <p className="text-gray-600 text-sm">Đơn hàng sẽ được giao trong 2-3 ngày làm việc</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="font-bold mb-4">Thao tác</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={handleTrackOrder}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Theo dõi đơn hàng
                  </button>
                  
                  <button
                    onClick={handleContinueShopping}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Tiếp tục mua sắm
                  </button>
                  
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaDownload className="mr-2" />
                    Tải hóa đơn
                  </button>
                  
                  <button
                    onClick={handlePrintInvoice}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaPrint className="mr-2" />
                    In hóa đơn
                  </button>
                  
                  <button
                    onClick={handleShareOrder}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <FaShare className="mr-2" />
                    Chia sẻ
                  </button>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="font-bold mb-4">Liên hệ hỗ trợ</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaPhone className="text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Hotline</p>
                      <p className="text-sm text-gray-600">1900-1234</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaEnvelope className="text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">support@muasamviet.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaHome className="text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Địa chỉ</p>
                      <p className="text-sm text-gray-600">123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h3 className="font-bold mb-4">Theo dõi chúng tôi</h3>
                
                <div className="flex space-x-3">
                  <button className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition-colors">
                    <FaWhatsapp />
                  </button>
                  <button className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                    <FaFacebook />
                  </button>
                  <button className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors">
                    <FaTwitter />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center text-blue-600 hover:text-blue-700"
            >
              <FaArrowLeft className="mr-2" />
              Quay lại trang chủ
            </button>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
