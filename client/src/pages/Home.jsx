import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import FloatingActions from "../components/FloatingActions";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FlashSale from "../components/FlashSale";
import LoginPopup from "../components/LoginPopup";
import { 
  FaShoppingCart, 
  FaHeart, 
  FaSearch,
  FaTshirt,
  FaMobile,
  FaHome,
  FaHeartbeat,
  FaDumbbell,
  FaCoffee,
  FaBaby,
  FaUser,
  FaStore,
  FaGift,
  FaBookmark,
  FaMapMarkerAlt,
  FaNewspaper,
  FaLanguage,
  FaApple,
  FaGoogle,
  FaYahoo,
  FaMicrosoft,
  FaDesktop,
  FaComment,
  FaArrowUp,
  FaPercent,
  FaGem,
  FaHeadset,
  FaCamera,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaStar,
  FaBicycle,
  FaFan,
  FaEllipsisH,
  FaChevronDown,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const res = await fetch(`${API_BASE}/api/banners`);
        const data = await res.json();
        if (data.success) {
          const active = (data.data || [])
            .filter(b => Number(b.is_active) === 1)
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          setBanners(active);
        } else {
          setBanners([]);
        }
      } catch (e) {
        setBanners([]);
      }
    };
    fetchBanners();
  }, []);

  // Handle login form change
  const handleLoginChange = (e) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle login submit
  const handleLoginSubmit = async () => {
    try {
      await login(loginForm.email, loginForm.password);
      toast.success("Đăng nhập thành công!");
    } catch (error) {
      toast.error("Đăng nhập thất bại!");
    }
  };

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_BASE}/api/products/featured`);
        if (response.ok) {
          const resJson = await response.json();
          const apiProducts = resJson?.data?.products || [];
          const mapped = apiProducts.map((p) => ({
            product_id: p.id,
            name: p.name,
            price: Number(p.flash_sale_price || p.price || 0),
            original_price: Number(p.original_price || p.price || 0),
            discount: p.original_price && Number(p.original_price) > Number(p.price) ? Math.round((1 - (Number(p.price) / Number(p.original_price))) * 100) : 0,
            rating: Number(p.rating || 0),
            review_count: Number(p.total_reviews || 0),
            badge: p.is_featured ? 'Nổi bật' : 'Bán chạy',
            shipping: 'Miễn phí vận chuyển',
            image_url: p.primary_image || '/uploads/products/default.svg'
          }));
          setFeaturedProducts(mapped);
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setFeaturedProducts([]);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Product card component
  const ProductCard = ({ product }) => {
    const handleAddToCart = (e) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        setShowLoginPopup(true);
        return;
      }
      addToCart(product);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
    };

    const goToDetails = () => {
      navigate(`/product/${product.product_id}`);
    };

    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg shadow-sm p-2 sm:p-3 md:p-4 cursor-pointer hover:shadow-md transition-shadow relative flex flex-col"
        onClick={goToDetails}
      >
        <div className="relative mb-2 sm:mb-3 flex-shrink-0">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg"
          />
          {product.discount > 0 && (
            <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-red-600 text-white text-xs px-1 sm:px-2 py-1 rounded-full">
              -{product.discount}%
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-white text-gray-600 p-1 sm:p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-md"
          >
            <FaShoppingCart className="text-xs sm:text-sm" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-800 text-xs sm:text-sm mb-1 sm:mb-2 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400 text-xs" />
              <span className="text-xs text-gray-600">{product.rating}</span>
              <span className="text-xs text-gray-400 hidden sm:inline">({product.review_count})</span>
            </div>
            <span className="text-xs bg-orange-100 text-orange-800 px-1 sm:px-2 py-1 rounded-full">{product.badge}</span>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <div>
              <div className="text-orange-600 font-bold text-sm sm:text-base md:text-lg">
                {product.price.toLocaleString()}₫
              </div>
              {product.original_price > product.price && (
                <div className="text-gray-400 text-xs sm:text-sm line-through">
                  {product.original_price.toLocaleString()}₫
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500 hidden sm:block">{product.shipping}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Spacer for fixed header */}
      <div className="h-20 md:h-24 lg:h-32"></div>

      {/* Main Content */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 relative">
        {/* Top Row - Categories, Banner, and Login */}
        <div className="flex flex-col lg:flex-row gap-2 mb-4">
          {/* Left Sidebar - Categories */}
          <div className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-orange-500 rounded-lg shadow-sm p-2 h-80 md:h-96 lg:h-[396px]">
              <h3 className="font-semibold text-white mb-2 text-sm">Danh mục</h3>
              <div className="h-full overflow-y-auto pr-1 category-scroll">
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                <Link to="/categories/1" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaTshirt className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Thời trang</span>
                </Link>
                <Link to="/categories/4" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaHome className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Nhà cửa</span>
                </Link>
                <Link to="/categories/2" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaMobile className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Điện tử</span>
                </Link>
                <Link to="/categories/3" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaTshirt className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Phụ kiện</span>
                </Link>
                <Link to="/categories/5" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaBaby className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Trẻ em</span>
                </Link>
                <Link to="/categories/5" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaHeartbeat className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Làm đẹp</span>
                </Link>
                <Link to="/categories" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaStore className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Xe cộ</span>
                </Link>
                <Link to="/categories" className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                  <FaCoffee className="text-white text-xs" />
                  <span className="text-white text-xs truncate">Thực phẩm</span>
                  </Link>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaCamera className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Máy ảnh & Phụ kiện</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaDesktop className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Máy tính & Laptop</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaBicycle className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Thể thao - Dã ngoại</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaFan className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Điện gia dụng</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaGem className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Trang sức - Phụ kiện</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaBookmark className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Văn phòng phẩm - Sách</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaHeadset className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Âm thanh - Tai nghe</span>
                  </div>
                  <div className="flex items-center space-x-2 p-1.5 hover:bg-orange-600 rounded cursor-pointer">
                    <FaGift className="text-white text-xs" />
                    <span className="text-white text-xs truncate">Voucher - Dịch vụ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner and Login Row */}
          <div className="flex-1 flex flex-col lg:flex-row gap-6">
            {/* Large Banner Card */}
            <div className="w-full flex-1 min-w-0 bg-white rounded-lg shadow-sm p-1">
              {/* Brand chips row */}
              <div className="w-full bg-gray-50 rounded-lg shadow-sm p-2 mb-2">
                <div className="flex items-center gap-2 md:gap-3 flex-nowrap overflow-x-auto whitespace-nowrap">
                  {[
                    "Apple",
                    "Samsung",
                    "Xiaomi",
                    "Sony",
                    "Oppo",
                    "Vivo",
                    "Asus",
                    "Dell",
                    "HP",
                  ].map((brand) => (
                    <span
                      key={brand}
                      className="px-3 py-1.5 text-xs md:text-sm rounded-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 cursor-pointer"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Main Banner Layout */}
              <div className="flex flex-col lg:flex-row gap-2">
                {/* Left - Featured Banner */}
                {banners && banners.length > 0 ? (
                  <a
                    href={banners[0].link_url || '#'}
                    target={banners[0].link_url ? '_blank' : undefined}
                    rel={banners[0].link_url ? 'noopener noreferrer' : undefined}
                    className="w-full lg:w-60 h-48 md:h-56 lg:h-72 rounded-lg overflow-hidden block"
                  >
                    <img
                      src={banners[0].image_url}
                      alt={banners[0].title || 'Banner'}
                      className="w-full h-full object-cover"
                    />
                  </a>
                ) : (
                  <div className="w-full lg:w-60 h-48 md:h-56 lg:h-72 bg-orange-500 rounded-lg p-3 flex flex-col justify-between">
                    <div className="text-white">
                      <div className="text-lg font-bold mb-2">MuaSamViet Lựa Chọn</div>
                      <div className="text-2xl font-bold mb-2">Giảm giá 50%</div>
                      <div className="text-sm">Thương hiệu lớn - Sản phẩm hot</div>
                    </div>
                    <div className="flex justify-center">
                      <div className="w-32 h-20 bg-white/20 rounded-lg flex items-center justify-center">
                        <div className="text-white text-xs text-center">
                          🛒 Xe đẩy hàng<br/>
                          với các sản phẩm
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Right - Banners Grid */}
                <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  {(banners && banners.length > 1 ? banners.slice(1, 7) : []).map((b) => (
                    <a
                      key={b.id}
                      href={b.link_url || '#'}
                      target={b.link_url ? '_blank' : undefined}
                      rel={b.link_url ? 'noopener noreferrer' : undefined}
                      className="bg-white border rounded-lg overflow-hidden block"
                    >
                      <div className="w-full aspect-[3/2]">
                        <img src={b.image_url} alt={b.title || 'Banner'} className="w-full h-full object-cover" />
                      </div>
                    </a>
                  ))}
                  {(!banners || banners.length <= 1) && new Array(6).fill(0).map((_, idx) => (
                    <div key={`ph-${idx}`} className="bg-white border rounded-lg overflow-hidden">
                      <div className="w-full aspect-[3/2] bg-orange-50 flex items-center justify-center text-orange-500 font-semibold">
                        Banner {idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Login Form - New Design */}
            {!isAuthenticated && (
              <div className="w-full lg:w-56 bg-white rounded-lg shadow-sm p-2 md:p-3 border">
                {/* Top Section with Avatar and Greeting */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUser className="text-white text-lg" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm">Xin chào!</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Link to="/auth/register" className="text-gray-500 text-xs hover:text-orange-500">Đăng ký</Link>
                      <span className="text-gray-300">|</span>
                      <Link to="/auth/login" className="text-gray-500 text-xs hover:text-orange-500">Đăng nhập</Link>
                    </div>
                  </div>
                </div>

                {/* Main Heading */}
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 text-sm">Đăng nhập để nhận ưu đãi</h3>
                  <p className="text-gray-500 text-xs mt-1">Nhận các đề xuất phù hợp với bạn</p>
                </div>

                {/* Login Button */}
                <Link
                  to="/auth/login"
                  className="w-full bg-orange-500 text-white py-3 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors mb-6 flex items-center justify-center"
                >
                  Đăng nhập ngay
                </Link>

                {/* Icon Sections */}
                <div className="space-y-4">
                  {/* First Row - Outline Icons */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                        <FaHeart className="text-gray-400 text-xs" />
                      </div>
                      <span className="text-xs text-gray-600">Yêu thích</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                        <FaNewspaper className="text-gray-400 text-xs" />
                      </div>
                      <span className="text-xs text-gray-600">Tin tức</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                        <FaShoppingCart className="text-gray-400 text-xs" />
                      </div>
                      <span className="text-xs text-gray-600">Giỏ hàng</span>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                        <FaBookmark className="text-gray-400 text-xs" />
                      </div>
                      <span className="text-xs text-gray-600">Đánh dấu</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Featured Categories Section - 8 Circular Items */}
        <div className="w-full mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Đề xuất cho bạn</h2>
              <Link to="/categories" className="text-orange-600 hover:text-orange-700 text-sm">
                Xem tất cả →
              </Link>
            </div>
            
            {/* 8 Circular Categories Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
              {/* Element 1 - Tôi đoán bạn */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaHeart className="text-orange-500 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-orange-500 text-xs font-medium">Yêu thích</div>
                </div>
              </div>

              {/* Element 2 - Thiết bị thể thao */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaBicycle className="text-gray-600 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Thể thao</div>
                </div>
              </div>

              {/* Element 3 - Đồ ăn vặt */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-yellow-400 rounded flex items-center justify-center">
                    <span className="text-yellow-800 text-xs font-bold">L</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Ăn vặt</div>
                </div>
              </div>

              {/* Element 4 - Chaodiandigital */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaCamera className="text-blue-500 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Điện tử</div>
                </div>
              </div>

              {/* Element 5 - Ngôi nhà mát */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaFan className="text-green-500 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Gia dụng</div>
                </div>
              </div>

              {/* Element 6 - Trang phục */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaTshirt className="text-purple-500 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Thời trang</div>
                </div>
              </div>

              {/* Element 7 - Chăm sóc */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-pink-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaGem className="text-pink-500 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Làm đẹp</div>
                </div>
              </div>

              {/* Element 8 - Placeholder */}
              <div className="flex flex-col items-center p-2 sm:p-3 hover:bg-orange-50 rounded-lg cursor-pointer">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1 sm:mb-2">
                  <FaEllipsisH className="text-gray-500 text-sm sm:text-base md:text-lg" />
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-xs font-medium">Xem thêm</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale - below "Đề xuất cho bạn" */}
        <div className="mb-6">
          <FlashSale />
        </div>

        {/* Bottom Row - Products */}
        <div className="w-full mx-auto">
          {/* Banner Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Sản phẩm nổi bật</h2>
              <Link to="/products" className="text-orange-600 hover:text-orange-700 text-sm">
                Xem tất cả →
              </Link>
            </div>
            
            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
              {featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 5).map((product) => (
                  <ProductCard key={product.product_id} product={product} />
                ))
              ) : (
                <div className="col-span-5 text-center text-gray-500">
                  Không có sản phẩm nào để hiển thị
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trợ cấp trăm tỷ */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Khuyến mãi đặc biệt</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="text-center">
                <div className="w-full h-28 md:h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                  Hình minh hoạ
                </div>
                <div className="text-orange-600 font-bold">20.000₫</div>
                <div className="text-xs text-gray-600">Bán chạy</div>
              </div>
              <div className="text-center">
                <div className="w-full h-28 md:h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                  Hình minh hoạ
                </div>
                <div className="text-orange-600 font-bold">11.999₫</div>
                <div className="text-xs text-gray-600">Bán chạy</div>
              </div>
            </div>
          </div>

          {/* Trung tâm thu thập phiếu */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm mới</h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="text-center">
                <div className="w-full h-28 md:h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                  Hình minh hoạ
                </div>
                <div className="text-orange-600 font-bold">10.800₫</div>
                <div className="text-xs text-gray-600">Trả góp 0%</div>
              </div>
              <div className="text-center">
                <div className="w-full h-28 md:h-32 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">
                  Hình minh hoạ
                </div>
                <div className="text-orange-600 font-bold">1.480₫</div>
                <div className="text-xs text-gray-600">Khuyến mãi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingActions />

      <Footer />

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)} 
      />
    </div>
  );
};

export default Home;