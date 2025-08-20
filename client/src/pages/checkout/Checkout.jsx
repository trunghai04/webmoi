import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BankTransferQR from '../../components/BankTransferQR';
import { 
  FaCreditCard, 
  FaMapMarkerAlt, 
  FaTruck, 
  FaShieldAlt,
  FaCheck,
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaCity,
  FaGlobe,
  FaLock,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems, clearCart } = useContext(CartContext);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [bankInfo, setBankInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedLocalStorage, setHasCheckedLocalStorage] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.fullName || user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const [orderSummary, setOrderSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
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

  // Load checkout items from localStorage
  useEffect(() => {
    console.log('=== CHECKOUT LOADING START ===');
    console.log('Current URL:', window.location.href);
    const savedCheckoutItems = localStorage.getItem('checkoutItems');
    console.log('Raw localStorage checkoutItems:', savedCheckoutItems);
    console.log('Cart items from context:', cartItems);
    console.log('Cart items length:', cartItems?.length || 0);
    
    if (savedCheckoutItems && savedCheckoutItems !== 'null' && savedCheckoutItems !== 'undefined') {
      try {
        const items = JSON.parse(savedCheckoutItems);
        console.log('Parsed checkout items:', items);
        console.log('Parsed items length:', items?.length || 0);
        
        if (items && Array.isArray(items) && items.length > 0) {
          setCheckoutItems(items);
          console.log('✅ Set checkoutItems to localStorage items:', items);
        } else {
          console.log('⚠️ Parsed items is empty/invalid, using cart items');
          setCheckoutItems(cartItems || []);
        }
      } catch (error) {
        console.error('❌ Error parsing checkout items:', error);
        setCheckoutItems(cartItems || []);
      }
    } else {
      console.log('⚠️ No valid saved checkout items, using cart items');
      setCheckoutItems(cartItems || []);
    }
    
    console.log('Setting isLoading to false');
    setIsLoading(false);
    setHasCheckedLocalStorage(true);
    console.log('=== CHECKOUT LOADING END ===');
  }, []); // Remove cartItems dependency to prevent re-running

  // Handle cartItems changes separately
  useEffect(() => {
    // Only update checkoutItems from cartItems if we don't have checkoutItems from localStorage
    if (checkoutItems.length === 0 && cartItems.length > 0) {
      console.log('No checkoutItems, using cartItems:', cartItems);
      setCheckoutItems(cartItems);
    }
  }, [cartItems, checkoutItems.length]);

  // Update shipping info when user data changes
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        fullName: user.fullName || user.full_name || prev.fullName,
        phone: user.phone || prev.phone,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Load bank information
  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const API_BASE = import.meta.env.VITE_API_URL || '';
        const response = await fetch(`${API_BASE}/api/settings/bank-info`);
        const data = await response.json();
        if (data.success) {
          setBankInfo(data.data);
        }
      } catch (error) {
        console.error('Error fetching bank info:', error);
        // Fallback to default bank info
        setBankInfo({
          bankName: 'Vietcombank',
          accountNumber: '1234567890',
          accountHolder: 'CONG TY MUA SAM VIET',
          bankBin: '970436'
        });
      }
    };

    fetchBankInfo();
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup checkout items when component unmounts
  useEffect(() => {
    return () => {
      // Only clear if user navigates away without completing order
      // AND if we're not in the middle of loading items
      if (currentStep < 4 && !isLoading) {
        console.log('Cleaning up checkoutItems from localStorage');
        localStorage.removeItem('checkoutItems');
      }
    };
  }, [currentStep, isLoading]);

  // Calculate order summary
  useEffect(() => {
    const itemsToCalculate = checkoutItems.length > 0 ? checkoutItems : cartItems;
    const subtotal = itemsToCalculate.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = shippingMethod === 'express' ? 50000 : 30000;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      total
    });
  }, [checkoutItems, cartItems, shippingMethod]);

  // Redirect if not authenticated or no items in cart
  useEffect(() => {
    console.log('=== REDIRECT CHECK START ===');
    console.log('Redirect useEffect triggered:', {
      isAuthenticated,
      isLoading,
      checkoutItemsLength: checkoutItems.length,
      cartItemsLength: cartItems?.length || 0,
      url: window.location.href
    });
    
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login');
      navigate('/auth/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Đợi loading xong và đã check localStorage
    if (!isLoading && hasCheckedLocalStorage) {
      const hasCheckoutItems = checkoutItems && checkoutItems.length > 0;
      const hasCartItems = cartItems && cartItems.length > 0;
      
      console.log('Loading completed, checking items:', {
        hasCheckoutItems,
        hasCartItems,
        checkoutItems,
        cartItems
      });
      
      if (!hasCheckoutItems && !hasCartItems) {
        console.log('❌ No items found anywhere, checking localStorage directly...');
        // Kiểm tra localStorage trực tiếp trước khi redirect
        const directCheck = localStorage.getItem('checkoutItems');
        console.log('Direct localStorage check:', directCheck);
        
        if (directCheck && directCheck !== 'null' && directCheck !== 'undefined') {
          try {
            const parsed = JSON.parse(directCheck);
            if (parsed && parsed.length > 0) {
              console.log('✅ Found items in localStorage, setting checkoutItems');
              setCheckoutItems(parsed);
              return;
            }
          } catch (error) {
            console.error('Error parsing direct check:', error);
          }
        }
        
        // Delay redirect để đảm bảo không bị race condition
        setTimeout(() => {
          console.log('❌ Confirmed no items anywhere, redirecting to cart');
          navigate('/cart');
        }, 200);
        return;
      }
      
      console.log('✅ Items found, staying on checkout');
    } else {
      console.log('⏳ Still loading, waiting...');
    }
    
    console.log('=== REDIRECT CHECK END ===');
  }, [isAuthenticated, checkoutItems, cartItems, navigate, isLoading, hasCheckedLocalStorage]);

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateShippingInfo = () => {
    const required = ['fullName', 'phone', 'email', 'address', 'city', 'district'];
    for (let field of required) {
      if (!shippingInfo[field]) {
        toast.error(`Vui lòng điền ${field === 'fullName' ? 'họ tên' : field}`);
        return false;
      }
    }
    return true;
  };

  const validatePaymentInfo = () => {
    if (paymentMethod === 'card') {
      const required = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'];
      for (let field of required) {
        if (!paymentInfo[field]) {
          toast.error(`Vui lòng điền thông tin thẻ`);
          return false;
        }
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateShippingInfo()) return;
    if (currentStep === 2 && !validatePaymentInfo()) return;
    if (currentStep === 3) {
      // Step 3 to 4: Always allow, payment validation will be in handlePlaceOrder
      setCurrentStep(currentStep + 1);
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async () => {
    try {
      // Validate payment info for non-COD methods
      if (paymentMethod !== 'cod') {
        if (paymentMethod === 'card') {
          const required = ['cardNumber', 'cardHolder', 'expiryDate', 'cvv'];
          for (let field of required) {
            if (!paymentInfo[field]) {
              toast.error(`Vui lòng điền đầy đủ thông tin thẻ`);
              return;
            }
          }
        }
        
        // For bank transfer, we just need to confirm
        if (paymentMethod === 'bank') {
          const confirmed = window.confirm(
            'Bạn đã chuyển khoản thành công chưa? Vui lòng xác nhận để tiếp tục.'
          );
          if (!confirmed) {
            return;
          }
        }
      }

      setIsProcessingPayment(true);
      
      // Simulate payment processing
      if (paymentMethod !== 'cod') {
        toast.info('Đang xử lý thanh toán...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      // Create order via API
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const authRaw = localStorage.getItem('msv_auth');
      let token = '';
      try {
        token = authRaw ? JSON.parse(authRaw).token : '';
      } catch {}

      const itemsToOrder = (checkoutItems.length > 0 ? checkoutItems : cartItems) || [];

      if (!user || !(user.id || user.user_id)) {
        toast.error('Không xác định được người dùng. Vui lòng đăng nhập lại.');
        setIsProcessingPayment(false);
        return;
      }

      const payload = {
        userId: user.id || user.user_id,
        items: itemsToOrder.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          name: item.name,
          image: item.image,
          price: item.price
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          email: shippingInfo.email,
          address: [
            shippingInfo.address,
            shippingInfo.ward,
            shippingInfo.district,
            shippingInfo.city
          ].filter(Boolean).join(', ')
        },
        paymentMethod,
        shippingMethod,
        subtotal: orderSummary.subtotal,
        shippingFee: orderSummary.shipping,
        tax: orderSummary.tax,
        total: orderSummary.total,
        note: shippingInfo.note || ''
      };

      const response = await fetch(`${API_BASE}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err?.message || 'Tạo đơn hàng thất bại');
      }

      const result = await response.json();
      const createdOrderId = result?.data?.orderId;
      const createdOrderNumber = result?.data?.orderNumber;
      
      // Clear cart after successful order
      clearCart();
      
      // Clear checkout items from localStorage
      localStorage.removeItem('checkoutItems');
      
      toast.success('Đặt hàng thành công!');
      navigate('/order-confirmation', { 
        state: { 
          orderId: createdOrderNumber || ('ORD' + Date.now()),
          orderSummary,
          dbOrderId: createdOrderId
        } 
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Show loading if still loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Đang tải trang checkout...</div>
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
        hideLogoShrink={true}
        hideTopNav={true}
      />

      {/* Spacer for header */}
      <div className="h-20 md:h-24 lg:h-32"></div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
                     {/* Breadcrumb */}
           <div className="flex items-center mb-8">
             <button 
               onClick={() => {
                 localStorage.removeItem('checkoutItems');
                 navigate('/');
               }}
               className="flex items-center text-gray-600 hover:text-blue-600"
             >
               <FaArrowLeft className="mr-2" />
               Quay lại trang chủ
             </button>
           </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {currentStep > step ? <FaCheck /> : step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 sm:w-20 h-1 mx-2 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold flex items-center">
                      <FaMapMarkerAlt className="mr-3 text-blue-600" />
                      Thông tin giao hàng
                    </h2>
                    {user && (
                      <button
                        type="button"
                        onClick={() => {
                          setShippingInfo({
                            fullName: user.fullName || user.full_name || '',
                            phone: user.phone || '',
                            email: user.email || '',
                            address: '',
                            city: '',
                            district: '',
                            ward: '',
                            note: ''
                          });
                          toast.success('Đã điền thông tin từ hồ sơ cá nhân');
                        }}
                        className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        Điền từ hồ sơ
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập email"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập địa chỉ chi tiết"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố *
                      </label>
                      <select
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn tỉnh/thành phố</option>
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="haiphong">Hải Phòng</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện *
                      </label>
                      <select
                        name="district"
                        value={shippingInfo.district}
                        onChange={handleShippingChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn quận/huyện</option>
                        <option value="district1">Quận 1</option>
                        <option value="district2">Quận 2</option>
                        <option value="district3">Quận 3</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ghi chú
                    </label>
                    <textarea
                      name="note"
                      value={shippingInfo.note}
                      onChange={handleShippingChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ghi chú về đơn hàng (không bắt buộc)"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <FaCreditCard className="mr-3 text-blue-600" />
                    Phương thức thanh toán
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">Thanh toán khi nhận hàng (COD)</div>
                          <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận hàng</div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">Thẻ tín dụng/Ghi nợ</div>
                          <div className="text-sm text-gray-600">Thanh toán bằng thẻ Visa, Mastercard</div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div>
                          <div className="font-medium">Chuyển khoản ngân hàng</div>
                          <div className="text-sm text-gray-600">Chuyển khoản trực tiếp vào tài khoản</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Card Information */}
                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-4">Thông tin thẻ</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số thẻ
                          </label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Chủ thẻ
                          </label>
                          <input
                            type="text"
                            name="cardHolder"
                            value={paymentInfo.cardHolder}
                            onChange={handlePaymentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="NGUYEN VAN A"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày hết hạn
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={handlePaymentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MM/YY"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="cvv"
                              value={paymentInfo.cvv}
                              onChange={handlePaymentChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="123"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

                             {/* Step 3: Order Review */}
               {currentStep === 3 && (
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-white rounded-lg shadow-md p-6"
                 >
                   <h2 className="text-2xl font-bold mb-6 flex items-center">
                     <FaShieldAlt className="mr-3 text-blue-600" />
                     Xác nhận đơn hàng
                   </h2>
                   
                   <div className="space-y-6">
                     {/* Shipping Information */}
                     <div>
                       <h3 className="font-medium mb-3">Thông tin giao hàng</h3>
                       <div className="bg-gray-50 p-4 rounded-lg">
                         <p className="font-medium">{shippingInfo.fullName}</p>
                         <p className="text-gray-600">{shippingInfo.phone}</p>
                         <p className="text-gray-600">{shippingInfo.email}</p>
                         <p className="text-gray-600">
                           {shippingInfo.address}, {shippingInfo.district}, {shippingInfo.city}
                         </p>
                         {shippingInfo.note && (
                           <p className="text-gray-600 mt-2">
                             <span className="font-medium">Ghi chú:</span> {shippingInfo.note}
                           </p>
                         )}
                       </div>
                     </div>

                     {/* Payment Method */}
                     <div>
                       <h3 className="font-medium mb-3">Phương thức thanh toán</h3>
                       <div className="bg-gray-50 p-4 rounded-lg">
                         {paymentMethod === 'cod' && <p>Thanh toán khi nhận hàng (COD)</p>}
                         {paymentMethod === 'card' && <p>Thẻ tín dụng/Ghi nợ</p>}
                         {paymentMethod === 'bank' && <p>Chuyển khoản ngân hàng</p>}
                       </div>
                     </div>

                     {/* Order Items */}
                     <div>
                       <h3 className="font-medium mb-3">Sản phẩm đặt hàng</h3>
                       <div className="space-y-3">
                         {(checkoutItems.length > 0 ? checkoutItems : cartItems).map((item) => (
                           <div key={item.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                             <div className="flex items-center">
                               <img 
                                 src={item.image} 
                                 alt={item.name}
                                 className="w-16 h-16 object-cover rounded-md mr-4"
                               />
                               <div>
                                 <p className="font-medium">{item.name}</p>
                                 <p className="text-gray-600">Số lượng: {item.quantity}</p>
                               </div>
                             </div>
                             <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </motion.div>
               )}

               {/* Step 4: Payment Processing */}
               {currentStep === 4 && (
                 <motion.div
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="bg-white rounded-lg shadow-md p-6"
                 >
                   <h2 className="text-2xl font-bold mb-6 flex items-center">
                     <FaCreditCard className="mr-3 text-blue-600" />
                     Thanh toán
                   </h2>
                   
                   {isProcessingPayment ? (
                     <div className="text-center py-8">
                       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                       <h3 className="text-lg font-medium text-gray-800 mb-2">Đang xử lý thanh toán...</h3>
                       <p className="text-gray-600">Vui lòng không đóng trình duyệt trong quá trình thanh toán</p>
                     </div>
                   ) : (
                     <div className="space-y-6">
                       {/* Payment Summary */}
                       <div className="bg-blue-50 p-4 rounded-lg">
                         <h3 className="font-medium mb-3">Tóm tắt thanh toán</h3>
                         <div className="space-y-2">
                           <div className="flex justify-between">
                             <span>Tổng tiền hàng:</span>
                             <span>{formatPrice(orderSummary.subtotal)}</span>
                           </div>
                           <div className="flex justify-between">
                             <span>Phí vận chuyển:</span>
                             <span>{formatPrice(orderSummary.shipping)}</span>
                           </div>
                           <div className="flex justify-between">
                             <span>Thuế (10%):</span>
                             <span>{formatPrice(orderSummary.tax)}</span>
                           </div>
                           <div className="flex justify-between font-bold text-lg border-t pt-2">
                             <span>Tổng thanh toán:</span>
                             <span className="text-blue-600">{formatPrice(orderSummary.total)}</span>
                           </div>
                         </div>
                       </div>

                       {/* Payment Method Specific UI */}
                       {paymentMethod === 'card' && (
                         <div className="border border-gray-200 rounded-lg p-4">
                           <h3 className="font-medium mb-4">Thông tin thẻ</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Số thẻ
                               </label>
                               <input
                                 type="text"
                                 name="cardNumber"
                                 value={paymentInfo.cardNumber}
                                 onChange={handlePaymentChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 placeholder="1234 5678 9012 3456"
                               />
                             </div>
                             
                             <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Chủ thẻ
                               </label>
                               <input
                                 type="text"
                                 name="cardHolder"
                                 value={paymentInfo.cardHolder}
                                 onChange={handlePaymentChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 placeholder="NGUYEN VAN A"
                               />
                             </div>
                             
                             <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">
                                 Ngày hết hạn
                               </label>
                               <input
                                 type="text"
                                 name="expiryDate"
                                 value={paymentInfo.expiryDate}
                                 onChange={handlePaymentChange}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 placeholder="MM/YY"
                               />
                             </div>
                             
                             <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">
                                 CVV
                               </label>
                               <div className="relative">
                                 <input
                                   type={showPassword ? "text" : "password"}
                                   name="cvv"
                                   value={paymentInfo.cvv}
                                   onChange={handlePaymentChange}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                   placeholder="123"
                                 />
                                 <button
                                   type="button"
                                   onClick={() => setShowPassword(!showPassword)}
                                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                 >
                                   {showPassword ? <FaEyeSlash /> : <FaEye />}
                                 </button>
                               </div>
                             </div>
                           </div>
                         </div>
                       )}

                                               {paymentMethod === 'bank' && bankInfo && (
                          <div className="border border-gray-200 rounded-lg p-4">
                            <BankTransferQR 
                              bankInfo={bankInfo}
                              orderAmount={orderSummary.total}
                              orderId={`ORD${Date.now()}`}
                            />
                          </div>
                        )}

                       {paymentMethod === 'cod' && (
                         <div className="border border-gray-200 rounded-lg p-4">
                           <h3 className="font-medium mb-4">Thanh toán khi nhận hàng</h3>
                           <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                             <p className="text-sm text-green-800">
                               Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng. Không cần thanh toán trước.
                             </p>
                           </div>
                         </div>
                       )}
                     </div>
                   )}
                 </motion.div>
               )}

                             {/* Navigation Buttons */}
               <div className="flex justify-between mt-8">
                 {currentStep > 1 && (
                   <button
                     onClick={handlePrevStep}
                     className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                   >
                     Quay lại
                   </button>
                 )}
                 
                 {currentStep < 3 ? (
                   <button
                     onClick={handleNextStep}
                     className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
                   >
                     Tiếp tục
                   </button>
                 ) : currentStep === 3 ? (
                   <button
                     onClick={handleNextStep}
                     className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-auto"
                   >
                     Tiếp tục thanh toán
                   </button>
                 ) : (
                   <button
                     onClick={handlePlaceOrder}
                     disabled={isProcessingPayment}
                     className={`px-6 py-2 text-white rounded-md ml-auto ${
                       isProcessingPayment 
                         ? 'bg-gray-400 cursor-not-allowed' 
                         : 'bg-green-600 hover:bg-green-700'
                     }`}
                   >
                     {isProcessingPayment ? 'Đang xử lý...' : 'Hoàn tất thanh toán'}
                   </button>
                 )}
               </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <h3 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-3 mb-6">
                  {(checkoutItems.length > 0 ? checkoutItems : cartItems).map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(orderSummary.shipping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế (10%):</span>
                    <span>{formatPrice(orderSummary.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Phương thức vận chuyển</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>Giao hàng tiêu chuẩn (2-3 ngày) - 30.000đ</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="mr-2"
                      />
                      <span>Giao hàng nhanh (1-2 ngày) - 50.000đ</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;
