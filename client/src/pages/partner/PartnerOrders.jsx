import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';


import { 
  FaSearch, 
  FaFilter, 
  FaSort, 
  FaEye, 
  FaEdit, 
  FaTruck, 
  FaCheck, 
  FaTimes,
  FaBox,
  FaUser,
  FaCalendar,
  FaDollarSign,
  FaPrint,
  FaDownload,
  FaArrowLeft
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const PartnerOrders = () => {
  const { user } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  // Mock data for orders
  const [mockOrders] = useState([
    {
      id: 'ORD001',
      customer: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM'
      },
      items: [
        {
          id: 1,
          name: 'Áo thun nam basic',
          price: 150000,
          quantity: 2,
          image: '/uploads/products/ao-thun-nam-1.jpg'
        }
      ],
      total: 300000,
      status: 'pending',
      payment_method: 'cod',
      created_at: '2024-01-15 14:30:00',
      notes: 'Giao hàng vào buổi chiều'
    },
    {
      id: 'ORD002',
      customer: {
        name: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận 3, TP.HCM'
      },
      items: [
        {
          id: 2,
          name: 'Quần jean nữ slim fit',
          price: 250000,
          quantity: 1,
          image: '/uploads/products/quan-jean-nu-1.jpg'
        }
      ],
      total: 250000,
      status: 'processing',
      payment_method: 'bank_transfer',
      created_at: '2024-01-14 09:15:00',
      notes: ''
    },
    {
      id: 'ORD003',
      customer: {
        name: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0369852147',
        address: '789 Đường DEF, Quận 7, TP.HCM'
      },
      items: [
        {
          id: 3,
          name: 'Váy đầm công sở',
          price: 350000,
          quantity: 1,
          image: '/uploads/products/vay-dam-1.jpg'
        }
      ],
      total: 350000,
      status: 'delivered',
      payment_method: 'cod',
      created_at: '2024-01-13 11:20:00',
      notes: ''
    }
  ]);

  useEffect(() => {
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, [mockOrders]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đã gửi hàng';
      case 'delivered': return 'Đã giao hàng';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    toast.success(`Đã cập nhật trạng thái đơn hàng ${orderId}`);
  };

  const handleExportOrders = () => {
    const csvContent = [
      ['Mã đơn hàng', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Ngày tạo'],
      ...orders.map(order => [
        order.id,
        order.customer.name,
        order.total.toLocaleString(),
        getStatusText(order.status),
        order.created_at
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    
    toast.success('Đã xuất danh sách đơn hàng thành công!');
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'created_at':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'total':
        return b.total - a.total;
      case 'customer_name':
        return a.customer.name.localeCompare(b.customer.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">


        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/account/partner" className="p-2 text-gray-600 hover:text-orange-500 transition-colors">
              <FaArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
              <p className="text-gray-600 text-sm">Theo dõi và xử lý đơn hàng của khách hàng</p>
            </div>
          </div>
          <button
            onClick={handleExportOrders}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaDownload className="text-sm" />
            <span>Xuất danh sách</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Tổng đơn hàng</p>
                <p className="text-xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaBox className="text-blue-500 text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Chờ xử lý</p>
                <p className="text-xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FaEdit className="text-yellow-500 text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đang xử lý</p>
                <p className="text-xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'processing').length}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaTruck className="text-blue-500 text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đã gửi hàng</p>
                <p className="text-xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'shipped').length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <FaTruck className="text-purple-500 text-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Đã giao hàng</p>
                <p className="text-xl font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <FaCheck className="text-green-500 text-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng, tên khách hàng..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã gửi hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <FaSort className="text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="created_at">Mới nhất</option>
                  <option value="total">Giá trị cao nhất</option>
                  <option value="customer_name">Tên khách hàng A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {sortedOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Không có đơn hàng nào</h3>
              <p className="text-gray-500">Chưa có đơn hàng nào được tạo hoặc không tìm thấy đơn hàng phù hợp.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tổng tiền
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        <div className="text-sm text-gray-500">{order.items.length} sản phẩm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₫{order.total.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.created_at).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FaEye className="text-sm" />
                          </button>
                          {order.status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'processing')}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              title="Bắt đầu xử lý"
                            >
                              <FaEdit className="text-sm" />
                            </button>
                          )}
                          {order.status === 'processing' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'shipped')}
                              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Gửi hàng"
                            >
                              <FaTruck className="text-sm" />
                            </button>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}
                              className="p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                              title="Xác nhận giao hàng"
                            >
                              <FaCheck className="text-sm" />
                            </button>
                          )}
                          {(order.status === 'pending' || order.status === 'processing') && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hủy đơn hàng"
                            >
                              <FaTimes className="text-sm" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
};

export default PartnerOrders;
