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
    if (!isAuthenticated || !user) return;
    
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

    socketRef.current.on('admin_notification', (notification) => {
      // Add new notification to the list
      setNotifications(prev => [{
        id: Date.now(),
        title: notification.title,
        content: notification.content,
        type: notification.type,
        created_at: notification.created_at,
        is_read: false
      }, ...prev]);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [isAuthenticated, user, API_BASE]);

  // Fetch notifications on mount only
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchNotifications();
    }
  }, []); // Empty dependency array - only run once on mount

  const unreadCount = Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0;

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-4/5 bg-white shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 flex justify-between items-center border-b">
              <div className="text-orange-500 text-2xl font-bold">MuaSamViet</div>
              <button onClick={() => setMobileMenuOpen(false)}>
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg w-full text-left">
                  <FaUser className="text-orange-500" />
                  <span>Đăng xuất</span>
                </button>
              ) : (
                <Link to="/auth/login" className="flex items-center space-x-2 p-2 bg-orange-50 rounded-lg">
                  <FaUser className="text-orange-500" />
                  <span>Tài khoản</span>
                </Link>
              )}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Danh mục</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                    <span>Thời trang</span>
                    <FaChevronDown className="text-xs" />
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                    <span>Điện tử</span>
                    <FaChevronDown className="text-xs" />
                  </div>
                  <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                    <span>Nhà cửa</span>
                    <FaChevronDown className="text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Bar (fixed optional) */}
      <div
        className={`${isFixed ? "fixed top-0 left-0 right-0 z-40 " : ""}transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-white"
        }`}
      >
        {/* Top Navigation Bar */}
        {!hideTopNav && (
          <div className={`bg-gray-100 text-gray-600 text-xs py-2 border-b hidden lg:block transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
            <div className={`max-w-screen-2xl mx-auto px-6 lg:px-8 flex justify-between items-center`}>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-500">
                  <span className="truncate">Việt Nam</span>
                  <FaChevronDown className="text-xs" />
                </div>
                <span className="truncate hover:text-orange-500">
                  Thân mến, vui lòng đăng ký / đăng nhập
                </span>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-500">
                  <span className="truncate">Ngôn ngữ</span>
                  <FaChevronDown className="text-xs" />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <span className="truncate hover:text-orange-500">Đơn mua</span>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-500">
                  <Link to={isAuthenticated ? "/user/account/profile" : "/auth/login"} className="truncate">Tài khoản</Link>
                  <FaChevronDown className="text-xs" />
                </div>
                <div className="flex items-center space-x-1 hover:text-orange-500">
                  <div className="relative">
                    <FaShoppingCart className="text-sm" />
                    {cartItems && cartItems.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems ? cartItems.length : 0}
                      </span>
                    )}
                  </div>
                  <span className="truncate">Giỏ hàng</span>
                </div>
                <div className="flex items-center space-x-1 cursor-pointer hover:text-orange-500">
                  <FaHeart className="text-sm" />
                  <span className="truncate">Yêu thích</span>
                  <FaChevronDown className="text-xs" />
                </div>
                <span className="truncate max-w-32 hover:text-orange-500">Quản lý hậu cần</span>
                <span className="truncate max-w-32 hover:text-orange-500">Hỗ trợ người tiêu dùng</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Header Section */}
        <div className={`max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 transition-all duration-300 ${hideTopNav ? 'py-8 md:py-12' : (isScrolled ? 'py-2' : 'py-3 md:py-4')}`}>
          <div className="relative flex items-center justify-center">
            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <FaBars className="text-gray-600 text-xl" />
            </button>

            {/* Left - Branding */}
            <div className="hidden lg:flex items-center space-x-4 absolute left-0">
              <Link to="/" className="flex flex-col">
                <div className={`text-orange-500 font-bold transition-all duration-300 ${hideLogoShrink ? 'text-6xl' : (isScrolled ? 'text-2xl' : 'text-4xl')}`}>MuaSamViet</div>
                <div className={`text-orange-500 text-sm hidden lg:block transition-all duration-300 ${hideLogoShrink ? '' : (isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100')}`}></div>
              </Link>
              <div className="w-px h-8 bg-orange-500 hidden lg:block"></div>
              <div className="text-orange-500 font-semibold hidden lg:block">Việt Nam</div>
            </div>

            {/* Center - Search Bar */}
            {!hideSearch && (
              <div className="w-full mx-4 lg:mx-auto max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl translate-x-[50px]">
                <div className="flex items-center">
                  <div className="relative flex-1">
                    <div className="flex items-center border-2 border-orange-500 rounded-full overflow-hidden">
                      <select className="bg-gray-50 border-r border-gray-300 px-2 md:px-3 py-2 md:py-2.5 lg:px-4 lg:py-3 text-xs md:text-sm focus:outline-none hidden md:block">
                        <option>Tất cả danh mục</option>
                        <option>Thời trang</option>
                        <option>Điện tử</option>
                        <option>Nhà cửa</option>
                      </select>
                      <input
                        type="text"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="flex-1 px-3 md:px-4 py-2 md:py-2.5 lg:py-3 text-sm focus:outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <div className="flex items-center space-x-2 pr-2">
                        <button className="p-2 text-gray-500 hover:text-orange-500 transition-colors border-l border-gray-300">
                          <FaCamera className="text-sm" />
                        </button>
                        <button className="bg-orange-500 text-white px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors flex items-center gap-2">
                          <FaSearch className="inline md:hidden" />
                          <span className="hidden md:inline">Tìm kiếm</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Desktop cart + avatar next to search */}
                  <div className="ml-[30px] hidden lg:flex items-center gap-[20px] xl:gap-[30px] translate-x-[100px]">
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
                             {cartItems && cartItems.length > 0 && (
                               <div className="p-3 border-t border-gray-100">
                                 <div className="flex items-center justify-between mb-2">
                                   <span className="text-sm text-gray-600">Tổng cộng:</span>
                                   <span className="font-semibold text-gray-800">
                                     ₫{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                                   </span>
                                 </div>
                                 <Link
                                   to="/cart"
                                   className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors text-center block"
                                   onClick={() => setShowCartDropdown(false)}
                                 >
                                   Thanh toán
                                 </Link>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                    {/* Notification Icon - Only show when authenticated */}
                    {isAuthenticated && (
                      <div className="relative">
                        <div
                          className="cursor-pointer relative"
                          onMouseEnter={() => setShowNotifications(true)}
                          onMouseLeave={() => setShowNotifications(false)}
                        >
                          <FaBell className="text-gray-600 text-xl" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadCount}
                            </span>
                          )}
                          
                          {/* Notification Dropdown */}
                          {showNotifications && (
                            <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                              <div className="p-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-gray-800">Thông báo</h3>
                                  <button className="text-orange-500 text-sm hover:text-orange-600">
                                    Đánh dấu tất cả đã đọc
                                  </button>
                                </div>
                              </div>
                              <div className="max-h-96 overflow-y-auto">
                                {loadingNotifications ? (
                                  <div className="p-4 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                                    Đang tải thông báo...
                                  </div>
                                ) : !Array.isArray(notifications) || notifications.length === 0 ? (
                                  <div className="p-4 text-center text-gray-500 text-sm">
                                    Không có thông báo mới
                                  </div>
                                ) : (
                                  notifications.map((notification) => (
                                    <div
                                      key={notification.id}
                                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                        !notification.is_read ? 'bg-orange-50' : ''
                                      }`}
                                    >
                                      <div className="flex items-start space-x-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                          notification.is_read ? 'bg-gray-300' : 'bg-orange-500'
                                        }`}></div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center justify-between">
                                            <h4 className={`text-sm font-medium ${
                                              notification.is_read ? 'text-gray-600' : 'text-gray-800'
                                            }`}>
                                              {notification.title}
                                            </h4>
                                            <span className="text-xs text-gray-400">
                                              {new Date(notification.created_at).toLocaleString('vi-VN')}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                            {notification.content}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                              <div className="p-3 border-t border-gray-100">
                                <Link
                                  to="/notifications"
                                  className="text-orange-500 text-sm hover:text-orange-600 text-center block"
                                >
                                  Xem tất cả thông báo
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div
                      className="relative"
                      ref={userMenuRef}
                    >
                      <div
                        className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors cursor-pointer"
                        onClick={() => setShowUserDropdown((v) => !v)}
                        role="button"
                        aria-haspopup="menu"
                        aria-expanded={showUserDropdown}
                      >
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaUser className="text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 hidden xl:block">
                          {isAuthenticated && user ? user.username : "Tài khoản"}
                        </span>
                      </div>
                      {showUserDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <Link to="/user/account/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Tài khoản của tôi
                          </Link>
                          {isAuthenticated ? (
                            <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                              Đăng xuất
                            </button>
                          ) : (
                            <Link to="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                              Đăng nhập
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Trending searches */}
                <div className={`hidden lg:flex items-center space-x-4 mt-2 text-xs text-gray-500 overflow-hidden transition-all duration-300 ${isScrolled ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Cửa hàng bong bóng</span>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Váy ngắn</span>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Đầm</span>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Áo khoác</span>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Thiết bị điện tử</span>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Thiết bị điện tử</span>
                  <span className="truncate hover:text-orange-500 cursor-pointer">Thiết bị điện tử</span>
                </div>
              </div>
            )}

            {/* Right - Cart and User for mobile */}
            <div className="flex items-center gap-[30px] md:gap-[40px] lg:hidden">
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

                {/* Mobile Cart Dropdown */}
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
                    {cartItems && cartItems.length > 0 && (
                      <div className="p-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Tổng cộng:</span>
                          <span className="font-semibold text-gray-800">
                            ₫{cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                          </span>
                        </div>
                                                 <Link
                           to="/cart"
                           className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors text-center block"
                           onClick={() => setShowCartDropdown(false)}
                         >
                           Thanh toán
                         </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Mobile notification icon */}
              {isAuthenticated && (
                <div className="relative">
                  <FaBell className="text-gray-600 text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Link to="/user/account/profile" className="flex items-center gap-2 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors">
                  <FaUser className="text-gray-600 text-xl" />
                  <span className="text-sm font-medium text-gray-700 hidden md:block">
                    {isAuthenticated && user ? user.username : "Tài khoản"}
                  </span>
                </Link>
                {isAuthenticated && (
                  <button onClick={handleLogout} className="text-sm text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-50">
                    Đăng xuất
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;



