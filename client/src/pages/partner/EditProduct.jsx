import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/FloatingActions';
import { 
  FaArrowLeft, 
  FaSave, 
  FaUpload, 
  FaTrash, 
  FaPlus,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const EditProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mock product data
  const [product] = useState({
    id: parseInt(id),
    name: 'Áo thun nam basic',
    description: 'Áo thun nam chất liệu cotton 100%, thoáng mát, dễ giặt. Phù hợp cho mọi lứa tuổi, có thể mặc đi làm, đi chơi hoặc ở nhà.',
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
      '/uploads/products/ao-thun-nam-3.jpg'
    ],
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    views: 1250,
    sales: 45
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    original_price: '',
    stock: '',
    status: 'draft',
    tags: '',
    weight: '',
    dimensions: '',
    brand: '',
    model: '',
    warranty: '',
    return_policy: ''
  });

  // Images state
  const [images, setImages] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  // Categories
  const categories = [
    'Thời trang nam',
    'Thời trang nữ',
    'Giày dép',
    'Túi xách',
    'Đồng hồ',
    'Trang sức',
    'Mỹ phẩm',
    'Điện tử',
    'Nhà cửa',
    'Thể thao',
    'Sách vở',
    'Khác'
  ];

  useEffect(() => {
    // Simulate loading product data
    setTimeout(() => {
      setFormData({
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price.toString(),
        original_price: product.original_price.toString(),
        stock: product.stock.toString(),
        status: product.status,
        tags: product.tags,
        weight: product.weight.toString(),
        dimensions: product.dimensions,
        brand: product.brand,
        model: product.model,
        warranty: product.warranty,
        return_policy: product.return_policy
      });

      // Set images
      const productImages = product.images.map((img, index) => ({
        file: null,
        preview: img,
        name: `image-${index + 1}.jpg`,
        isExisting: true
      }));
      setImages(productImages);
      setLoading(false);
    }, 1000);
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Tự động cập nhật trạng thái khi stock = 0
      if (name === 'stock' && parseInt(value) === 0) {
        newData.status = 'out_of_stock';
      }
      
      return newData;
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      isExisting: false
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      if (mainImageIndex >= newImages.length) {
        setMainImageIndex(Math.max(0, newImages.length - 1));
      }
      return newImages;
    });
  };

  const setMainImage = (index) => {
    setMainImageIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    if (images.length === 0) {
      toast.error('Vui lòng upload ít nhất 1 ảnh sản phẩm');
      return;
    }

    setSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Cập nhật sản phẩm thành công!');
              navigate('/account/partner/products');
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật sản phẩm');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = () => {
    setFormData(prev => ({ ...prev, status: 'draft' }));
    toast.info('Đã lưu bản nháp');
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
              <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa sản phẩm</h1>
              <p className="text-gray-600 text-sm">Cập nhật thông tin sản phẩm #{id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              {showPreview ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              <span>{showPreview ? 'Ẩn xem trước' : 'Xem trước'}</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FaSave className="text-sm" />
              <span>Lưu nháp</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên sản phẩm <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nhập tên sản phẩm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá bán <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá gốc
                      </label>
                      <input
                        type="number"
                        name="original_price"
                        value={formData.original_price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số lượng tồn kho <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                        required
                      />
                      {formData.stock === '0' && (
                        <p className="text-sm text-red-500 mt-1">
                          ⚠️ Sản phẩm sẽ được đánh dấu là "Hết hàng"
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="draft">Bản nháp</option>
                        <option value="active">Đang bán</option>
                        <option value="inactive">Tạm ngưng</option>
                        <option value="out_of_stock">Hết hàng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Mô tả chi tiết về sản phẩm..."
                  />
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin bổ sung</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thương hiệu
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nhập thương hiệu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Nhập model"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trọng lượng (gram)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kích thước (cm)
                      </label>
                      <input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Dài x Rộng x Cao"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bảo hành
                      </label>
                      <input
                        type="text"
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ví dụ: 12 tháng"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chính sách đổi trả
                      </label>
                      <input
                        type="text"
                        name="return_policy"
                        value={formData.return_policy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Ví dụ: 7 ngày"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (phân cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Link
                    to="/account/partner/products"
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Hủy
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave className="text-sm" />
                    <span>{saving ? 'Đang lưu...' : 'Cập nhật sản phẩm'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Hình ảnh sản phẩm</h3>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click để chọn ảnh hoặc kéo thả vào đây</p>
                  <p className="text-sm text-gray-500">Hỗ trợ: JPG, PNG, GIF (Tối đa 10MB)</p>
                </label>
              </div>

              {/* Image List */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Ảnh đã chọn ({images.length})</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={image.name}
                          className={`w-full h-24 object-cover rounded-lg border-2 ${
                            index === mainImageIndex ? 'border-orange-500' : 'border-gray-200'
                          }`}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                            {index !== mainImageIndex && (
                              <button
                                onClick={() => setMainImage(index)}
                                className="p-1 bg-blue-500 text-white rounded text-xs"
                                title="Đặt làm ảnh chính"
                              >
                                <FaPlus className="w-3 h-3" />
                              </button>
                            )}
                            <button
                              onClick={() => removeImage(index)}
                              className="p-1 bg-red-500 text-white rounded text-xs"
                              title="Xóa ảnh"
                            >
                              <FaTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {index === mainImageIndex && (
                          <div className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Ảnh chính
                          </div>
                        )}
                        {image.isExisting && (
                          <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                            Có sẵn
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            {showPreview && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Xem trước</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  {images.length > 0 && (
                    <img
                      src={images[mainImageIndex]?.preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h4 className="font-medium text-gray-800 mb-2">{formData.name || 'Tên sản phẩm'}</h4>
                  <p className="text-orange-500 font-semibold mb-2">
                    ₫{formData.price ? Number(formData.price).toLocaleString() : '0'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">{formData.category || 'Danh mục'}</p>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {formData.description || 'Mô tả sản phẩm...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer hideCart={true} />
    </div>
  );
};

export default EditProduct;
