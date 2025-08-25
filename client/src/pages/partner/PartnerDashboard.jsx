import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingActions from '../../components/FloatingActions';
import { 
  FaStore, 
  FaChartLine, 
  FaBox, 
  FaShoppingCart, 
  FaUsers, 
  FaMoneyBillWave,
  FaStar,
  FaEye,
  FaEdit,
  FaPlus,
  FaTruck,
  FaBell,
  FaCog,

  FaChevronRight,
  FaArrowUp,
  FaArrowDown,
  FaPercent
} from 'react-icons/fa';

const PartnerDashboard = () => {
  const { user, logout, isAuthenticated, isReady } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);

  // Show loading while auth is not ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Redirect to login after auth is ready and unauthenticated
  useEffect(() => {
    if (isReady && isAuthenticated === false) {
      navigate('/auth/login', { replace: true });
    }
  }, [isReady, isAuthenticated, navigate]);

  // While waiting for redirect decision, show a minimal loader instead of a blank screen
  if (isReady && isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  // Mock data for dashboard
  const [dashboardData] = useState({
    totalSales: 12500000,
    totalOrders: 156,
    totalProducts: 89,
    totalCustomers: 234,
    salesGrowth: 12.5,
    orderGrowth: -2.3,
    topProducts: [
      { id: 1, name: 'Áo thun nam', sales: 45, revenue: 2250000, growth: 8.2 },
      { id: 2, name: 'Quần jean nữ', sales: 38, revenue: 1900000, growth: 15.7 },
      { id: 3, name: 'Váy đầm', sales: 32, revenue: 1600000, growth: -3.1 },
      { id: 4, name: 'Giày sneaker', sales: 28, revenue: 1400000, growth: 22.4 },
      { id: 5, name: 'Túi xách', sales: 25, revenue: 1250000, growth: 5.8 }
    ],
    recentOrders: [
      { id: 'ORD001', customer: 'Nguyễn Văn A', amount: 450000, status: 'Đã giao', date: '2024-01-15' },
      { id: 'ORD002', customer: 'Trần Thị B', amount: 320000, status: 'Đang giao', date: '2024-01-14' },
      { id: 'ORD003', customer: 'Lê Văn C', amount: 780000, status: 'Chờ xử lý', date: '2024-01-14' },
      { id: 'ORD004', customer: 'Phạm Thị D', amount: 290000, status: 'Đã giao', date: '2024-01-13' },
      { id: 'ORD005', customer: 'Hoàng Văn E', amount: 560000, status: 'Đang giao', date: '2024-01-13' }
    ]
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const getStatusColor = (status) => {
    switch (status) {
      case 'Đã giao': return 'text-green-600 bg-green-100';
      case 'Đang giao': return 'text-blue-600 bg-blue-100';
      case 'Chờ xử lý': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Load partner store info (name, avatar) after auth is ready
  useEffect(() => {
    const loadStore = async () => {
      try {
        const auth = localStorage.getItem('msv_auth');
        if (!auth) return;
        const { token } = JSON.parse(auth);
        const response = await fetch('http://localhost:5000/api/partner/store', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStore(data.data);
        }
      } catch (err) {
        // noop
      } finally {
        setLoadingStore(false);
      }
    };
    if (isReady && isAuthenticated) {
      loadStore();
    }
  }, [isReady, isAuthenticated]);

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
        hideLogoShrink={false}
        hideTopNav={true}

      />

      {/* Spacer for header */}
      <div className="h-16 md:h-20 lg:h-24"></div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
              {store?.avatar_url ? (
                <img src={store.avatar_url} alt="Store Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-orange-600 font-bold text-xl">
                  {(store?.store_name || user?.username || 'S')[0]}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {loadingStore ? 'Đang tải cửa hàng...' : (store?.store_name || 'Cửa hàng của bạn')}
              </h1>
              <p className="text-gray-600 mt-1">
                Chào mừng trở lại, {user?.username || 'Partner'}!
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Link 
                  to={`/store/${store?.id || 1}`} 
                  className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
                >
                  <FaEye className="text-xs" />
                  Xem trang cửa hàng
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">

            <Link to="/account/partner/products" className="px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors font-medium" title="Quản lý sản phẩm">
              Sản phẩm
            </Link>
            <Link to="/account/partner/orders" className="px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors font-medium" title="Quản lý đơn hàng">
              Đơn hàng
            </Link>
            <Link to="/account/partner/analytics" className="px-3 py-2 text-gray-600 hover:text-orange-500 transition-colors font-medium" title="Phân tích">
              Phân tích
            </Link>
            <Link to="/account/partner/notifications" className="p-2 text-gray-600 hover:text-orange-500 transition-colors" title="Thông báo">
              <FaBell className="text-xl" />
            </Link>
            <Link to="/account/partner/settings" className="p-2 text-gray-600 hover:text-orange-500 transition-colors" title="Cài đặt">
              <FaCog className="text-xl" />
          </Link>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">₫{(dashboardData.totalSales / 1000000).toFixed(1)}M</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+{dashboardData.salesGrowth}%</span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaMoneyBillWave className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.totalOrders}</p>
                <div className="flex items-center mt-2">
                  <FaArrowDown className="text-red-500 text-sm mr-1" />
                  <span className="text-red-500 text-sm font-medium">{dashboardData.orderGrowth}%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaShoppingCart className="text-blue-500 text-2xl" />
              </div>
        </div>
      </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.totalProducts}</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+5.2%</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaBox className="text-green-500 text-2xl" />
              </div>
            </div>
      </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Khách hàng</p>
                <p className="text-2xl font-bold text-gray-800">{dashboardData.totalCustomers}</p>
                <div className="flex items-center mt-2">
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                  <span className="text-green-500 text-sm font-medium">+8.7%</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUsers className="text-purple-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Sản phẩm bán chạy</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} đã bán</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₫{(product.revenue / 1000).toFixed(0)}K</p>
                      <div className="flex items-center">
                        {product.growth > 0 ? (
                          <FaArrowUp className="text-green-500 text-xs mr-1" />
                        ) : (
                          <FaArrowDown className="text-red-500 text-xs mr-1" />
                        )}
                        <span className={`text-xs font-medium ${product.growth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
      </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">₫{order.amount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Phân tích chi tiết</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sales Trend */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-blue-800">Xu hướng bán hàng</h3>
                <FaChartLine className="text-blue-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Tuần này:</span>
                  <span className="font-medium">+15.2%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Tháng này:</span>
                  <span className="font-medium">+8.7%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Quý này:</span>
                  <span className="font-medium">+12.3%</span>
                </div>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-green-800">Khách hàng</h3>
                <FaUsers className="text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Khách mới:</span>
                  <span className="font-medium">45</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Khách quay lại:</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Đánh giá TB:</span>
                  <span className="font-medium">4.6/5</span>
                </div>
              </div>
            </div>

            {/* Inventory Status */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-800">Tồn kho</h3>
                <FaBox className="text-orange-600" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-orange-700">Sản phẩm:</span>
                  <span className="font-medium">89</span>
                </div>
                                 <div className="flex justify-between text-sm">
                   <span className="text-orange-700">Sắp hết:</span>
                   <span className="font-medium text-orange-600">3</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-orange-700">Hết hàng:</span>
                   <span className="font-medium text-red-600">1</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingActions hideCart={true} />
    </div>
  );
};

export default PartnerDashboard;
