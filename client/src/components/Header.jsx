import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaChevronDown,
  FaUser,
  FaBars,
  FaTimes,
  FaSearch,
  FaBell,
  FaCamera,
  FaTrash,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import io from 'socket.io-client';

const Header = ({
  isScrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  cartItems,
  searchQuery,
  setSearchQuery,
  isFixed = true,
  hideSearch = false,
  hideLogoShrink = false,
  hideTopNav = false,
  isOrderPage = false,
}) => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { removeFromCart } = useContext(CartContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const socketRef = useRef(null);
  const API_BASE = 'http://localhost:5000';

  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (showUserDropdown && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [showUserDropdown]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!isAuthenticated || !user) {
      return;
    }
    
    setLoadingNotifications(true);
    try {
      const token = localStorage.getItem('msv_auth') ? JSON.parse(localStorage.getItem('msv_auth')).token : '';
      
      const response = await fetch('http://localhost:5000/api/chat/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Socket.IO connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socketRef.current = io(API_BASE, { withCredentials: true });
    socketRef.current.emit('join', {
      userId: user.id,
      username: user.username,
      role: user.role
    });

    socketRef.current.on('notification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated, user, API_BASE]);

  // Fetch notifications on mount
  useEffect(() => {
      fetchNotifications();
  }, [isAuthenticated, user]);

  return (
    <header className={`bg-white shadow-sm transition-all duration-300 ${isFixed ? 'fixed top-0 left-0 right-0 z-50' : ''}`}>
        {/* Top Navigation Bar */}
        {!hideTopNav && (
        <div className="bg-orange-500 text-white py-2">
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-200">
                  <span className="truncate">Kênh người bán</span>
                  <FaChevronDown className="text-xs" />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className="truncate hover:text-orange-200">Đơn mua</span>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-200">
                  <Link to={isAuthenticated ? "/user/account/profile" : "/auth/login"} className="truncate">Tài khoản</Link>
                  <FaChevronDown className="text-xs" />
                </div>
                <div className="flex items-center space-x-1 hover:text-orange-200">
                  <div className="relative">
                    <FaShoppingCart className="text-sm" />
                    {cartItems && cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems ? cartItems.length : 0}
                      </span>
                    )}
                  </div>
                  <span className="truncate">Giỏ hàng</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-200">
                  <FaHeart className="text-sm" />
                  <span className="truncate">Yêu thích</span>
                  <FaChevronDown className="text-xs" />
                </div>
                <span className="truncate max-w-32 hover:text-orange-200">Quản lý hậu cần</span>
                <span className="truncate max-w-32 hover:text-orange-200">Hỗ trợ người tiêu dùng</span>
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Header Section */}
        <div className={`max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 transition-all duration-300 ${hideTopNav ? 'py-8 md:py-12' : (isScrolled ? 'py-2' : 'py-3 md:py-4')}`}>
        <div className="flex items-center justify-between">
            {/* Left - Branding */}
          <div className="flex items-center space-x-4">
              <Link to="/" className="flex flex-col">
                <div className={`text-orange-500 font-bold transition-all duration-300 ${hideLogoShrink ? 'text-6xl' : (isScrolled ? 'text-2xl' : 'text-4xl')}`}>MuaSamViet</div>
                <div className={`text-orange-500 text-sm hidden lg:block transition-all duration-300 ${hideLogoShrink ? '' : (isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100')}`}></div>
              </Link>
              <div className="w-px h-8 bg-orange-500 hidden lg:block"></div>
              <div className="text-orange-500 font-semibold hidden lg:block">Việt Nam</div>
            </div>

            {/* Center - Search Bar (hidden for order pages) */}
            {!hideSearch && !isOrderPage && (
            <div className="flex-1 max-w-4xl mx-4 lg:mx-8">
                <div className="flex items-center">
                  <div className="relative flex-1">
                  <div className="flex items-center border-2 border-orange-500 rounded-full overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    <select className="bg-gray-50 border-r border-gray-300 px-3 py-3 text-sm focus:outline-none hidden md:block min-w-[140px]">
                        <option>Tất cả danh mục</option>
                        <option>Thời trang</option>
                        <option>Điện tử</option>
                        <option>Nhà cửa</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                      className="flex-1 px-4 py-3 text-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    <div className="flex items-center space-x-1 pr-1">
                        <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors border-l border-gray-300">
                          <FaCamera className="text-sm" />
                        </button>
                      <button className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                        <FaSearch className="text-sm" />
                        <span className="hidden sm:inline">Tìm kiếm</span>
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right - Cart & User */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <FaBars className="text-gray-600 text-xl" />
            </button>

            {/* Simplified header for order pages */}
            {isOrderPage ? (
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-sm text-gray-600 hidden md:block">
                      Xin chào, {user?.username || 'User'}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth/login"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            ) : (
              <>
                {/* Cart */}
                <div className="relative">
                  <Link to="/cart">
                    <div
                      className="cursor-pointer relative"
                      onMouseEnter={() => setShowCartDropdown(true)}
                      onMouseLeave={() => setShowCartDropdown(false)}
                    >
                      <FaShoppingCart className="text-gray-600 text-xl" />
                      {cartItems && cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartItems ? cartItems.length : 0}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Cart Dropdown */}
                  {showCartDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-800">Giỏ hàng</h3>
                          <Link 
                            to="/cart" 
                            className="text-orange-500 text-sm hover:text-orange-600"
                            onClick={() => setShowCartDropdown(false)}
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {!cartItems || cartItems.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="text-4xl mb-2">🛒</div>
                            <p>Giỏ hàng trống</p>
                          </div>
                        ) : (
                          cartItems.slice(0, 3).map((item) => (
                            <div key={item.id} className="p-3 border-b border-gray-100 hover:bg-gray-50">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded border"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-800 truncate">
                                    {item.name}
                                  </h4>
                                  <p className="text-xs text-gray-600">
                                    Số lượng: {item.quantity}
                                  </p>
                                  <p className="text-sm font-semibold text-orange-500">
                                    ₫{(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeFromCart(item.id);
                                  }}
                                  className="text-red-500 hover:text-red-700 text-sm"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <button
                          onClick={() => setShowNotifications(!showNotifications)}
                          className="relative p-2 text-gray-600 hover:text-orange-500 transition-colors"
                        >
                          <FaBell className="text-xl" />
                          {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                              {notifications.length}
                            </span>
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => setShowUserDropdown(!showUserDropdown)}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <FaUser className="text-white text-sm" />
                        </div>
                        <span className="hidden lg:block text-sm font-medium text-gray-700">
                          {user?.username || 'User'}
                        </span>
                        <FaChevronDown className="text-xs text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/auth/login"
                      className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                    >
                      <FaUser className="text-sm" />
                      <span className="text-sm font-medium">Đăng nhập</span>
                    </Link>
                  )}

                  {/* User Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <Link to="/user/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Tài khoản của tôi
                      </Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
                  </div>
                </div>

                {/* Trending searches */}
      {!hideSearch && (
        <div className={`border-t border-gray-100 py-2 transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
          <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-4 overflow-x-auto">
                <span className="truncate hover:text-orange-500 cursor-pointer transition-colors">Áo thun</span>
                <span className="truncate hover:text-orange-500 cursor-pointer transition-colors">Quần jean</span>
                <span className="truncate hover:text-orange-500 cursor-pointer transition-colors">Váy ngắn</span>
                <span className="truncate hover:text-orange-500 cursor-pointer transition-colors">Đầm</span>
                <span className="truncate hover:text-orange-500 cursor-pointer transition-colors">Áo khoác</span>
                <span className="truncate hover:text-orange-500 cursor-pointer transition-colors">Thiết bị điện tử</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;



