import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { 
  FaHeart, 
  FaTrash, 
  FaShoppingCart, 
  FaEye,
  FaArrowLeft,
  FaSearch,
  FaFilter,
  FaSort,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  
  const [wishlistItems, setWishlistItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);

  // Mock wishlist data
  const mockWishlistItems = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      price: 29990000,
      originalPrice: 32990000,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      category: 'Điện thoại',
      rating: 4.8,
      reviews: 1250,
      inStock: true,
      addedDate: new Date('2024-01-15')
    },
    {
      id: 2,
      name: 'MacBook Air M2',
      price: 25990000,
      originalPrice: 27990000,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      category: 'Laptop',
      rating: 4.9,
      reviews: 890,
      inStock: true,
      addedDate: new Date('2024-01-10')
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      price: 27990000,
      originalPrice: 29990000,
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
      category: 'Điện thoại',
      rating: 4.7,
      reviews: 756,
      inStock: false,
      addedDate: new Date('2024-01-08')
    },
    {
      id: 4,
      name: 'AirPods Pro 2',
      price: 5990000,
      originalPrice: 6990000,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
      category: 'Phụ kiện',
      rating: 4.6,
      reviews: 2340,
      inStock: true,
      addedDate: new Date('2024-01-05')
    },
    {
      id: 5,
      name: 'iPad Pro 12.9',
      price: 22990000,
      originalPrice: 24990000,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
      category: 'Máy tính bảng',
      rating: 4.8,
      reviews: 567,
      inStock: true,
      addedDate: new Date('2024-01-03')
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWishlistItems(mockWishlistItems);
      setFilteredItems(mockWishlistItems);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/wishlist' } });
      return;
    }
  }, [isAuthenticated, navigate]);

  // Filter and sort items
  useEffect(() => {
    let filtered = wishlistItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'date':
        default:
          return new Date(b.addedDate) - new Date(a.addedDate);
      }
    });

    setFilteredItems(filtered);
  }, [wishlistItems, searchQuery, sortBy]);

  const handleRemoveFromWishlist = (itemId) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    toast.success('Đã xóa khỏi danh sách yêu thích');
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    toast.success('Đã thêm vào giỏ hàng');
  };

  const handleViewProduct = (itemId) => {
    navigate(`/product/${itemId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
              >
                <FaArrowLeft className="mr-2" />
                Quay lại
              </button>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <FaHeart className="mr-3 text-red-500" />
                Danh sách yêu thích
              </h1>
            </div>
            <div className="text-gray-600">
              {wishlistItems.length} sản phẩm
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="date">Mới nhất</option>
                  <option value="price-low">Giá tăng dần</option>
                  <option value="price-high">Giá giảm dần</option>
                  <option value="name">Tên A-Z</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>

              {/* Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="phone">Điện thoại</option>
                  <option value="laptop">Laptop</option>
                  <option value="tablet">Máy tính bảng</option>
                  <option value="accessory">Phụ kiện</option>
                </select>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-12 text-center"
            >
              <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">
                Danh sách yêu thích trống
              </h2>
              <p className="text-gray-500 mb-6">
                Bạn chưa có sản phẩm nào trong danh sách yêu thích
              </p>
              <button
                onClick={() => navigate('/products')}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Khám phá sản phẩm
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() => handleViewProduct(item.id)}
                          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                          title="Xem chi tiết"
                        >
                          <FaEye className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                          title="Xóa khỏi yêu thích"
                        >
                          <FaTrash className="text-red-500" />
                        </button>
                      </div>
                      {!item.inStock && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
                          Hết hàng
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      
                      <h3 className="font-medium text-gray-800 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {renderStars(item.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({item.reviews})
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-3">
                        <span className="text-lg font-bold text-gray-800">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {/* Added Date */}
                      <div className="text-xs text-gray-500 mb-4">
                        Đã thêm: {formatDate(item.addedDate)}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            item.inStock
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <FaShoppingCart className="inline mr-1" />
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Bulk Actions */}
          {filteredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 mt-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      const inStockItems = filteredItems.filter(item => item.inStock);
                      inStockItems.forEach(item => handleAddToCart(item));
                      toast.success(`Đã thêm ${inStockItems.length} sản phẩm vào giỏ hàng`);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Thêm tất cả vào giỏ hàng
                  </button>
                  <button
                    onClick={() => {
                      setWishlistItems([]);
                      toast.success('Đã xóa tất cả khỏi danh sách yêu thích');
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="text-gray-600">
                  Tổng giá trị: {formatPrice(filteredItems.reduce((sum, item) => sum + item.price, 0))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
