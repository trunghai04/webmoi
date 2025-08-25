import React, { useState, useContext, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaComments, 
  FaChartLine,
  FaCog,
  FaSignOutAlt,
  FaUserShield,
  FaStore,
  FaClipboardList,
  FaHeadset,
  FaExclamationTriangle,
  FaBell
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

// Admin Components
import Users from "./users/Users";
import Products from "./products/Products";
import Orders from "./orders/Orders";
import Feedback from "./feedback/Feedback";
import Support from "./support/Support";
import Partners from "./partners/Partners";
import Categories from "./categories/Categories";
import BankSettings from "./BankSettings";
import Banners from "./Banners";

const AdminDashboard = () => {
  const { user, isReady, logout } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingFeedback: 0,
    activePartners: 0
  });
  const [notificationData, setNotificationData] = useState({
    type: 'system',
    title: '',
    content: ''
  });
  const [sendingNotification, setSendingNotification] = useState(false);

  useEffect(() => {
    // Only run when auth is ready and user is loaded
    if (!isReady) return;
    
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      toast.error("Bạn không có quyền truy cập trang admin!");
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [user, isReady]);

  const fetchDashboardStats = async () => {
    try {
      const API_BASE = 'http://localhost:5000';
      const token = localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : '';
      const response = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công!");
  };

  const handleBroadcastNotification = async (e) => {
    e.preventDefault();
    
    if (!notificationData.title || !notificationData.content) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setSendingNotification(true);
    
    try {
      const API_BASE = 'http://localhost:5000';
      const token = localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : '';
      const response = await fetch(`${API_BASE}/api/chat/admin/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Đã gửi thông báo đến ${data.message.split(' ')[4]} người dùng!`);
        setNotificationData({ type: 'system', title: '', content: '' });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Không thể gửi thông báo!");
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error("Lỗi kết nối server!");
    } finally {
      setSendingNotification(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (isReady && (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-600 mb-4">Bạn cần quyền admin để truy cập trang này</p>
          <Link to="/" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "dashboard", label: "Tổng quan", icon: FaChartLine },
    { id: "users", label: "Người dùng", icon: FaUsers },
    { id: "partners", label: "Đối tác", icon: FaStore },
    { id: "products", label: "Sản phẩm", icon: FaBox },
    { id: "categories", label: "Danh mục", icon: FaClipboardList },
    { id: "orders", label: "Đơn hàng", icon: FaShoppingCart },
    { id: "feedback", label: "Phản hồi", icon: FaComments },
    { id: "support", label: "Hỗ trợ", icon: FaHeadset },
    { id: "settings", label: "Cài đặt", icon: FaCog },
    { id: "banners", label: "Banner", icon: FaClipboardList }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaUserShield className="text-orange-500" />
                <span className="text-sm text-gray-700">{user.full_name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-6">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="text-lg" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                        <FaUsers className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-green-100 text-green-600">
                        <FaStore className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Đối tác</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.activePartners}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                        <FaBox className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Sản phẩm</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                        <FaShoppingCart className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Đơn hàng</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-red-100 text-red-600">
                        <FaComments className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Phản hồi chờ xử lý</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.pendingFeedback}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                        <FaChartLine className="text-2xl" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.totalRevenue.toLocaleString('vi-VN')} VNĐ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Broadcast Notification Panel */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Gửi Thông Báo Toàn Hệ Thống
                  </h2>
                  <form onSubmit={handleBroadcastNotification} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại thông báo
                      </label>
                      <select
                        value={notificationData.type}
                        onChange={(e) => setNotificationData({...notificationData, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="system">Hệ thống</option>
                        <option value="promotion">Khuyến mãi</option>
                        <option value="order">Đơn hàng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={notificationData.title}
                        onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                        placeholder="Nhập tiêu đề thông báo..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung
                      </label>
                      <textarea
                        value={notificationData.content}
                        onChange={(e) => setNotificationData({...notificationData, content: e.target.value})}
                        placeholder="Nhập nội dung thông báo..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={sendingNotification}
                        className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sendingNotification ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <FaBell />
                            Gửi Thông Báo
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">5 đơn hàng mới được đặt</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">3 người dùng mới đăng ký</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">2 phản hồi mới cần xử lý</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && <Users />}
            {activeTab === "partners" && <Partners />}
            {activeTab === "products" && <Products />}
            {activeTab === "categories" && <Categories />}
            {activeTab === "orders" && <Orders />}
            {activeTab === "feedback" && <Feedback />}
            {activeTab === "support" && <Support />}
            {activeTab === "settings" && <BankSettings />}
            {activeTab === "banners" && <Banners />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
