import React, { useState, useContext, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay,
  FaHeart,
  FaFacebookMessenger,
  FaFacebook,
  FaPinterest,
  FaTwitter,
  FaThumbsUp,
  FaEllipsisV,
  FaCheck,
  FaShoppingCart,
  FaMapMarkerAlt
} from "react-icons/fa";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import LoginPopup from "../../components/LoginPopup";

import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isReady } = useContext(AuthContext);
  const { addToCart, cartItems } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("M2_Ngẫu Nhiên");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);


  const API_BASE = import.meta.env.VITE_API_URL || '';

  const reviews = [];

  const [selectedReviewFilter, setSelectedReviewFilter] = useState("all");

  // Load product data based on ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products/${id}`);
        if (!res.ok) {
          console.error('Failed to fetch product:', res.status);
          return;
        }
        const json = await res.json();
        const p = json?.data?.product;
        if (!p) {
          console.error('No product data found');
          return;
        }
        
        // Map images from API response
        const images = (p.images && p.images.length > 0)
          ? p.images.map(i => i.image_url)
          : [p.primary_image || '/uploads/products/default.svg'];
        
        // Calculate discount
        const originalPrice = Number(p.original_price || p.price || 0);
        const currentPrice = Number(p.flash_sale_price || p.price || 0);
        const hasDiscount = originalPrice > currentPrice;
        
        setProduct({
          id: p.id,
          name: p.name,
          price: originalPrice,
          discountPrice: currentPrice,
          originalPrice: originalPrice,
          flashSalePrice: p.flash_sale_price ? Number(p.flash_sale_price) : null,
          rating: Number(p.rating || 0),
          reviewCount: Number(p.total_reviews || 0),
          images,
          description: p.description,
          brand: p.brand,
          category: p.category_name,
          stock: Number(p.stock || 0),
          variants: [],
          shop: {
            name: p.brand || 'MuaSamViet Shop',
            avatar: '/uploads/products/default.svg',
            online: '2 Giờ Trước',
            rating: Number(p.rating || 0),
            responseRate: 98,
            joined: '4 năm trước',
            products: 0,
            responseTime: 'trong vài giờ',
            followers: 0,
            location: 'Việt Nam'
          },
          vouchers: [],
          shipping: {
            delivery: '20 Th08 - 21 Th08',
            fee: '₫0',
            lateVoucher: '₫15.000'
          },
          relatedProducts: p.related_products || []
        });
      } catch (e) {
        console.error('Error fetching product:', e);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Handle scroll event for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle add to cart
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.discountPrice,
      image: product.images[0],
      quantity: quantity,
      shopName: product.shop.name
    };
    
    addToCart(cartProduct);
    toast.success("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // Handle buy now
  const handleBuyNow = async (product) => {
    console.log('handleBuyNow called with product:', product);
    console.log('isAuthenticated:', isAuthenticated);
    console.log('isReady:', isReady);
    
    if (!isReady) {
      console.log('Auth not ready yet, waiting...');
      toast.info('Đang kiểm tra đăng nhập...');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('User not authenticated, showing login popup');
      setShowLoginPopup(true);
      return;
    }
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.discountPrice,
      image: product.images[0],
      quantity: quantity,
      shopName: product.shop.name
    };
    
    console.log('Created cart product:', cartProduct);
    
    try {
      // Lưu sản phẩm vào localStorage để checkout có thể sử dụng
      localStorage.setItem('checkoutItems', JSON.stringify([cartProduct]));
      console.log('Saved to localStorage successfully');
      
      // Chuyển thẳng sang trang checkout
      console.log('Navigating to checkout...');
      navigate('/checkout');
    } catch (error) {
      console.error('Error in handleBuyNow:', error);
      toast.error('Có lỗi xảy ra khi mua hàng');
    }
  };

  // Handle chat with shop
  const handleChatWithShop = () => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    navigate('/chat');
  };

  // Handle view shop
  const handleViewShop = () => {
    navigate(`/shop/${product.shop.id || 1}`);
  };

  // Handle save voucher
  const handleSaveVoucher = (voucher) => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    toast.success(`Đã lưu voucher giảm ${voucher.discount}!`);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (product) => {
    if (!isAuthenticated) {
      setShowLoginPopup(true);
      return;
    }
    toast.success("Đã thêm sản phẩm vào danh sách yêu thích!");
  };

  // Handle social sharing
  const handleShare = (platform) => {
    const url = window.location.href;
    const title = product.name;
    const text = `Xem sản phẩm ${product.name} trên MuaSamViet`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}&media=${encodeURIComponent(product.images[0])}`;
        break;
      case 'messenger':
        shareUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  // Show loading if product not loaded yet
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang tải sản phẩm...</div>
      </div>
    );
  }

  // Show loading if auth not ready yet
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Đang kiểm tra đăng nhập...</div>
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
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-2 text-sm flex items-center flex-wrap">
                 <Link to="/" className="text-orange-500 hover:text-orange-600">MuaSamViet</Link>
         <span className="mx-1 text-gray-400">&gt;</span>
         <Link to="/products" className="text-orange-500 hover:text-orange-600">Thiết Bị Điện Gia Dụng</Link>
        <span className="mx-1 text-gray-400">&gt;</span>
        <Link to="/products" className="text-orange-500 hover:text-orange-600">Quạt & Máy nóng lạnh</Link>
        <span className="mx-1 text-gray-400">&gt;</span>
        <Link to="/products" className="text-orange-500 hover:text-orange-600">Quạt</Link>
        <span className="mx-1 text-gray-400">&gt;</span>
        <span className="text-gray-700 line-clamp-1">{product.name}</span>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-4">
                 {/* Product Title and Rating */}
         <div className="mb-4">
           <h1 className="text-2xl font-bold text-black mb-4">{product.name}</h1>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1">
            {/* Main Image */}
            <div className="relative mb-4">
              <img 
                src={product.images[activeImageIndex]} 
                alt={product.name}
                className="w-full aspect-square object-cover rounded-lg"
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                        index === activeImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                      onClick={() => setActiveImageIndex(index)}
                    />
                    {index === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                        <FaPlay className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1">
                <FaChevronLeft className="text-gray-600" />
              </button>
              <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full p-1">
                <FaChevronRight className="text-gray-600" />
              </button>
            </div>

                         {/* Social Sharing */}
             <div className="flex items-center gap-4 mt-4">
               <div className="flex gap-2">
                 <button 
                   onClick={() => handleShare('messenger')}
                   className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                 >
                   <FaFacebookMessenger className="text-sm" />
                 </button>
                 <button 
                   onClick={() => handleShare('facebook')}
                   className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                 >
                   <FaFacebook className="text-sm" />
                 </button>
                 <button 
                   onClick={() => handleShare('pinterest')}
                   className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                 >
                   <FaPinterest className="text-sm" />
                 </button>
                 <button 
                   onClick={() => handleShare('twitter')}
                   className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                 >
                   <FaTwitter className="text-sm" />
                 </button>
               </div>
               <button 
                 onClick={() => handleAddToWishlist(product)}
                 className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
               >
                 <FaHeart className="text-red-500" />
                 <span className="text-sm">Thêm vào yêu thích</span>
               </button>
             </div>
          </div>

                     {/* Center Column - Product Info and Actions */}
           <div className="lg:col-span-1">
             {/* Rating and Report */}
             <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                   <div className="text-2xl font-bold text-orange-500">{product.rating}</div>
                   <div className="flex">
                     {[...Array(5)].map((_, i) => (
                       <FaStar key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
                     ))}
                   </div>
                   <span className="text-sm text-gray-600">{product.reviewCount} Đánh Giá</span>
                 </div>
               </div>
               <button className="text-sm text-red-500 hover:text-red-600 border border-red-300 px-3 py-1 rounded hover:bg-red-50">Tố cáo</button>
             </div>

             {/* Price */}
             <div className="mb-4">
               <div className="flex items-center gap-2">
                 <span className="text-3xl font-bold text-orange-500">₫{product.discountPrice.toLocaleString('vi-VN')}</span>
                 {product.originalPrice > product.discountPrice && (
                   <span className="text-lg text-gray-400 line-through">₫{product.originalPrice.toLocaleString('vi-VN')}</span>
                 )}
               </div>
               {product.flashSalePrice && (
                 <div className="text-sm text-red-600 font-semibold mt-1">
                   🔥 Flash Sale: ₫{product.flashSalePrice.toLocaleString('vi-VN')}
                 </div>
               )}
             </div>

            {/* Shop Vouchers */}
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap">
                {product.vouchers.map(voucher => (
                  <button key={voucher.id} className="px-3 py-1 bg-orange-500 text-white text-sm rounded">
                    Giảm {voucher.discount}
                  </button>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">
                Nhận từ {product.shipping.delivery}, phí giao {product.shipping.fee} &gt;
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Tặng Voucher {product.shipping.lateVoucher} nếu đơn giao sau thời gian trên.
              </div>
            </div>

            {/* Shopee Protection */}
            <div className="mb-4">
                             <div className="text-sm font-semibold mb-2">An Tâm Mua Sắm Cùng MuaSamViet</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <FaCheck className="text-green-500" />
                  <span>Bảo hiểm Thiệt hại sản phẩm</span>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaCheck className="text-green-500" />
                  <span>Bảo hiểm Thiệt hại sản phẩm</span>
                  <FaChevronRight className="text-gray-400 text-xs" />
                </div>
              </div>
            </div>

            {/* Product Variants */}
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Phân Loại</div>
              <div className="flex gap-2">
                {product.variants.map(variant => (
                  <div 
                    key={variant.id}
                    className={`border-2 rounded cursor-pointer p-2 ${
                      selectedVariant === variant.id ? 'border-orange-500' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedVariant(variant.id)}
                  >
                    <img src={variant.image} alt={variant.name} className="w-16 h-16 object-cover rounded mb-1" />
                    <div className="text-xs text-center">{variant.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <div className="text-sm font-semibold mb-2">Số Lượng</div>
              <div className="flex items-center gap-2">
                <button 
                  className="w-8 h-8 border rounded flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-8 border rounded text-center"
                />
                <button 
                  className="w-8 h-8 border rounded flex items-center justify-center"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => handleAddToCart(product)}
                className="flex-1 border-2 border-orange-500 text-orange-500 py-3 rounded flex items-center justify-center gap-2 hover:bg-orange-50 transition-colors"
              >
                <FaShoppingCart />
                Thêm Vào Giỏ Hàng
              </button>
              <button 
                onClick={() => handleBuyNow(product)}
                className="flex-1 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition-colors"
              >
                Mua Ngay ₫{product.discountPrice.toLocaleString('vi-VN')}
              </button>
            </div>
          </div>

          {/* Right Column - Shop Info and Vouchers */}
          <div className="lg:col-span-1">
            {/* Shop Profile */}
            <div className="bg-white border rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <img src={product.shop.avatar} alt={product.shop.name} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="font-semibold">{product.shop.name}</div>
                  <div className="text-sm text-green-600">Online {product.shop.online}</div>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <button 
                  onClick={() => handleChatWithShop()}
                  className="flex-1 border border-orange-500 text-orange-500 py-2 rounded text-sm hover:bg-orange-50 transition-colors"
                >
                  Chat Ngay
                </button>
                <button 
                  onClick={() => handleViewShop()}
                  className="flex-1 border border-orange-500 text-orange-500 py-2 rounded text-sm hover:bg-orange-50 transition-colors"
                >
                  Xem Shop
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>Đánh Giá: {product.shop.rating}k</div>
                <div>Tỉ Lệ Phản Hồi: {product.shop.responseRate}%</div>
                <div>Tham Gia: {product.shop.joined}</div>
                <div>Sản Phẩm: {product.shop.products}</div>
                <div>Thời Gian Phản Hồi: {product.shop.responseTime}</div>
                <div>Người Theo Dõi: {product.shop.followers}k</div>
              </div>
            </div>

            {/* Shop Vouchers */}
            <div className="bg-white border rounded-lg p-4">
              <div className="font-semibold mb-3">Voucher của Shop</div>
              <div className="space-y-3">
                {product.vouchers.map(voucher => (
                  <div key={voucher.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="font-semibold text-red-500">Giảm {voucher.discount}</div>
                      <div className="text-xs text-gray-600">Đơn Tối Thiểu {voucher.minOrder}</div>
                      <div className="text-xs text-gray-500">HSD: 08.11.2025</div>
                    </div>
                    <button 
                      onClick={() => handleSaveVoucher(voucher)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                    >
                      Lưu
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Product Details */}
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-4">CHI TIẾT SẢN PHẨM</h3>
              <div className="space-y-2 text-sm">
                <div className="flex">
                  <span className="w-32 text-gray-600">Danh Mục:</span>
                  <span>{product.category || 'Đang cập nhật'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Thương hiệu:</span>
                  <span>{product.brand || 'Đang cập nhật'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Tình trạng:</span>
                  <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Đánh giá:</span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {product.rating} ({product.reviewCount} đánh giá)
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">Gửi từ:</span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-orange-500" />
                    {product.shop.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-4 mb-4">
              <h3 className="font-semibold mb-4">MÔ TẢ SẢN PHẨM</h3>
              <div className="space-y-4">
                {product.description ? (
                  <div className="text-sm text-gray-700 leading-relaxed">
                    {product.description}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Chưa có mô tả chi tiết</div>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-2">Cam kết của MuaSamViet:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-sm">Hình ảnh sản phẩm giống hình 100%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-sm">Chất lượng sản phẩm đúng như mô tả</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-sm">Sản phẩm được kiểm tra kĩ càng, nghiêm ngặt trước khi giao hàng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaCheck className="text-green-500" />
                      <span className="text-sm">Đóng gói và giao hàng ngay khi nhận được đơn đặt hàng</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-1">
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold mb-4">ĐÁNH GIÁ SẢN PHẨM</h3>
              
              {/* Overall Rating */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">{product.rating} trên 5</div>
                  <div className="flex justify-center my-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`text-xl ${i < Math.floor(product.rating) ? 'text-orange-500' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  className={`px-3 py-1 rounded text-sm border ${
                    selectedReviewFilter === 'all' ? 'border-orange-500 text-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedReviewFilter('all')}
                >
                  Tất Cả
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm border ${
                    selectedReviewFilter === '5' ? 'border-orange-500 text-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedReviewFilter('5')}
                >
                  5 Sao (259)
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm border ${
                    selectedReviewFilter === '4' ? 'border-orange-500 text-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedReviewFilter('4')}
                >
                  4 Sao (41)
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm border ${
                    selectedReviewFilter === '3' ? 'border-orange-500 text-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedReviewFilter('3')}
                >
                  3 Sao (12)
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm border ${
                    selectedReviewFilter === '2' ? 'border-orange-500 text-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedReviewFilter('2')}
                >
                  2 Sao (2)
                </button>
                <button 
                  className={`px-3 py-1 rounded text-sm border ${
                    selectedReviewFilter === '1' ? 'border-orange-500 text-black' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedReviewFilter('1')}
                >
                  1 Sao (6)
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <button className="px-3 py-1 rounded text-sm border border-gray-300">
                  Có Bình Luận (108)
                </button>
                <button className="px-3 py-1 rounded text-sm border border-gray-300">
                  Có Hình Ảnh / Video (56)
                </button>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviews.map(review => (
                  <div key={review.id} className="border-t pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-600">{review.user.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{review.user}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-xs ${i < review.rating ? 'text-orange-500' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {review.date} | Phân loại hàng: {review.variant}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          Đúng với mô tả: {review.matchesDescription} | Chất lượng sản phẩm: {review.quality}
                        </div>
                        <div className="text-sm mb-2">{review.content}</div>
                        
                        {/* Review Media */}
                        {review.media.length > 0 && (
                          <div className="flex gap-2 mb-2">
                            {review.media.map((media, index) => (
                              <div key={index} className="relative">
                                <img src={media.url} alt="" className="w-16 h-16 object-cover rounded" />
                                {media.type === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                                    <FaPlay className="text-white text-xs" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-gray-600">
                            <FaThumbsUp className="text-sm" />
                            <span className="text-xs">{review.likes}</span>
                          </div>
                          <FaEllipsisV className="text-gray-400 text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold mb-6">SẢN PHẨM LIÊN QUAN</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {product.relatedProducts.map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                to={`/product/${relatedProduct.id}`}
                className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative mb-3">
                  <img
                    src={relatedProduct.primary_image}
                    alt={relatedProduct.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {relatedProduct.original_price && Number(relatedProduct.original_price) > Number(relatedProduct.price) && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                      -{Math.round((1 - (Number(relatedProduct.price) / Number(relatedProduct.original_price))) * 100)}%
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 h-10">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-xs text-gray-600">{relatedProduct.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-600 font-bold text-sm">
                      ₫{Number(relatedProduct.price).toLocaleString()}
                    </div>
                    {relatedProduct.original_price && Number(relatedProduct.original_price) > Number(relatedProduct.price) && (
                      <div className="text-gray-400 text-xs line-through">
                        ₫{Number(relatedProduct.original_price).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <FloatingActions />
      <Footer />
      
      {/* Login Popup */}
      {showLoginPopup && (
        <LoginPopup 
          onClose={() => setShowLoginPopup(false)}
          onLoginSuccess={() => setShowLoginPopup(false)}
        />
      )}
    </>
  );
};

export default ProductDetails;
