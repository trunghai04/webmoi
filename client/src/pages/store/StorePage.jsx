import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingActions from '../../components/FloatingActions';
import { 
  FaStore, 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaEye, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe,
  FaClock,
  FaUsers,
  FaBox,
  FaTruck,
  FaShieldAlt,
  FaFilter,
  FaSort,
  FaSearch,
  FaThumbsUp,
  FaAward,
  FaMedal
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const StorePage = () => {
  const { storeId } = useParams();
  const { user } = useContext(AuthContext);
  const { addToCart, addToWishlist } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  // Mock store data
  const [storeData, setStoreData] = useState({
    id: storeId,
    name: 'Shop Thời Trang ABC',
    description: 'Chuyên cung cấp các sản phẩm thời trang chất lượng cao với giá cả hợp lý. Chúng tôi cam kết mang đến những sản phẩm tốt nhất cho khách hàng.',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    rating: 4.8,
    reviewCount: 156,
    followerCount: 2340,
    productCount: 89,
    orderCount: 1256,
    address: '123 Đường ABC, Quận 1, TP.HCM',
    phone: '0123456789',
    email: 'shop@example.com',
    website: 'https://shopabc.com',
    businessHours: '08:00 - 22:00 (Thứ 2 - Chủ nhật)',
    established: '2020',
    category: 'Thời trang',
    verified: true,
    premium: true,
    stats: {
      totalSales: 12500000,
      totalOrders: 1256,
      totalProducts: 89,
      totalCustomers: 2340
    }
  });

  // Mock products data
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockProducts = [
        {
          id: 1,
          name: 'Áo thun nam basic',
          price: 150000,
          originalPrice: 200000,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300',
          rating: 4.8,
          reviewCount: 45,
          sales: 234,
          category: 'Áo thun',
          isHot: true,
          isNew: false
        },
        {
          id: 2,
          name: 'Quần jean nữ slim fit',
          price: 350000,
          originalPrice: 450000,
          image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300',
          rating: 4.6,
          reviewCount: 38,
          sales: 189,
          category: 'Quần jean',
          isHot: true,
          isNew: false
        },
        {
          id: 3,
          name: 'Váy đầm dự tiệc',
          price: 550000,
          originalPrice: 750000,
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300',
          rating: 4.9,
          reviewCount: 67,
          sales: 145,
          category: 'Váy đầm',
          isHot: false,
          isNew: true
        },
        {
          id: 4,
          name: 'Áo khoác denim',
          price: 450000,
          originalPrice: 600000,
          image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=300',
          rating: 4.7,
          reviewCount: 52,
          sales: 178,
          category: 'Áo khoác',
          isHot: true,
          isNew: false
        },
        {
          id: 5,
          name: 'Giày sneaker unisex',
          price: 650000,
          originalPrice: 850000,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
          rating: 4.5,
          reviewCount: 41,
          sales: 123,
          category: 'Giày dép',
          isHot: false,
          isNew: true
        },
        {
          id: 6,
          name: 'Túi xách thời trang',
          price: 280000,
          originalPrice: 380000,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300',
          rating: 4.4,
          reviewCount: 29,
          sales: 98,
          category: 'Túi xách',
          isHot: false,
          isNew: false
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by tab
    if (activeTab === 'hot') {
      filtered = filtered.filter(product => product.isHot);
    } else if (activeTab === 'new') {
      filtered = filtered.filter(product => product.isNew);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      default: // popular
        filtered.sort((a, b) => b.sales - a.sales);
    }

    setFilteredProducts(filtered);
  }, [products, activeTab, sortBy]);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product);
    toast.success(`Đã thêm "${product.name}" vào yêu thích!`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
      />

      {/* Store Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 md:h-80 bg-gradient-to-r from-orange-400 to-pink-500 relative overflow-hidden">
          <img 
            src={storeData.coverImage} 
            alt="Store Cover" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Store Info */}
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <img 
                  src={storeData.avatar} 
                  alt={storeData.name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
                {storeData.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
                    <FaShieldAlt className="w-4 h-4" />
                  </div>
                )}
                {storeData.premium && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full">
                    <FaAward className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Store Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                      {storeData.name}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400" />
                        <span className="font-medium">{storeData.rating}</span>
                        <span>({formatNumber(storeData.reviewCount)} đánh giá)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-blue-500" />
                        <span>{formatNumber(storeData.followerCount)} người theo dõi</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                      <FaHeart className="mr-2" />
                      Theo dõi
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FaEnvelope className="mr-2" />
                      Liên hệ
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{storeData.description}</p>

                {/* Store Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-500">{formatNumber(storeData.stats.totalProducts)}</div>
                    <div className="text-sm text-gray-600">Sản phẩm</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-green-500">{formatNumber(storeData.stats.totalOrders)}</div>
                    <div className="text-sm text-gray-600">Đơn hàng</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-500">{formatNumber(storeData.stats.totalCustomers)}</div>
                    <div className="text-sm text-gray-600">Khách hàng</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-500">{formatCurrency(storeData.stats.totalSales)}</div>
                    <div className="text-sm text-gray-600">Doanh thu</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Store Contact Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{storeData.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaPhone className="text-green-500" />
                  <span>{storeData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaEnvelope className="text-blue-500" />
                  <span>{storeData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-orange-500" />
                  <span>{storeData.businessHours}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Products Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sản phẩm của cửa hàng</h2>
            <p className="text-gray-600">{formatNumber(filteredProducts.length)} sản phẩm</p>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-white text-orange-500 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('hot')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'hot' 
                    ? 'bg-white text-orange-500 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Bán chạy
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'new' 
                    ? 'bg-white text-orange-500 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Mới nhất
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="popular">Phổ biến nhất</option>
              <option value="sales">Bán chạy nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
              <option value="price-low">Giá tăng dần</option>
              <option value="price-high">Giá giảm dần</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isHot && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FaMedal />
                      Hot
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Mới
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <FaHeart className="text-red-500 text-sm" />
                  </button>
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                    <FaEye className="text-gray-600 text-sm" />
                  </button>
                </div>

                {/* Discount Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
                  <Link to={`/product/${product.id}`}>
                    {product.name}
                  </Link>
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-sm text-gray-400">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-orange-500">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Sales Info */}
                <div className="text-xs text-gray-500 mb-3">
                  Đã bán {formatNumber(product.sales)}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaShoppingCart className="text-sm" />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FaBox className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">Không có sản phẩm nào</h3>
            <p className="text-gray-500">Cửa hàng chưa có sản phẩm trong danh mục này</p>
          </div>
        )}
      </div>

      <FloatingActions />
      <Footer />
    </div>
  );
};

export default StorePage;
