import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaSearch, FaHeart, FaChevronDown, FaTruck, FaGift, FaCoins } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import { toast } from "react-toastify";


const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { isAuthenticated, isReady } = useContext(AuthContext);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  // Group items by shop
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {});

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
    const newSelected = new Set(selectedItems);
    newSelected.delete(itemId);
    setSelectedItems(newSelected);
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(itemId => {
      removeFromCart(itemId);
    });
    setSelectedItems(new Set());
  };

  const handleCheckout = async () => {
    
    if (!isReady) {
      toast.info('Đang kiểm tra đăng nhập...');
      return;
    }
    
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để mua hàng');
      navigate('/auth/login', { state: { from: '/cart' } });
      return;
    }
    
    if (selectedItems.size === 0) {
      toast.error('Vui lòng chọn sản phẩm để mua hàng');
      return;
    }
    
    try {
      // Lọc các sản phẩm đã chọn và chuyển sang checkout
      const selectedItemsList = cartItems.filter(item => selectedItems.has(item.id));
      
      // Lưu thông tin sản phẩm đã chọn vào localStorage
      localStorage.setItem('checkoutItems', JSON.stringify(selectedItemsList));
      
      // Chuyển thẳng sang trang checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error in handleCheckout:', error);
      toast.error('Có lỗi xảy ra khi mua hàng');
    }
  };

  const selectedItemsList = cartItems.filter(item => selectedItems.has(item.id));
  const totalAmount = selectedItemsList.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
        isProfilePage={true}
      />

      {/* Spacer for header */}
      <div className="h-16 md:h-20 lg:h-24"></div>

      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="text-orange-500 text-2xl font-bold">MuaSamViet</div>
            <span className="text-gray-400">|</span>
            <h1 className="text-2xl font-bold text-gray-800">Giỏ Hàng</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="THIÊN LONG SALE LỚN NHẤT NĂM"
                className="w-80 px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 text-white p-2 rounded-md">
                <FaSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-600 mb-6">Bạn chưa có sản phẩm nào trong giỏ hàng</p>
            <Link
              to="/products"
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <>
            {/* Column Headers */}
            <div className="hidden lg:grid grid-cols-12 gap-4 bg-white p-4 rounded-lg shadow-sm mb-4">
              <div className="col-span-5 font-semibold text-gray-700">Sản Phẩm</div>
              <div className="col-span-2 font-semibold text-gray-700 text-center">Đơn Giá</div>
              <div className="col-span-2 font-semibold text-gray-700 text-center">Số Lượng</div>
              <div className="col-span-2 font-semibold text-gray-700 text-center">Số Tiền</div>
              <div className="col-span-1 font-semibold text-gray-700 text-center">Thao Tác</div>
            </div>

            {/* Product Listings */}
            {Object.entries(groupedItems).map(([shopName, items]) => (
              <div key={shopName} className="bg-white rounded-lg shadow-sm mb-4">
                {/* Shop Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="font-semibold text-gray-800">{shopName}</span>
                  </div>
                </div>

                {/* Products in this shop */}
                {items.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-100 last:border-b-0">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="lg:col-span-5">
                        <div className="flex items-start space-x-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                            className="mt-2 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <div className="flex space-x-2">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded border"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.name}</h3>
                            {item.voucher && (
                              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-1">
                                VOUCHER XTRA
                              </span>
                            )}
                            <div className="text-sm text-gray-600">
                              Phân Loại Hàng: ▾ {item.variant}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="lg:col-span-2 text-center">
                        <div className="lg:hidden text-sm text-gray-500 mb-1">Đơn Giá:</div>
                        <div className="flex flex-col items-center">
                          {item.originalPrice > item.price && (
                            <span className="text-gray-400 line-through text-sm">
                              ₫{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-orange-500 font-semibold">
                            ₫{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="lg:col-span-2 text-center">
                        <div className="lg:hidden text-sm text-gray-500 mb-1">Số Lượng:</div>
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="lg:col-span-2 text-center">
                        <div className="lg:hidden text-sm text-gray-500 mb-1">Số Tiền:</div>
                        <span className="text-orange-500 font-semibold">
                          ₫{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 text-center">
                        <div className="lg:hidden text-sm text-gray-500 mb-1">Thao Tác:</div>
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Xóa
                          </button>
                          <button className="text-gray-500 hover:text-gray-700 text-sm">
                            Tìm sản phẩm tương tự ▾
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Vouchers and Shipping */}
            <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <FaGift className="text-yellow-500 text-xl" />
                  <div>
                    <div className="font-medium text-gray-800">Voucher giảm đến ₫130k</div>
                    <button className="text-orange-500 text-sm hover:text-orange-600">
                      Xem thêm voucher
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <FaTruck className="text-blue-500 text-xl" />
                  <div>
                    <div className="font-medium text-gray-800">Giảm ₫500.000 phí vận chuyển đơn tối thiểu ₫0</div>
                    <button className="text-orange-500 text-sm hover:text-orange-600">
                      Tìm hiểu thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Summary */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left - Selection Controls */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="font-medium text-gray-800">
                      Chọn Tất Cả ({cartItems.length})
                    </span>
                  </div>
                  <div className="flex space-x-4 text-sm">
                    <button
                      onClick={handleRemoveSelected}
                      disabled={selectedItems.size === 0}
                      className="text-red-500 hover:text-red-700 disabled:text-gray-400"
                    >
                      Xóa
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      Bỏ sản phẩm không hoạt động
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      Lưu vào mục Đã thích
                    </button>
                  </div>
                </div>

                {/* Middle - Vouchers and Coins */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FaGift className="text-orange-500" />
                      <span className="font-medium text-gray-800">MuaSamViet Voucher</span>
                    </div>
                    <button className="text-orange-500 text-sm hover:text-orange-600">
                      Chọn hoặc nhập mã
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FaCoins className="text-orange-500" />
                      <span className="font-medium text-gray-800">MuaSamViet Xu</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">
                        {selectedItems.size > 0 ? "Bạn đã chọn sản phẩm" : "Bạn chưa chọn sản phẩm"}
                      </div>
                      <div className="text-orange-500 font-medium">-₫0</div>
                    </div>
                  </div>
                </div>

                {/* Right - Total and Checkout */}
                <div className="text-right">
                  <div className="mb-4">
                    <div className="text-lg font-bold text-gray-800">
                      Tổng cộng ({selectedItems.size} Sản phẩm): ₫{totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={handleCheckout}
                    disabled={selectedItems.size === 0}
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Mua Hàng
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />

      {/* Floating Actions */}
      <FloatingActions />
    </div>
  );
};

export default Cart;
