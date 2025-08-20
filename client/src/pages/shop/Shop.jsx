import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaStar, 
  FaHeart, 
  FaShoppingCart, 
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaUsers,
  FaBox,
  FaTruck,
  FaShieldAlt,
  FaMedal,
  FaThumbsUp,
  FaFilter,
  FaSort,
  FaList,
  FaTh
} from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingActions from '../../components/FloatingActions';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';

const Shop = () => {
  const { shopId } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');

  const API_BASE = import.meta.env.VITE_API_URL || '';

  // Handle scroll event for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch shop data and products
  useEffect(() => {
    const fetchShopData = async () => {
      setLoading(true);
      try {
        // Mock shop data
        const mockShop = {
          id: shopId || 1,
          name: 'MuaSamViet Shop',
          avatar: '/uploads/products/default.svg',
          cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
          description: 'Shop chuyên cung cấp các sản phẩm điện tử chất lượng cao với giá cả hợp lý. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.',
          rating: 4.8,
          totalReviews: 1250,
          followers: 15000,
          products: 150,
          responseRate: 98,
          responseTime: 'trong vài giờ',
          joined: '4 năm trước',
          location: 'Hà Nội, Việt Nam',
          phone: '0123456789',
          email: 'contact@muasamviet.com',
          workingHours: '8:00 - 22:00',
          categories: ['Điện tử', 'Phụ kiện', 'Gia dụng'],
          policies: [
            'Giao hàng toàn quốc',
            'Đổi trả trong 30 ngày',
            'Bảo hành chính hãng',
            'Thanh toán an toàn'
          ]
        };

        setShop(mockShop);

        // Fetch shop products
        const response = await fetch(`${API_BASE}/api/products?limit=20&sort_by=${sortBy}&sort_order=${sortOrder}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data?.products || []);
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId, sortBy, sortOrder]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: Number(product.flash_sale_price || product.price || 0),
      image: product.primary_image,
      quantity: 1,
      shopName: shop.name
    };
    
    addToCart(cartProduct);
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const ProductCard = ({ product }) => {
    const originalPrice = Number(product.original_price || product.price || 0);
    const currentPrice = Number(product.flash_sale_price || product.price || 0);
    const hasDiscount = originalPrice > currentPrice;
    const discountPercent = hasDiscount ? Math.round((1 - (currentPrice / originalPrice)) * 100) : 0;

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow relative">
        <div className="relative mb-3">
          <img
            src={product.primary_image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          {hasDiscount && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
              -{discountPercent}%
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            className="absolute top-2 right-2 bg-white text-gray-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-md"
          >
            <FaShoppingCart className="text-sm" />
          </button>
        </div>
        <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 h-10">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-xs text-gray-600">{product.rating}</span>
            <span className="text-xs text-gray-400">({product.total_reviews})</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-orange-600 font-bold text-lg">
              ₫{currentPrice.toLocaleString()}
            </div>
            {hasDiscount && (
              <div className="text-gray-400 text-sm line-through">
                ₫{originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải thông tin shop...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Không tìm thấy shop</div>
      </div>
    );
  }

  return (
    <>
      <Header
        isScrolled={isScrolled}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="h-20 md:h-24 lg:h-32"></div>
      
      {/* Shop Header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-orange-500 to-red-500 relative">
          <img 
            src={shop.cover} 
            alt={shop.name}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-4 left-4 md:left-8 text-white">
            <div className="flex items-center gap-4">
              <img 
                src={shop.avatar} 
                alt={shop.name}
                className="w-20 h-20 rounded-full border-4 border-white"
              />
              <div>
                <h1 className="text-2xl font-bold">{shop.name}</h1>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span>{shop.rating}</span>
                    <span>({shop.totalReviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaUsers />
                    <span>{shop.followers.toLocaleString()} người theo dõi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Shop Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin shop</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-orange-500" />
                  <span>{shop.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-orange-500" />
                  <span>{shop.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-orange-500" />
                  <span>{shop.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-orange-500" />
                  <span>{shop.workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers className="text-orange-500" />
                  <span>Tham gia {shop.joined}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Chính sách</h4>
                <div className="space-y-2">
                  {shop.policies.map((policy, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <FaShieldAlt className="text-green-500" />
                      <span>{policy}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-gray-800 mb-2">Danh mục</h4>
                <div className="flex flex-wrap gap-2">
                  {shop.categories.map((category, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-orange-100 text-orange-600 text-xs rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Thống kê</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-500">{shop.products}</div>
                  <div className="text-xs text-gray-600">Sản phẩm</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{shop.followers.toLocaleString()}</div>
                  <div className="text-xs text-gray-600">Người theo dõi</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{shop.rating}</div>
                  <div className="text-xs text-gray-600">Đánh giá</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">{shop.responseRate}%</div>
                  <div className="text-xs text-gray-600">Phản hồi</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Products */}
          <div className="lg:col-span-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Sản phẩm của {shop.name}</h2>
                <p className="text-gray-600 text-sm">{products.length} sản phẩm</p>
              </div>
              
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <FaTh />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <FaList />
                  </button>
                </div>

                {/* Sort Options */}
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="created_at-DESC">Mới nhất</option>
                  <option value="price-ASC">Giá thấp đến cao</option>
                  <option value="price-DESC">Giá cao đến thấp</option>
                  <option value="rating-DESC">Đánh giá cao nhất</option>
                  <option value="name-ASC">Tên A-Z</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <div className="text-xl text-gray-600 mb-2">Shop chưa có sản phẩm</div>
                <div className="text-gray-500">Hãy quay lại sau!</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingActions />
      <Footer />
    </>
  );
};

export default Shop;
