import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  FaStar, 
  FaHeart, 
  FaShoppingCart, 
  FaTshirt, 
  FaHome, 
  FaMobile, 
  FaBaby, 
  FaHeartbeat, 
  FaStore, 
  FaCoffee, 
  FaCamera, 
  FaDesktop,
  FaFilter,
  FaSort,
  FaList,
  FaTh
} from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { toast } from "react-toastify";

const Categories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [showFilters, setShowFilters] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || '';

  // Mock categories with icons
  const categoryIcons = {
    'Thời trang': FaTshirt,
    'Nhà cửa': FaHome,
    'Điện thoại': FaMobile,
    'Trẻ em': FaBaby,
    'Làm đẹp': FaHeartbeat,
    'Xe cộ': FaStore,
    'Thực phẩm': FaCoffee,
    'Máy ảnh': FaCamera,
    'Máy tính': FaDesktop,
  };

  // Handle scroll event for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Mock categories if API fails
        setCategories([
          { id: 1, name: 'Thời trang', description: 'Quần áo, giày dép, phụ kiện' },
          { id: 2, name: 'Điện tử', description: 'Điện thoại, laptop, máy tính' },
          { id: 3, name: 'Phụ kiện', description: 'Phụ kiện điện tử, gia dụng' },
          { id: 4, name: 'Nhà cửa', description: 'Đồ gia dụng, nội thất' },
          { id: 5, name: 'Làm đẹp', description: 'Mỹ phẩm, chăm sóc cá nhân' },
        ]);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products by category
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${API_BASE}/api/products?limit=20&sort_by=${sortBy}&sort_order=${sortOrder}`;
        if (categoryId) {
          url = `${API_BASE}/api/products/category/${categoryId}?limit=20&sort_by=${sortBy}&sort_order=${sortOrder}`;
        }
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.data?.products || []);
          
          // Set current category
          if (categoryId) {
            const category = categories.find(cat => cat.id === parseInt(categoryId));
            setCurrentCategory(category);
          } else {
            setCurrentCategory(null);
          }
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchProducts();
    }
  }, [categoryId, categories, sortBy, sortOrder]);

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
      quantity: 1
    };
    
    addToCart(cartProduct);
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const ProductCard = ({ product }) => {
    const originalPrice = Number(product.original_price || product.price || 0);
    const currentPrice = Number(product.flash_sale_price || product.price || 0);
    const hasDiscount = originalPrice > currentPrice;
    const discountPercent = hasDiscount ? Math.round((1 - (currentPrice / originalPrice)) * 100) : 0;

    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow flex gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-32 h-32 object-cover rounded-lg cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            />
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                -{discountPercent}%
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 
              className="font-semibold text-gray-800 text-lg mb-2 cursor-pointer hover:text-orange-600 line-clamp-2"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 mb-2">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm text-gray-600">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.total_reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-orange-600 font-bold text-xl">
                  ₫{currentPrice.toLocaleString()}
                </div>
                {hasDiscount && (
                  <div className="text-gray-400 text-sm line-through">
                    ₫{originalPrice.toLocaleString()}
                  </div>
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <FaShoppingCart />
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow relative">
        <div className="relative mb-3" onClick={() => navigate(`/product/${product.id}`)}>
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
        <h3 
          className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 h-10"
          onClick={() => navigate(`/product/${product.id}`)}
        >
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
      
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-orange-500 hover:text-orange-600">Trang chủ</Link>
            <span className="text-gray-400">/</span>
            {currentCategory ? (
              <>
                <Link to="/categories" className="text-orange-500 hover:text-orange-600">Danh mục</Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700">{currentCategory.name}</span>
              </>
            ) : (
              <span className="text-gray-700">Tất cả danh mục</span>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Categories */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Danh mục sản phẩm</h3>
              <div className="space-y-2">
                <Link
                  to="/categories"
                  className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors ${
                    !categoryId ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                  }`}
                >
                  <FaTh className="text-sm" />
                  <span className="text-sm">Tất cả sản phẩm</span>
                </Link>
                {categories.map((category) => {
                  const IconComponent = categoryIcons[category.name] || FaStore;
                  return (
                    <Link
                      key={category.id}
                      to={`/categories/${category.id}`}
                      className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-orange-50 transition-colors ${
                        categoryId === category.id.toString() ? 'bg-orange-50 text-orange-600' : 'text-gray-700'
                      }`}
                    >
                      <IconComponent className="text-sm" />
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header with title and controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {currentCategory ? currentCategory.name : 'Tất cả sản phẩm'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {loading ? 'Đang tải...' : `${products.length} sản phẩm`}
                </p>
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

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="text-lg text-gray-600">Đang tải sản phẩm...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <div className="text-xl text-gray-600 mb-2">Không tìm thấy sản phẩm</div>
                <div className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác</div>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
                : "space-y-4"
              }>
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

export default Categories;

