import React, { useState, useContext, useEffect } from "react";
import { Link, Routes, Route, useLocation } from "react-router-dom";
import { 
  FaUser, 
  FaBell, 
  FaFileAlt, 
  FaGift, 
  FaCoins, 
  FaEdit, 
  FaChevronRight,
  FaCreditCard,
  FaMapMarkerAlt,
  FaLock,
  FaCog,
  FaShieldAlt,
  FaIdCard,
  FaCamera,
  FaMoon,
  FaSun
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import Profile from "./sections/Profile";
import Bank from "./sections/Bank";
import Address from "./sections/Address";
import ChangePassword from "./sections/ChangePassword";
import NotificationSettings from "./sections/NotificationSettings";
import PrivacySettings from "./sections/PrivacySettings";
import PersonalInfo from "./sections/PersonalInfo";
import AccountOverview from "./sections/AccountOverview";
import Orders from "./sections/Orders";
import Vouchers from "./sections/Vouchers";
import Coins from "./sections/Coins";

const MyAccount = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Use user from context or fallback to default
  const currentUser = user || {
    username: "Khách",
    name: "Người dùng",
    email: "",
    phone: "",
    avatar: null
  };

  const menuItems = [
    {
      id: "notifications",
      label: "Thông Báo",
      icon: FaBell,
      path: "/user/notifications",
      color: "text-blue-500"
    },
    {
      id: "account",
      label: "Tài Khoản Của Tôi",
      icon: FaUser,
      path: "/user/account",
      color: "text-purple-500",
      subItems: [
        { id: "profile", label: "Hồ Sơ", path: "/user/account/profile", icon: FaUser },
        { id: "bank", label: "Ngân Hàng", path: "/user/account/bank", icon: FaCreditCard },
        { id: "address", label: "Địa Chỉ", path: "/user/account/address", icon: FaMapMarkerAlt },
        { id: "password", label: "Đổi Mật Khẩu", path: "/user/account/password", icon: FaLock },
        { id: "notifications", label: "Cài Đặt Thông Báo", path: "/user/account/notifications", icon: FaBell },
        { id: "privacy", label: "Những Thiết Lập Riêng Tư", path: "/user/account/privacy", icon: FaShieldAlt },
        { id: "personal", label: "Thông Tin Cá Nhân", path: "/user/account/personal", icon: FaIdCard }
      ]
    },
    {
      id: "orders",
      label: "Đơn Mua",
      icon: FaFileAlt,
      path: "/user/orders",
      color: "text-green-500"
    },
    {
      id: "vouchers",
      label: "Kho Voucher",
      icon: FaGift,
      path: "/user/vouchers",
      color: "text-red-500"
    },
    {
      id: "coins",
      label: "MuaSamViet Xu",
      icon: FaCoins,
      path: "/user/coins",
      color: "text-yellow-500"
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isSubActive = (path) => {
    return location.pathname === path;
  };

  // Debug routing (removed for production)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 hover:scale-105">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FaLock className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Vui lòng đăng nhập</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Bạn cần đăng nhập để truy cập trang tài khoản</p>
          <Link 
            to="/auth/login" 
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg inline-block"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
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

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Mobile Navigation Toggle */}
        <div className="lg:hidden mb-4 flex justify-between items-center">
          <button 
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md flex items-center gap-2"
          >
            <FaUser className="text-orange-500" />
            <span className="font-medium">Menu tài khoản</span>
            <FaChevronRight className={`text-xs transition-transform ${mobileNavOpen ? 'rotate-90' : ''}`} />
          </button>
          <button 
            onClick={toggleDarkMode}
            className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md"
          >
            {darkMode ? <FaSun className="text-yellow-500" /> : <FaMoon className="text-gray-700" />}
          </button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className={`w-64 transition-all duration-300 ${mobileNavOpen ? 'block fixed lg:static inset-0 z-50 bg-white dark:bg-gray-800 p-4 overflow-y-auto' : 'hidden'} lg:block`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              {/* User Profile Section */}
              <div className="text-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <FaUser className="text-white text-3xl" />
                  )}
                  <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1 rounded-full shadow-md border border-gray-200 dark:border-gray-600">
                    <FaCamera className="text-gray-600 dark:text-gray-300 text-xs" />
                  </button>
                </div>
                <div className="font-semibold text-gray-800 dark:text-white mb-1">{currentUser.username}</div>
                {currentUser.email && (
                  <div className="text-gray-500 dark:text-gray-400 text-xs mb-2">{currentUser.email}</div>
                )}
                {currentUser.phone && (
                  <div className="text-gray-500 dark:text-gray-400 text-xs mb-2">{currentUser.phone}</div>
                )}
                <Link 
                  to="/user/account/profile" 
                  className="text-gray-500 dark:text-gray-400 text-sm hover:text-orange-500 dark:hover:text-orange-400 flex items-center justify-center gap-1 transition-colors"
                >
                  <FaEdit className="text-xs" />
                  Sửa Hồ Sơ
                </Link>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all duration-300 group ${
                        isActive(item.path) || (item.subItems && item.subItems.some(sub => isSubActive(sub.path)))
                          ? "bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 text-orange-600 dark:text-orange-400 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => window.innerWidth < 1024 && item.id !== 'account' && setMobileNavOpen(false)}
                    >
                      <item.icon className={`text-lg ${item.color} group-hover:scale-110 transition-transform`} />
                      <span className="flex-1">{item.label}</span>
                      {item.subItems && (
                        <FaChevronRight className={`text-xs transition-transform ${
                          item.subItems.some(sub => isSubActive(sub.path)) ? "rotate-90" : ""
                        }`} />
                      )}
                    </Link>

                    {/* Sub-items */}
                    {item.subItems && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.id}
                            to={subItem.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                              isSubActive(subItem.path)
                                ? "text-orange-500 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20"
                                : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                            onClick={() => window.innerWidth < 1024 && setMobileNavOpen(false)}
                          >
                            <subItem.icon className="text-xs" />
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Dark mode toggle for desktop */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 hidden lg:block">
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? (
                    <>
                      <FaSun className="text-lg text-yellow-500" />
                      <span>Chế độ sáng</span>
                    </>
                  ) : (
                    <>
                      <FaMoon className="text-lg text-gray-700" />
                      <span>Chế độ tối</span>
                    </>
                  )}
                </button>
              </div>

              {/* Close button for mobile */}
              {mobileNavOpen && (
                <button 
                  onClick={() => setMobileNavOpen(false)}
                  className="mt-6 w-full bg-orange-500 text-white py-2 rounded-lg lg:hidden"
                >
                  Đóng
                </button>
              )}
            </div>
          </aside>

          {/* Overlay for mobile menu */}
          {mobileNavOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <Routes>
                <Route path="account" element={<AccountOverview />} />
                <Route path="account/profile" element={<Profile />} />
                <Route path="account/bank" element={<Bank />} />
                <Route path="account/address" element={<Address />} />
                <Route path="account/password" element={<ChangePassword />} />
                <Route path="account/notifications" element={<NotificationSettings />} />
                <Route path="account/privacy" element={<PrivacySettings />} />
                <Route path="account/personal" element={<PersonalInfo />} />
                <Route path="orders" element={<Orders />} />
                <Route path="vouchers" element={<Vouchers />} />
                <Route path="coins" element={<Coins />} />
                <Route path="*" element={<AccountOverview />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>

      <FloatingActions />
      <Footer />
    </div>
  );
};

export default MyAccount;