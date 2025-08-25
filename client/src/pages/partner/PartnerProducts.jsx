import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaSearch, 
  FaFilter,
  FaSort,
  FaBox,
  FaTag,
  FaDollarSign,
  FaCalendar,
  FaCheck,
  FaTimes,
  FaArrowLeft,
  FaDownload,
  FaUpload,
  FaEllipsisV,
  FaStore
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PartnerProducts = () => {
  const { user, isAuthenticated, isReady } = useContext(AuthContext);
  const navigate = useNavigate();

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

  // Redirect to login after auth state is ready and unauthenticated
  useEffect(() => {
    if (isReady && isAuthenticated === false) {
      navigate('/auth/login', { replace: true });
    }
  }, [isReady, isAuthenticated, navigate]);

  // Check if user has partner access
  const [partnerAccess, setPartnerAccess] = useState(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return; // wait until auth ready and logged in
    const checkPartnerAccess = async () => {
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
          setPartnerAccess(data.data);
          
          // If user doesn't have approved partner access, redirect to application
          if (data.data.status !== 'approved') {
            navigate('/partner/apply');
            return;
          }
        }
      } catch (error) {
        console.error('Error checking partner access:', error);
      } finally {
        setCheckingAccess(false);
      }
    };

    checkPartnerAccess();
  }, [isReady, isAuthenticated, navigate]);

  if (checkingAccess) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  // Mock data for products
  const [mockProducts] = useState([
    {
      id: 1,
      name: 'Áo thun nam basic',
      category: 'Thời trang nam',
      price: 150000,
      original_price: 200000,
      stock: 50,
      status: 'active',
      main_image: '/uploads/products/ao-thun-nam-1.jpg',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      views: 1250,
      sales: 45
    },
    {
      id: 2,
      name: 'Quần jean nữ slim fit',
      category: 'Thời trang nữ',
      price: 250000,
      original_price: 300000,
      stock: 30,
      status: 'active',
      main_image: '/uploads/products/quan-jean-nu-1.jpg',
      created_at: '2024-01-14',
      updated_at: '2024-01-14',
      views: 890,
      sales: 28
    },
    {
      id: 3,
      name: 'Váy đầm công sở',
      category: 'Thời trang nữ',
      price: 350000,
      original_price: 450000,
      stock: 20,
      status: 'inactive',
      main_image: '/uploads/products/vay-dam-1.jpg',
      created_at: '2024-01-13',
      updated_at: '2024-01-13',
      views: 650,
      sales: 15
    },
    {
      id: 4,
      name: 'Giày sneaker nam',
      category: 'Giày dép',
      price: 500000,
      original_price: 600000,
      stock: 25,
      status: 'active',
      main_image: '/uploads/products/giay-sneaker-1.jpg',
      created_at: '2024-01-12',
      updated_at: '2024-01-12',
      views: 1100,
      sales: 32
    },
    {
      id: 5,
      name: 'Túi xách nữ thời trang',
      category: 'Túi xách',
      price: 400000,
      original_price: 500000,
      stock: 15,
      status: 'active',
      main_image: '/uploads/products/tui-xach-1.jpg',
      created_at: '2024-01-11',
      updated_at: '2024-01-11',
      views: 750,
      sales: 18
    },
    {
      id: 6,
      name: 'Điện thoại Samsung Galaxy S24',
      category: 'Điện tử',
      price: 25000000,
      original_price: 28000000,
      stock: 0,
      status: 'out_of_stock',
      main_image: '/uploads/products/samsung-s24-1.jpg',
      created_at: '2024-01-10',
      updated_at: '2024-01-10',
      views: 2100,
      sales: 8
    },
    {
      id: 7,
      name: 'Laptop Dell Inspiron 15',
      category: 'Điện tử',
      price: 18000000,
      original_price: 20000000,
      stock: 3,
      status: 'active',
      main_image: '/uploads/products/dell-laptop-1.jpg',
      created_at: '2024-01-09',
      updated_at: '2024-01-09',
      views: 950,
      sales: 12
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      if (productToDelete.name.includes('sản phẩm đã chọn')) {
        // Bulk delete
        const count = parseInt(productToDelete.name.split(' ')[0]);
        const newProducts = products.filter(p => p.status !== filterStatus);
        setProducts(newProducts);
        toast.success(`Đã xóa ${count} sản phẩm thành công!`);
      } else {
        // Single delete
        setProducts(products.filter(p => p.id !== productToDelete.id));
        toast.success('Đã xóa sản phẩm thành công!');
      }
      setShowDeleteModal(false);
      setProductToDelete(null);
      setSelectedProducts(new Set());
    }
  };

  const handleToggleStatus = (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    const updatedProducts = products.map(p => 
      p.id === product.id ? { ...p, status: newStatus } : p
    );
    setProducts(updatedProducts);
    toast.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tạm ngưng'} sản phẩm "${product.name}"`);
  };

  const handleBulkAction = (action) => {
    const selectedProducts = products.filter(p => p.status === filterStatus);
    
    switch (action) {
      case 'activate':
        const activatedProducts = products.map(p => 
          p.status === filterStatus ? { ...p, status: 'active' } : p
        );
        setProducts(activatedProducts);
        toast.success(`Đã kích hoạt ${selectedProducts.length} sản phẩm`);
        break;
      case 'deactivate':
        const deactivatedProducts = products.map(p => 
          p.status === filterStatus ? { ...p, status: 'inactive' } : p
        );
        setProducts(deactivatedProducts);
        toast.success(`Đã tạm ngưng ${selectedProducts.length} sản phẩm`);
        break;
      case 'delete':
        if (selectedProducts.length > 0) {
          setProductToDelete({ name: `${selectedProducts.length} sản phẩm đã chọn` });
          setShowDeleteModal(true);
        }
        break;
      default:
        break;
    }
  };

  const handleExportProducts = () => {
    const csvContent = [
      ['ID', 'Tên sản phẩm', 'Danh mục', 'Giá', 'Tồn kho', 'Trạng thái', 'Lượt xem', 'Đã bán'],
      ...products.map(p => [
        p.id,
        p.name,
        p.category,
        p.price,
        p.stock,
        getStatusText(p.status),
        p.views,
        p.sales
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Đã xuất danh sách sản phẩm thành công!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'out_of_stock': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const toggleProductSelection = (productId) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.price - b.price;
      case 'stock':
        return a.stock - b.stock;
      case 'sales':
        return b.sales - a.sales;
      case 'views':
        return b.views - a.views;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });







  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">

        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Link to="/account/partner" className="p-2 text-gray-600 hover:text-orange-500 transition-colors rounded-lg hover:bg-gray-100">
              <FaArrowLeft className="text-lg" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
              <p className="text-gray-600 text-sm">Thêm, sửa, xóa sản phẩm của bạn</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportProducts}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaDownload className="text-sm" />
              <span>Xuất CSV</span>
            </button>
            <Link
              to="/account/partner/products/add"
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md"
            >
              <FaPlus className="text-sm" />
              <span>Thêm sản phẩm</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng sản phẩm</p>
                <p className="text-2xl font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <FaBox className="text-blue-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đang bán</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.filter(p => p.status === 'active').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <FaCheck className="text-green-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng lượt xem</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-xl">
                <FaEye className="text-purple-500 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng bán ra</p>
                <p className="text-2xl font-bold text-gray-800">
                  {products.reduce((sum, p) => sum + p.sales, 0)}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <FaDollarSign className="text-orange-500 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm theo tên hoặc danh mục..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="active">Đang bán</option>
                  <option value="inactive">Tạm ngưng</option>
                  <option value="out_of_stock">Hết hàng</option>
                  <option value="draft">Bản nháp</option>
                </select>
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none"
                >
                  <option value="created_at">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="price">Giá tăng dần</option>
                  <option value="stock">Tồn kho</option>
                  <option value="sales">Bán chạy</option>
                  <option value="views">Lượt xem</option>
                </select>
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.size > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm text-gray-600">
                  Đã chọn {selectedProducts.size} sản phẩm
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Kích hoạt
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Tạm ngưng
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-100 p-6 rounded-full inline-flex mb-4">
                <FaBox className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">Chưa có sản phẩm nào</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">Bắt đầu bằng cách thêm sản phẩm đầu tiên vào cửa hàng của bạn</p>
              <Link
                to="/account/partner/products/add"
                className="inline-flex items-center space-x-2 px-5 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shadow-md"
              >
                <FaPlus className="text-sm" />
                <span>Thêm sản phẩm đầu tiên</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <input
                        type="checkbox"
                        checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giá
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tồn kho
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thống kê
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="h-4 w-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <img
                              src={product.main_image}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover border"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/48x48/f0f0f0/999999?text=${product.name.charAt(0)}`;
                              }}
                            />
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                                <span className="text-xs text-white font-bold">HẾT HÀNG</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                            <div className="text-xs text-gray-400">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.price.toLocaleString('vi-VN')}₫
                        </div>
                        {product.original_price > product.price && (
                          <div className="text-xs text-gray-500 line-through">
                            {product.original_price.toLocaleString('vi-VN')}₫
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">{product.stock}</div>
                        {product.stock > 0 && product.stock < 10 && (
                          <div className="text-xs text-orange-500 font-medium">Sắp hết hàng</div>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                          {getStatusText(product.status)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-600 mb-1">
                            <FaEye className="mr-1 text-gray-400 text-xs" />
                            <span>{product.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaDollarSign className="mr-1 text-gray-400 text-xs" />
                            <span>{product.sales}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <Link
                            to={`/account/partner/products/${product.id}`}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye className="text-sm" />
                          </Link>
                          <Link
                            to={`/account/partner/products/${product.id}/edit`}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FaEdit className="text-sm" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(product)}
                            className={`p-2 rounded-lg transition-colors ${
                              product.status === 'active' 
                                ? 'text-orange-500 hover:text-orange-700 hover:bg-orange-50' 
                                : 'text-green-500 hover:text-green-700 hover:bg-green-50'
                            }`}
                            title={product.status === 'active' ? 'Tạm ngưng' : 'Kích hoạt'}
                          >
                            {product.status === 'active' ? (
                              <FaTimes className="text-sm" />
                            ) : (
                              <FaCheck className="text-sm" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white px-5 py-3 rounded-xl shadow-sm border border-gray-100">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">10</span> của{' '}
              <span className="font-medium">{sortedProducts.length}</span> kết quả
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-white bg-orange-500 border border-orange-500 rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-auto shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FaTrash className="text-red-500 text-lg" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa{" "}
                {productToDelete?.name.includes("sản phẩm đã chọn") 
                  ? productToDelete.name 
                  : `sản phẩm "${productToDelete?.name}"`}
                ? Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium shadow-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerProducts;