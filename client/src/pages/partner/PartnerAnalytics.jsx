import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { 
  FaArrowLeft,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaStar,
  FaEye,
  FaArrowUp,
  FaArrowDown,
  FaCalendar,
  FaDownload,
  FaFilter
} from 'react-icons/fa';

const PartnerAnalytics = () => {
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);

  // Mock analytics data
  const [analyticsData] = useState({
    overview: {
      totalRevenue: 12500000,
      totalOrders: 156,
      totalProducts: 89,
      totalCustomers: 234,
      revenueGrowth: 12.5,
      orderGrowth: -2.3,
      customerGrowth: 8.7,
      productGrowth: 5.2
    },
    salesData: [
      { date: '2024-01-01', revenue: 450000, orders: 12, customers: 8 },
      { date: '2024-01-02', revenue: 520000, orders: 15, customers: 10 },
      { date: '2024-01-03', revenue: 380000, orders: 11, customers: 7 },
      { date: '2024-01-04', revenue: 610000, orders: 18, customers: 12 },
      { date: '2024-01-05', revenue: 480000, orders: 14, customers: 9 },
      { date: '2024-01-06', revenue: 720000, orders: 22, customers: 15 },
      { date: '2024-01-07', revenue: 550000, orders: 16, customers: 11 },
      { date: '2024-01-08', revenue: 680000, orders: 20, customers: 13 },
      { date: '2024-01-09', revenue: 420000, orders: 13, customers: 8 },
      { date: '2024-01-10', revenue: 590000, orders: 17, customers: 11 },
      { date: '2024-01-11', revenue: 750000, orders: 23, customers: 16 },
      { date: '2024-01-12', revenue: 510000, orders: 15, customers: 10 },
      { date: '2024-01-13', revenue: 640000, orders: 19, customers: 12 },
      { date: '2024-01-14', revenue: 470000, orders: 14, customers: 9 },
      { date: '2024-01-15', revenue: 690000, orders: 21, customers: 14 }
    ],
    topProducts: [
      { id: 1, name: 'Áo thun nam', sales: 45, revenue: 2250000, growth: 8.2, rating: 4.5 },
      { id: 2, name: 'Quần jean nữ', sales: 38, revenue: 1900000, growth: 15.7, rating: 4.3 },
      { id: 3, name: 'Váy đầm', sales: 32, revenue: 1600000, growth: -3.1, rating: 4.7 },
      { id: 4, name: 'Giày sneaker', sales: 28, revenue: 1400000, growth: 22.4, rating: 4.6 },
      { id: 5, name: 'Túi xách', sales: 25, revenue: 1250000, growth: 5.8, rating: 4.4 }
    ],
    categoryPerformance: [
      { category: 'Thời trang nam', revenue: 4500000, percentage: 36, growth: 12.5 },
      { category: 'Thời trang nữ', revenue: 3800000, percentage: 30.4, growth: 8.7 },
      { category: 'Giày dép', revenue: 2200000, percentage: 17.6, growth: 15.2 },
      { category: 'Túi xách', revenue: 1250000, percentage: 10, growth: 5.8 },
      { category: 'Phụ kiện', revenue: 750000, percentage: 6, growth: -2.1 }
    ],
    customerInsights: {
      newCustomers: 45,
      returningCustomers: 189,
      averageOrderValue: 80128,
      customerSatisfaction: 4.6,
      topCustomerSegments: [
        { segment: 'Khách hàng VIP', count: 23, revenue: 3800000 },
        { segment: 'Khách hàng thường xuyên', count: 67, revenue: 4200000 },
        { segment: 'Khách hàng mới', count: 45, revenue: 1800000 },
        { segment: 'Khách hàng không thường xuyên', count: 99, revenue: 2700000 }
      ]
    }
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <FaArrowUp className="text-sm" /> : <FaArrowDown className="text-sm" />;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu phân tích...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Phân tích chi tiết</h1>
              <p className="text-gray-600 text-sm">Thống kê và báo cáo hiệu suất kinh doanh</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
                <option value="1year">1 năm qua</option>
              </select>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              <FaDownload className="text-sm" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                    {analyticsData.overview.revenueGrowth > 0 ? '+' : ''}{analyticsData.overview.revenueGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <FaDollarSign className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đơn hàng</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalOrders}</p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analyticsData.overview.orderGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.orderGrowth)}`}>
                    {analyticsData.overview.orderGrowth > 0 ? '+' : ''}{analyticsData.overview.orderGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaShoppingCart className="text-blue-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Khách hàng</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalCustomers}</p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analyticsData.overview.customerGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.customerGrowth)}`}>
                    {analyticsData.overview.customerGrowth > 0 ? '+' : ''}{analyticsData.overview.customerGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaUsers className="text-purple-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalProducts}</p>
                <div className="flex items-center mt-2">
                  {getGrowthIcon(analyticsData.overview.productGrowth)}
                  <span className={`text-sm font-medium ml-1 ${getGrowthColor(analyticsData.overview.productGrowth)}`}>
                    {analyticsData.overview.productGrowth > 0 ? '+' : ''}{analyticsData.overview.productGrowth}%
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FaBox className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Biểu đồ doanh thu</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaChartLine className="text-orange-500" />
                <span>15 ngày qua</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.salesData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
                    style={{ height: `${(data.revenue / 750000) * 200}px` }}
                    title={`${new Date(data.date).toLocaleDateString('vi-VN')}: ${formatCurrency(data.revenue)}`}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2 text-center">
                    {new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Doanh thu theo ngày (₫)
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Hiệu suất danh mục</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaChartPie className="text-blue-500" />
                <span>Theo doanh thu</span>
              </div>
            </div>
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                    <span className="text-sm font-medium text-gray-800">{category.category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">{formatCurrency(category.revenue)}</div>
                    <div className="text-sm font-medium text-gray-800">{category.percentage}%</div>
                    <div className={`text-sm font-medium ${getGrowthColor(category.growth)}`}>
                      {category.growth > 0 ? '+' : ''}{category.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaChartBar className="text-green-500" />
                <span>Top 5</span>
              </div>
            </div>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{product.sales} đã bán</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <FaStar className="text-yellow-400 text-xs mr-1" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{formatCurrency(product.revenue)}</div>
                    <div className={`text-sm font-medium ${getGrowthColor(product.growth)}`}>
                      {product.growth > 0 ? '+' : ''}{product.growth}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Phân tích khách hàng</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaUsers className="text-purple-500" />
                <span>Chi tiết</span>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analyticsData.customerInsights.newCustomers}</div>
                  <div className="text-sm text-blue-600">Khách hàng mới</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analyticsData.customerInsights.returningCustomers}</div>
                  <div className="text-sm text-green-600">Khách hàng quay lại</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Giá trị đơn hàng trung bình:</span>
                  <span className="font-medium">{formatCurrency(analyticsData.customerInsights.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Đánh giá trung bình:</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 text-sm mr-1" />
                    <span className="font-medium">{analyticsData.customerInsights.customerSatisfaction}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Phân khúc khách hàng</h4>
                <div className="space-y-2">
                  {analyticsData.customerInsights.topCustomerSegments.map((segment, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{segment.segment}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{segment.count}</span>
                        <span className="text-gray-500">({formatCurrency(segment.revenue)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Hoạt động gần đây</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FaCalendar className="text-gray-500" />
              <span>7 ngày qua</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Đơn hàng mới #ORD156</p>
                <p className="text-xs text-gray-600">Khách hàng Nguyễn Văn A đã đặt hàng trị giá 450,000₫</p>
              </div>
              <span className="text-xs text-gray-500">2 giờ trước</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Sản phẩm mới được thêm</p>
                <p className="text-xs text-gray-600">Áo khoác nam đã được thêm vào danh mục sản phẩm</p>
              </div>
              <span className="text-xs text-gray-500">5 giờ trước</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Đánh giá mới</p>
                <p className="text-xs text-gray-600">Sản phẩm "Quần jean nữ" nhận được đánh giá 5 sao</p>
              </div>
              <span className="text-xs text-gray-500">1 ngày trước</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Khách hàng mới</p>
                <p className="text-xs text-gray-600">Trần Thị B đã đăng ký tài khoản mới</p>
              </div>
              <span className="text-xs text-gray-500">2 ngày trước</span>
            </div>
          </div>
        </div>
    </div>
  );
};

export default PartnerAnalytics;
