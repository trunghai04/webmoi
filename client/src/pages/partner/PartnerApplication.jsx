import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  FaStore, 
  FaUser, 
  FaIdCard,
  FaPhone, 
  FaMapMarkerAlt,
  FaFileAlt,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaArrowLeft
} from 'react-icons/fa';

const PartnerApplication = () => {
  const { user, isAuthenticated, isReady } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationStatus, setApplicationStatus] = useState(null);
  const [formData, setFormData] = useState({
    // Step 1: Shop Information
    store_name: '',
    store_description: '',
    business_type: 'individual',
    
    // Step 2: Contact Information
    phone: '',
    email: '',
    
    // Step 3: Address Information
    address: '',
    city: '',
    district: '',
    
    // Step 4: Identity Information
    seller_name: '',
    seller_id: '', // CCCD
    business_license: '',
    
    // Step 5: Documents
    documents: {}
  });

  const steps = [
    { id: 1, title: 'Thông tin Shop', icon: FaStore },
    { id: 2, title: 'Thông tin liên hệ', icon: FaPhone },
    { id: 3, title: 'Địa chỉ', icon: FaMapMarkerAlt },
    { id: 4, title: 'Thông tin định danh', icon: FaIdCard },
    { id: 5, title: 'Hoàn tất', icon: FaCheck }
  ];

  useEffect(() => {
    if (isAuthenticated === false && isReady) {
      navigate('/auth/login');
      return;
    }

    if (isAuthenticated && isReady) {
      checkApplicationStatus();
    }
  }, [isAuthenticated, isReady, navigate]);

  const checkApplicationStatus = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('msv_auth')).token;
      const response = await fetch('http://localhost:5000/api/partner/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApplicationStatus(data.data);
        
        // If already approved, redirect to partner dashboard
        if (data.data.status === 'approved') {
          navigate('/partner');
        }
      }
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
  };

  const validateCCCD = (cccd) => {
    const cccdRegex = /^[0-9]{12}$/;
    return cccdRegex.test(cccd);
  };

  const validateStoreName = (name) => {
    return name.trim().length >= 3;
  };

  const validateDescription = (description) => {
    return description.trim().length >= 10;
  };

  const validateSellerName = (name) => {
    const words = name.trim().split(' ').filter(word => word.length > 0);
    return words.length >= 2;
  };

  const validateBusinessLicense = (license) => {
    return license.trim().length >= 5;
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.store_name.trim() && formData.business_type && formData.store_description.trim() && validateStoreName(formData.store_name) && validateDescription(formData.store_description);
      case 2:
        return formData.phone.trim() && formData.email.trim() && validatePhone(formData.phone) && validateEmail(formData.email);
      case 3:
        return formData.address.trim() && formData.district.trim() && formData.city.trim();
      case 4:
        return formData.seller_name.trim() && formData.seller_id.trim() && formData.business_license.trim() && validateCCCD(formData.seller_id) && validateSellerName(formData.seller_name) && validateBusinessLicense(formData.business_license);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      // Show specific error messages
      switch (currentStep) {
        case 1:
          if (!formData.store_name.trim()) toast.error('Vui lòng nhập tên shop');
          else if (!validateStoreName(formData.store_name)) toast.error('Tên shop phải có ít nhất 3 ký tự');
          else if (!formData.store_description.trim()) toast.error('Vui lòng nhập mô tả shop');
          else if (!validateDescription(formData.store_description)) toast.error('Mô tả shop phải có ít nhất 10 ký tự');
          break;
        case 2:
          if (!formData.phone.trim()) toast.error('Vui lòng nhập số điện thoại');
          else if (!validatePhone(formData.phone)) toast.error('Số điện thoại không hợp lệ (10-11 số)');
          else if (!formData.email.trim()) toast.error('Vui lòng nhập email');
          else if (!validateEmail(formData.email)) toast.error('Email không hợp lệ');
          break;
        case 3:
          if (!formData.address.trim()) toast.error('Vui lòng nhập địa chỉ');
          else if (!formData.district.trim()) toast.error('Vui lòng nhập quận/huyện');
          else if (!formData.city.trim()) toast.error('Vui lòng nhập tỉnh/thành phố');
          break;
        case 4:
          if (!formData.seller_name.trim()) toast.error('Vui lòng nhập tên người bán');
          else if (!validateSellerName(formData.seller_name)) toast.error('Tên người bán phải có ít nhất 2 từ');
          else if (!formData.seller_id.trim()) toast.error('Vui lòng nhập số CCCD');
          else if (!validateCCCD(formData.seller_id)) toast.error('Số CCCD phải có 12 số');
          else if (!formData.business_license.trim()) toast.error('Vui lòng nhập giấy phép kinh doanh');
          else if (!validateBusinessLicense(formData.business_license)) toast.error('Giấy phép kinh doanh phải có ít nhất 5 ký tự');
          break;
        default:
          toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = JSON.parse(localStorage.getItem('msv_auth')).token;
      const response = await fetch('http://localhost:5000/api/partner/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setCurrentStep(5); // Go to completion step
        checkApplicationStatus();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while auth is not ready
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If application is pending
  if (applicationStatus?.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaSpinner className="text-yellow-500 text-2xl animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Đơn đăng ký đang được xử lý</h2>
          <p className="text-gray-600 mb-4">{applicationStatus.message}</p>
          <div className="text-sm text-gray-500">
            <p>Ngày gửi: {new Date(applicationStatus.application.created_at).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </div>
    );
  }

  // If application was rejected
  if (applicationStatus?.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FaTimes className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Đơn đăng ký bị từ chối</h2>
          <p className="text-gray-600 mb-4">{applicationStatus.message}</p>
          {applicationStatus.application.rejection_reason && (
            <div className="bg-red-50 p-3 rounded-lg mb-4">
              <p className="text-sm text-red-700">
                <strong>Lý do:</strong> {applicationStatus.application.rejection_reason}
              </p>
            </div>
          )}
          <button
            onClick={() => setApplicationStatus(null)}
            className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Đăng ký lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 text-white p-2 rounded-lg">
                <FaStore className="text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">MuaSamViet</h1>
                <p className="text-sm text-gray-600">Đăng ký trở thành Người bán</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">{user?.username || 'User'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-orange-500 border-orange-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <FaCheck className="text-sm" />
                  ) : (
                    <step.icon className="text-sm" />
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-orange-500' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-orange-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Shop Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FaStore className="text-orange-500 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông tin Shop</h2>
                  <p className="text-gray-600">Vui lòng cung cấp thông tin cơ bản về shop của bạn</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên Shop *
                    </label>
                    <input
                      type="text"
                      name="store_name"
                      value={formData.store_name}
                      onChange={handleChange}
                      required
                      maxLength={30}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Nhập tên shop"
                    />
                                         <div className="text-xs text-gray-500 mt-1">
                       {formData.store_name.length}/30 ký tự (tối thiểu 3 ký tự)
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại hình kinh doanh *
                    </label>
                    <select
                      name="business_type"
                      value={formData.business_type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="individual">Cá nhân</option>
                      <option value="company">Công ty</option>
                    </select>
                  </div>
                </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Mô tả Shop *
                   </label>
                   <textarea
                     name="store_description"
                     value={formData.store_description}
                     onChange={handleChange}
                     required
                     rows="3"
                     maxLength={500}
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                     placeholder="Mô tả về shop của bạn"
                   />
                   <div className="text-xs text-gray-500 mt-1">
                     {formData.store_description.length}/500 ký tự (tối thiểu 10 ký tự)
                   </div>
                 </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FaPhone className="text-orange-500 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông tin liên hệ</h2>
                  <p className="text-gray-600">Cung cấp thông tin liên hệ để chúng tôi có thể liên lạc</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                                         <input
                       type="tel"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       required
                       maxLength={11}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                       placeholder="0123456789"
                     />
                     <div className="text-xs text-gray-500 mt-1">
                       {formData.phone.length}/11 số
                     </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="example@email.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address Information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FaMapMarkerAlt className="text-orange-500 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Địa chỉ</h2>
                  <p className="text-gray-600">Cung cấp địa chỉ để chúng tôi có thể giao hàng</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Số nhà, tên đường"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quận/Huyện *
                      </label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Quận/Huyện"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tỉnh/Thành phố *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Tỉnh/Thành phố"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Identity Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FaIdCard className="text-orange-500 text-2xl" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông tin định danh</h2>
                  <p className="text-gray-600">Cung cấp thông tin cá nhân để xác minh danh tính</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên người bán *
                    </label>
                    <input
                      type="text"
                      name="seller_name"
                      value={formData.seller_name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Họ và tên đầy đủ"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số CCCD *
                    </label>
                                         <input
                       type="text"
                       name="seller_id"
                       value={formData.seller_id}
                       onChange={handleChange}
                       required
                       maxLength={12}
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                       placeholder="123456789012"
                     />
                     <div className="text-xs text-gray-500 mt-1">
                       {formData.seller_id.length}/12 số
                     </div>
                  </div>
                </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Giấy phép kinh doanh *
                   </label>
                   <input
                     type="text"
                     name="business_license"
                     value={formData.business_license}
                     onChange={handleChange}
                     required
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                     placeholder="Số giấy phép kinh doanh"
                   />
                 </div>
              </div>
            )}

            {/* Step 5: Completion */}
            {currentStep === 5 && (
              <div className="text-center space-y-6">
                <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <FaCheck className="text-green-500 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Hoàn tất đăng ký</h2>
                <p className="text-gray-600 mb-6">
                  Cảm ơn bạn đã đăng ký trở thành người bán trên MuaSamViet! 
                  Đơn đăng ký của bạn đã được gửi và sẽ được xem xét trong vòng 3-5 ngày làm việc.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg text-left">
                  <h3 className="font-medium text-gray-800 mb-2">Thông tin đã gửi:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Tên Shop:</strong> {formData.store_name}</p>
                    <p><strong>Số điện thoại:</strong> {formData.phone}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Tên người bán:</strong> {formData.seller_name}</p>
                    <p><strong>Địa chỉ:</strong> {formData.address}, {formData.district}, {formData.city}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex items-center justify-between pt-8 border-t">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft className="mr-2" />
                  Quay lại
                </button>

                {currentStep === 4 ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <FaFileAlt className="mr-2" />
                        Gửi đơn đăng ký
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Tiếp theo
                    <FaArrowRight className="ml-2" />
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerApplication;
