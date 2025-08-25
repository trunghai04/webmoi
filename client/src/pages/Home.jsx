import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginPopup from "../components/LoginPopup";
import FloatingActions from "../components/FloatingActions";
import { 
  FaShoppingCart, 
  FaHeart, 
  FaTshirt,
  FaMobile,
  FaHome,
  FaHeartbeat,
  FaCoffee,
  FaBaby,
  FaUser,
  FaStore,
  FaGift,
  FaBookmark,
  FaHeadset,
  FaCamera,
  FaDesktop,
  FaBicycle,
  FaFan,
  FaGem,
  FaEllipsisH,
  FaChevronRight,
  FaStar,
  FaArrowRight,
  FaTags,
  FaFire,
  FaRegClock,
  FaShoppingBag,
  FaBox,
  FaShippingFast,
  FaAward,
  FaStoreAlt,
  FaLaptop,
  FaTv,
  FaMusic,
  FaUtensils,
  FaTools,
  FaCar
} from "react-icons/fa";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 12,
    seconds: 33
  });

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer for flash sale
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newSeconds = prevTime.seconds - 1;
        const newMinutes = newSeconds < 0 ? prevTime.minutes - 1 : prevTime.minutes;
        const newHours = newMinutes < 0 ? prevTime.hours - 1 : prevTime.hours;
        
        return {
          hours: newHours < 0 ? 0 : newHours,
          minutes: newMinutes < 0 ? 59 : newMinutes,
          seconds: newSeconds < 0 ? 59 : newSeconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Mock banner data with better images
        setBanners([
          {
            id: 1,
            image_url: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            title: "Siêu sale tháng 11",
            subtitle: "Giảm giá đến 50% cho tất cả sản phẩm",
            link_url: "#"
          },
          {
            id: 2,
            image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            title: "Hàng mới về",
            subtitle: "Cập nhật mỗi tuần",
            link_url: "#"
          },
          {
            id: 3,
            image_url: "https://images.unsplash.com/photo-1608506375591-b91b98fe3188?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            title: "Miễn phí vận chuyển",
            subtitle: "Cho đơn từ 299K",
            link_url: "#"
          },
          {
            id: 4,
            image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
            title: "Sale công nghệ",
            subtitle: "Điện thoại, laptop giảm sâu",
            link_url: "#"
          }
        ]);
      } catch (e) {
        console.error("Error loading banners:", e);
      }
    };
    fetchBanners();
  }, []);

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Mock product data with better images
        const mockProducts = [
          {
            product_id: 1,
            name: "Áo thun nam chất liệu cotton thoáng mát",
            price: 199000,
            original_price: 299000,
            discount: 33,
            rating: 4.5,
            review_count: 128,
            badge: 'Bán chạy',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80'
          },
          {
            product_id: 2,
            name: "Điện thoại smartphone Android 128GB",
            price: 5490000,
            original_price: 6490000,
            discount: 15,
            rating: 4.8,
            review_count: 256,
            badge: 'Nổi bật',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80'
          },
          {
            product_id: 3,
            name: "Tai nghe không dây chống ồn chủ động",
            price: 890000,
            original_price: 1290000,
            discount: 31,
            rating: 4.3,
            review_count: 87,
            badge: 'Giảm sốc',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          },
          {
            product_id: 4,
            name: "Giày thể thao nam đế cao su chống trượt",
            price: 659000,
            original_price: 899000,
            discount: 27,
            rating: 4.6,
            review_count: 204,
            badge: 'Bán chạy',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
          },
          {
            product_id: 5,
            name: "Túi xách nữ da thật phong cách Hàn Quốc",
            price: 759000,
            original_price: 999000,
            discount: 24,
            rating: 4.7,
            review_count: 152,
            badge: 'Nổi bật',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1135&q=80'
          },
          {
            product_id: 6,
            name: "Laptop gaming cấu hình mạnh RTX 3060",
            price: 24590000,
            original_price: 28990000,
            discount: 15,
            rating: 4.9,
            review_count: 89,
            badge: 'Gaming',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1168&q=80'
          },
          {
            product_id: 7,
            name: "Đồng hồ thông minh theo dõi sức khỏe",
            price: 1250000,
            original_price: 1890000,
            discount: 34,
            rating: 4.4,
            review_count: 203,
            badge: 'Thông minh',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1099&q=80'
          },
          {
            product_id: 8,
            name: "Máy ảnh mirrorless 24.2MP quay 4K",
            price: 18990000,
            original_price: 21990000,
            discount: 14,
            rating: 4.7,
            review_count: 56,
            badge: 'Chuyên nghiệp',
            shipping: 'Miễn phí vận chuyển',
            image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1138&q=80'
          }
        ];
        setFeaturedProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Categories data - 16 categories in 2 rows of 8
  const categories = [
    { icon: <FaTshirt className="text-2xl" />, name: "Thời trang", path: "/categories/1", color: "bg-pink-500" },
    { icon: <FaMobile className="text-2xl" />, name: "Điện thoại", path: "/categories/2", color: "bg-blue-500" },
    { icon: <FaLaptop className="text-2xl" />, name: "Laptop", path: "/categories/3", color: "bg-purple-500" },
    { icon: <FaTv className="text-2xl" />, name: "TV & Màn hình", path: "/categories/4", color: "bg-green-500" },
    { icon: <FaHome className="text-2xl" />, name: "Nhà cửa", path: "/categories/5", color: "bg-yellow-500" },
    { icon: <FaHeartbeat className="text-2xl" />, name: "Sức khỏe", path: "/categories/6", color: "bg-red-500" },
    { icon: <FaBicycle className="text-2xl" />, name: "Thể thao", path: "/categories/7", color: "bg-cyan-500" },
    { icon: <FaBaby className="text-2xl" />, name: "Trẻ em", path: "/categories/8", color: "bg-indigo-500" },
    { icon: <FaCamera className="text-2xl" />, name: "Máy ảnh", path: "/categories/9", color: "bg-teal-500" },
    { icon: <FaCar className="text-2xl" />, name: "Ô tô", path: "/categories/10", color: "bg-orange-500" },
    { icon: <FaMusic className="text-2xl" />, name: "Âm thanh", path: "/categories/11", color: "bg-lime-500" },
    { icon: <FaBookmark className="text-2xl" />, name: "Sách", path: "/categories/12", color: "bg-amber-500" },
    { icon: <FaUtensils className="text-2xl" />, name: "Đồ ăn", path: "/categories/13", color: "bg-emerald-500" },
    { icon: <FaTools className="text-2xl" />, name: "Công cụ", path: "/categories/14", color: "bg-rose-500" },
    { icon: <FaGift className="text-2xl" />, name: "Quà tặng", path: "/categories/15", color: "bg-violet-500" },
    { icon: <FaEllipsisH className="text-2xl" />, name: "Khác", path: "/categories/16", color: "bg-gray-500" },
  ];

  // Flash Sale Component
  const FlashSale = () => {
    const flashSaleProducts = featuredProducts.slice(0, 5);
    
    return (
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex space-x-4 min-w-max py-2">
          {flashSaleProducts.map((product) => (
            <motion.div 
              key={product.product_id} 
              whileHover={{ y: -5 }}
              className="w-56 flex-shrink-0 bg-white rounded-xl shadow-md p-4 border border-orange-100 transition-all hover:shadow-lg"
            >
              <div className="relative mb-3">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  -{product.discount}%
                </div>
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 leading-tight h-12">
                {product.name}
              </h3>
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} 
                      size={12} 
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({product.review_count})</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="text-orange-600 font-bold text-base">
                  {product.price.toLocaleString('vi-VN')}₫
                </div>
                {product.original_price > product.price && (
                  <div className="text-gray-400 text-xs line-through">
                    {product.original_price.toLocaleString('vi-VN')}₫
                  </div>
                )}
              </div>
              <div className="mt-3 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.floor(Math.random() * 50) + 50}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Đã bán {Math.floor(Math.random() * 100) + 50}</div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

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
        className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-xl transition-all duration-300 relative flex flex-col border border-gray-100 group"
        onClick={goToDetails}
      >
        <div className="relative mb-4 flex-shrink-0 overflow-hidden rounded-lg">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-md">
              -{product.discount}%
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 bg-white text-gray-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-md transform group-hover:scale-110"
          >
            <FaShoppingCart className="text-sm" />
          </button>
        </div>
        
        <div className="flex-1 flex flex-col">
          <h3 className="font-medium text-gray-800 text-sm mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"} 
                  size={12} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({product.review_count})</span>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center justify-between">
              <div className="text-orange-600 font-bold text-base">
                {product.price.toLocaleString('vi-VN')}₫
              </div>
              {product.original_price > product.price && (
                <div className="text-gray-400 text-xs line-through">
                  {product.original_price.toLocaleString('vi-VN')}₫
                </div>
              )}
            </div>
            <div className="mt-1 flex items-center">
              <span className="text-xs text-gray-500">{product.shipping}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Service features component
  const ServiceFeatures = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        { icon: <FaShippingFast className="text-2xl text-orange-500" />, title: "Miễn phí vận chuyển", desc: "Cho đơn từ 299K" },
        { icon: <FaBox className="text-2xl text-orange-500" />, title: "Đổi trả dễ dàng", desc: "Trong 7 ngày" },
        { icon: <FaAward className="text-2xl text-orange-500" />, title: "Cam kết chính hãng", desc: "100% sản phẩm" },
        { icon: <FaStoreAlt className="text-2xl text-orange-500" />, title: "Hỗ trợ 24/7", desc: "Luôn sẵn sàng" }
      ].map((service, idx) => (
        <div key={idx} className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-3">
          <div className="bg-orange-50 p-3 rounded-full">
            {service.icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{service.title}</h3>
            <p className="text-xs text-gray-500">{service.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );

  // Categories component - 2 rows of 8 icons
  const CategoriesSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <FaTags className="mr-3 text-orange-500" />
        Danh mục sản phẩm
      </h2>
      
      {/* First row of categories */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-4">
        {categories.slice(0, 8).map((category, index) => (
          <Link
            key={index}
            to={category.path}
            className="flex flex-col items-center p-3 rounded-xl hover:bg-orange-50 transition-all duration-300 group"
          >
            <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-2 text-white group-hover:scale-110 transition-transform`}>
              {category.icon}
            </div>
          </Link>
        ))}
      </div>
      
      {/* Second row of categories */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {categories.slice(8, 16).map((category, index) => (
          <Link
            key={index+8}
            to={category.path}
            className="flex flex-col items-center p-3 rounded-xl hover:bg-orange-50 transition-all duration-300 group"
          >
            <div className={`w-14 h-14 ${category.color} rounded-full flex items-center justify-center mb-2 text-white group-hover:scale-110 transition-transform`}>
              {category.icon}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isScrolled={isScrolled}
        cartItems={cartItems}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Banner */}
        <div className="rounded-2xl overflow-hidden shadow-xl mb-8 relative">
          {banners.length > 0 && (
            <div className="relative h-56 md:h-96">
              <img
                src={banners[0].image_url}
                alt={banners[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                <div className="text-white p-8 max-w-lg">
                  <h1 className="text-3xl md:text-5xl font-bold mb-3">{banners[0].title}</h1>
                  <p className="text-xl mb-6">{banners[0].subtitle}</p>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Service Features */}
        <ServiceFeatures />

        {/* Categories Section - 2 rows of icons */}
        <CategoriesSection />

        {/* Promotional Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {banners.slice(1, 3).map((banner, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              <img 
                src={banner.image_url} 
                alt={banner.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 text-lg">{banner.title}</h3>
                <p className="text-gray-600 mt-2">{banner.subtitle}</p>
                <button className="text-orange-500 font-medium mt-4 flex items-center group">
                  Xem ngay <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Flash Sale Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div className="flex items-center mb-3 md:mb-0">
              <div className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-lg mr-3 flex items-center">
                <FaFire className="mr-2" /> FLASH SALE
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Deal siêu hot</h2>
            </div>
            <div className="flex items-center text-red-500 font-medium">
              <FaRegClock className="mr-2" /> 
              Kết thúc trong: 
              <span className="bg-red-100 text-red-600 py-1 px-2 rounded-md ml-2 font-mono">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <FlashSale />
        </div>

        {/* Featured Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <FaShoppingBag className="mr-3 text-orange-500" /> Sản phẩm nổi bật
            </h2>
            <Link to="/products" className="text-orange-500 font-medium flex items-center group">
              Xem tất cả <FaChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white mb-8 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -right-5 -bottom-5 w-28 h-28 bg-white/10 rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 text-center md:text-left md:w-1/2">
              <h2 className="text-3xl font-bold mb-3">Đăng ký nhận thông báo khuyến mãi</h2>
              <p className="text-orange-100 text-lg">Nhận thông báo khi có sản phẩm mới và chương trình giảm giá đặc biệt</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="px-5 py-4 rounded-l-xl focus:outline-none text-gray-800 w-full md:w-64 shadow-inner"
              />
              <button className="bg-gray-900 text-white px-6 py-4 rounded-r-xl font-medium hover:bg-gray-800 transition-colors shadow-lg">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Floating Actions */}
      <FloatingActions />

      {/* Login Popup */}
      <LoginPopup 
        isOpen={showLoginPopup} 
        onClose={() => setShowLoginPopup(false)} 
      />
    </div>
  );
};

export default Home;