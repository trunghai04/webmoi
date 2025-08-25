import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/FloatingActions';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaEye, 
  FaCalendar,
  FaTag,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaStar,
  FaShare,
  FaDownload,
  FaPrint
} from 'react-icons/fa';

const ProductDetail = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Mock product data
  const [product] = useState({
    id: parseInt(id),
    name: 'Áo thun nam basic',
    description: 'Áo thun nam chất liệu cotton 100%, thoáng mát, dễ giặt. Phù hợp cho mọi lứa tuổi, có thể mặc đi làm, đi chơi hoặc ở nhà. Sản phẩm được may từ chất liệu cao cấp, đường may tinh tế, form dáng đẹp.',
    category: 'Thời trang nam',
    price: 150000,
    original_price: 200000,
    stock: 50,
    status: 'active',
    tags: 'áo thun, nam, cotton, basic',
    weight: 200,
    dimensions: '70 x 50 x 2',
    brand: 'Local Brand',
    model: 'AT001',
    warranty: 'Không bảo hành',
    return_policy: '7 ngày đổi trả',
    main_image: '/uploads/products/ao-thun-nam-1.jpg',
    images: [
      '/uploads/products/ao-thun-nam-1.jpg',
      '/uploads/products/ao-thun-nam-2.jpg',
      '/uploads/products/ao-thun-nam-3.jpg',
      '/uploads/products/ao-thun-nam-4.jpg'
    ],
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    views: 1250,
    sales: 45,
    rating: 4.5,
    reviews_count: 12
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-red-600 bg-red-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'out_of_stock': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang bán';
      case 'inactive': return 'Tạm ngưng';
      case 'draft': return 'Bản nháp';
      case 'out_of_stock': return 'Hết hàng';
      default: return 'Không xác định';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const productData = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: getStatusText(product.status),
      views: product.views,
      sales: product.sales,
      rating: product.rating
    };

    const blob = new Blob([JSON.stringify(productData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `product_${product.id}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
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
        cartItems={cartItems}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isFixed={true}
        hideSearch={true}
        hideLogoShrink={false}
        hideTopNav={true}

      />

      {/* Spacer for header */}
      <div className="h-16 md:h-20 lg:h-24"></div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/account/partner/products" className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Chi tiết sản phẩm</h1>
              <p className="text-gray-600 text-sm">Thông tin chi tiết sản phẩm #{id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <FaPrint className="text-sm" />
              <span>In</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaDownload className="text-sm" />
              <span>Xuất</span>
            </button>
            <Link
              to={`/account/partner/products/${id}/edit`}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <FaEdit className="text-sm" />
              <span>Chỉnh sửa</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h3>
              
              {/* Main Image */}
              <div className="mb-4">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/400x320?text=${product.name.charAt(0)}`;
                  }}
                />
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-full h-20 rounded-lg border-2 overflow-hidden ${
                      index === selectedImageIndex ? 'border-orange-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/80x80?text=${product.name.charAt(0)}`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>ID: {product.id}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusText(product.status)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-500">₫{product.price.toLocaleString()}</div>
                  {product.original_price > product.price && (
                    <div className="text-lg text-gray-500 line-through">₫{product.original_price.toLocaleString()}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <FaTag className="text-gray-400" />
                  <span className="text-gray-600">Danh mục:</span>
                  <span className="font-medium">{product.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaBox className="text-gray-400" />
                  <span className="text-gray-600">Tồn kho:</span>
                  <span className="font-medium">{product.stock}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaEye className="text-gray-400" />
                  <span className="text-gray-600">Lượt xem:</span>
                  <span className="font-medium">{product.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaDollarSign className="text-gray-400" />
                  <span className="text-gray-600">Đã bán:</span>
                  <span className="font-medium">{product.sales}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <FaStar className="text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-600">({product.reviews_count} đánh giá)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mô tả sản phẩm</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bổ sung</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Thương hiệu:</span>
                  <span className="font-medium ml-2">{product.brand}</span>
                </div>
                <div>
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium ml-2">{product.model}</span>
                </div>
                <div>
                  <span className="text-gray-600">Trọng lượng:</span>
                  <span className="font-medium ml-2">{product.weight}g</span>
                </div>
                <div>
                  <span className="text-gray-600">Kích thước:</span>
                  <span className="font-medium ml-2">{product.dimensions} cm</span>
                </div>
                <div>
                  <span className="text-gray-600">Bảo hành:</span>
                  <span className="font-medium ml-2">{product.warranty}</span>
                </div>
                <div>
                  <span className="text-gray-600">Đổi trả:</span>
                  <span className="font-medium ml-2">{product.return_policy}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.split(',').map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FaEye className="text-blue-500 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{product.views.toLocaleString()}</div>
                  <div className="text-sm text-blue-600">Lượt xem</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FaDollarSign className="text-green-500 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{product.sales}</div>
                  <div className="text-sm text-green-600">Đã bán</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <FaStar className="text-yellow-500 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{product.rating}</div>
                  <div className="text-sm text-yellow-600">Đánh giá</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch sử</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <div className="font-medium">Tạo sản phẩm</div>
                    <div className="text-sm text-gray-600">{product.created_at}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <div className="font-medium">Cập nhật lần cuối</div>
                    <div className="text-sm text-gray-600">{product.updated_at}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer hideCart={true} />
    </div>
  );
};

export default ProductDetail;
