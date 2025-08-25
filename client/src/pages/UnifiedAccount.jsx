import React, { useState, useContext, useEffect } from "react";
import { Link, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBell, 
  FaEdit, 
  FaChevronRight,
  FaFileAlt,
  FaGift,
  FaCoins,
  FaStar,
  FaHistory,
  FaCreditCard,
  FaMapMarkerAlt,
  FaLock,
  FaCog,
  FaShieldAlt,
  FaIdCard,

  FaStore,
  FaChartLine,
  FaBox,
  FaTruck,
  FaPalette,
  FaLanguage
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FloatingActions from "../components/FloatingActions";
import { toast } from "react-toastify";

// Import all sections

import AccountOverview from "./user/sections/AccountOverview";

// Partner specific sections


import PartnerAnalytics from "./partner/PartnerAnalytics";
import PartnerProducts from "./partner/PartnerProducts";
import PartnerOrders from "./partner/PartnerOrders";
import PartnerNotifications from "./partner/PartnerNotifications";
import PartnerSettings from "./partner/PartnerSettings";
import PartnerDashboard from "./partner/PartnerDashboard";
import PartnerStore from "./partner/PartnerStore";
import AddProduct from "./partner/AddProduct";
import EditProduct from "./partner/EditProduct";
import ProductDetail from "./partner/ProductDetail";

const UnifiedAccount = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Use user from context or fallback to default
  const currentUser = user || {
    username: "Khách",
    name: "Người dùng",
    email: "",
    phone: "",
    avatar: null
  };

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [];

    // Add user settings menu for regular users ONLY
    if (user?.role !== 'partner' && user?.role !== 'admin') {
      baseItems.push({
        id: "settings",
        label: "Cài Đặt",
        icon: FaCog,
        path: "/account/settings",
        color: "text-purple-500",
        subItems: [
          { id: "bank", label: "Ngân Hàng", path: "/account/bank", icon: FaCreditCard },
          { id: "address", label: "Địa Chỉ", path: "/account/address", icon: FaMapMarkerAlt },
          { id: "password", label: "Đổi Mật Khẩu", path: "/account/password", icon: FaLock },
          { id: "notifications", label: "Cài Đặt Thông Báo", path: "/account/notifications", icon: FaBell },
          { id: "privacy", label: "Những Thiết Lập Riêng Tư", path: "/account/privacy", icon: FaShieldAlt },
          { id: "personal", label: "Thông Tin Cá Nhân", path: "/account/personal", icon: FaIdCard },
          { id: "orders", label: "Đơn Mua", path: "/account/orders", icon: FaFileAlt },
          { id: "vouchers", label: "Kho Voucher", path: "/account/vouchers", icon: FaGift },
          { id: "coins", label: "Xu Tích Lũy", path: "/account/coins", icon: FaCoins },
          { id: "rewards", label: "Điểm Thưởng", path: "/account/rewards", icon: FaStar },
          { id: "transaction-history", label: "Lịch Sử Giao Dịch", path: "/account/transaction-history", icon: FaHistory }
        ]
      });
    }

    // Add partner-specific items ONLY for partners
    if (user?.role === 'partner' || user?.role === 'admin') {
      baseItems.push(
        {
          id: "partner",
          label: "Quản Lý Cửa Hàng",
          icon: FaStore,
          path: "/account/partner",
          color: "text-orange-500",
          subItems: [
            { id: "partner-products", label: "Sản Phẩm", path: "/account/partner/products", icon: FaBox },
            { id: "partner-orders", label: "Đơn Hàng", path: "/account/partner/orders", icon: FaTruck },
            { id: "partner-analytics", label: "Phân Tích", path: "/account/partner/analytics", icon: FaChartLine },
            { id: "partner-notifications", label: "Thông Báo", path: "/account/partner/notifications", icon: FaBell },
            { id: "partner-settings", label: "Cài Đặt", path: "/account/partner/settings", icon: FaCog }
          ]
        }
      );
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current path is active
  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get current section name
  const getCurrentSectionName = () => {
    const path = location.pathname;
    if (path.includes('/partner/')) {
      return 'Quản Lý Cửa Hàng';
    }

    if (path.includes('/bank')) return 'Ngân Hàng';
    if (path.includes('/address')) return 'Địa Chỉ';
    if (path.includes('/password')) return 'Đổi Mật Khẩu';
    if (path.includes('/notifications')) return 'Thông Báo';
    if (path.includes('/privacy')) return 'Bảo Mật';
    if (path.includes('/personal')) return 'Thông Tin Cá Nhân';
    if (path.includes('/orders')) return 'Đơn Mua';
    if (path.includes('/vouchers')) return 'Kho Voucher';
    if (path.includes('/coins')) return 'Xu Tích Lũy';
    return 'Tổng Quan';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 

        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-gray-700 hover:text-orange-500">
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <FaChevronRight className="text-gray-400 mx-2" />
                  <span className="text-gray-500">Tài khoản</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <FaChevronRight className="text-gray-400 mx-2" />
                  <span className="text-gray-900 font-medium">{getCurrentSectionName()}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Only for regular users */}
          {user?.role !== 'partner' && user?.role !== 'admin' && (
            <aside className={`w-64 transition-all duration-300 ${mobileNavOpen ? 'block fixed lg:static inset-0 z-50 bg-white p-4 overflow-y-auto' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-lg shadow-sm p-4">
                {/* Navigation Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <div key={item.id}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          isActivePath(item.path)
                            ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-500'
                            : 'text-gray-700'
                        }`}
                      >
                        <item.icon className={`mr-3 text-lg ${item.color}`} />
                        {item.label}
                      </Link>
                      
                      {/* Sub-items */}
                      {item.subItems && isActivePath(item.path) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={subItem.path}
                              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                location.pathname === subItem.path
                                  ? 'bg-orange-50 text-orange-600'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <subItem.icon className="mr-3 text-sm" />
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={user?.role === 'partner' || user?.role === 'admin' ? 'flex-1' : 'flex-1'}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Routes>
                {/* Partner Routes */}
                <Route path="partner" element={<PartnerDashboard />} />
                <Route path="partner/products" element={<PartnerProducts />} />
                <Route path="partner/products/add" element={<AddProduct />} />
                <Route path="partner/products/:id/edit" element={<EditProduct />} />
                <Route path="partner/products/:id" element={<ProductDetail />} />
                <Route path="partner/orders" element={<PartnerOrders />} />
                <Route path="partner/analytics" element={<PartnerAnalytics />} />
                <Route path="partner/notifications" element={<PartnerNotifications />} />
                <Route path="partner/settings" element={<PartnerSettings />} />
                <Route path="partner/store" element={<PartnerStore />} />
                
                {/* Default Route */}
                <Route path="*" element={<AccountOverview />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      <FloatingActions hideCart={user?.role === 'partner'} />
      <Footer />
    </div>
  );
};

export default UnifiedAccount;
