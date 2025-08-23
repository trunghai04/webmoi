import React, { useState, useContext, useEffect } from "react";
import { FaCoins, FaHistory, FaPlus, FaMinus, FaSearch, FaFilter, FaCalendarAlt, FaDownload, FaPrint } from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const TransactionHistory = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate loading transaction data
    setTimeout(() => {
      const mockTransactions = [
        {
          id: 1,
          type: "earn",
          amount: 500,
          description: "Mua sắm đơn hàng #ORD001",
          date: "2024-01-15T10:30:00",
          status: "completed",
          orderId: "ORD001",
          category: "purchase",
          balanceAfter: 1250
        },
        {
          id: 2,
          type: "spend",
          amount: 200,
          description: "Đổi voucher giảm giá 50K",
          date: "2024-01-10T14:20:00",
          status: "completed",
          rewardId: "RWD001",
          category: "reward",
          balanceAfter: 750
        },
        {
          id: 3,
          type: "earn",
          amount: 300,
          description: "Đánh giá sản phẩm iPhone 15",
          date: "2024-01-05T09:15:00",
          status: "completed",
          productId: "PROD001",
          category: "review",
          balanceAfter: 950
        },
        {
          id: 4,
          type: "earn",
          amount: 450,
          description: "Mua sắm đơn hàng #ORD002",
          date: "2024-01-01T16:45:00",
          status: "completed",
          orderId: "ORD002",
          category: "purchase",
          balanceAfter: 650
        },
        {
          id: 5,
          type: "spend",
          amount: 1000,
          description: "Đổi voucher giảm giá 100K",
          date: "2023-12-28T11:30:00",
          status: "completed",
          rewardId: "RWD002",
          category: "reward",
          balanceAfter: 200
        },
        {
          id: 6,
          type: "earn",
          amount: 100,
          description: "Giới thiệu bạn bè - Nguyễn Văn B",
          date: "2023-12-25T13:20:00",
          status: "completed",
          referralId: "REF001",
          category: "referral",
          balanceAfter: 1200
        },
        {
          id: 7,
          type: "earn",
          amount: 250,
          description: "Hoàn xu từ đơn hàng #ORD003",
          date: "2023-12-20T08:10:00",
          status: "completed",
          orderId: "ORD003",
          category: "refund",
          balanceAfter: 1100
        },
        {
          id: 8,
          type: "spend",
          amount: 500,
          description: "Đổi miễn phí vận chuyển",
          date: "2023-12-15T15:40:00",
          status: "pending",
          rewardId: "RWD003",
          category: "shipping",
          balanceAfter: 850
        },
        {
          id: 9,
          type: "earn",
          amount: 800,
          description: "Mua sắm đơn hàng #ORD004",
          date: "2023-12-10T12:25:00",
          status: "completed",
          orderId: "ORD004",
          category: "purchase",
          balanceAfter: 1350
        },
        {
          id: 10,
          type: "spend",
          amount: 2000,
          description: "Đổi tai nghe Bluetooth",
          date: "2023-12-05T10:15:00",
          status: "completed",
          rewardId: "RWD004",
          category: "product",
          balanceAfter: 550
        }
      ];
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           transaction.id.toString().includes(searchQuery);
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const daysDiff = Math.floor((now - transactionDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case '7':
            matchesDate = daysDiff <= 7;
            break;
          case '30':
            matchesDate = daysDiff <= 30;
            break;
          case '90':
            matchesDate = daysDiff <= 90;
            break;
          case '365':
            matchesDate = daysDiff <= 365;
            break;
        }
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
    
    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, typeFilter, dateFilter, statusFilter]);

  const getTypeColor = (type) => {
    return type === 'earn' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'purchase':
        return <FaCoins className="text-blue-500" />;
      case 'reward':
        return <FaCoins className="text-purple-500" />;
      case 'review':
        return <FaCoins className="text-green-500" />;
      case 'referral':
        return <FaCoins className="text-orange-500" />;
      case 'refund':
        return <FaCoins className="text-yellow-500" />;
      case 'shipping':
        return <FaCoins className="text-indigo-500" />;
      case 'product':
        return <FaCoins className="text-pink-500" />;
      default:
        return <FaCoins className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleExportData = () => {
    // Simulate export functionality
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Loại,Số lượng,Mô tả,Ngày,Trạng thái\n" +
      filteredTransactions.map(t => 
        `${t.id},${t.type === 'earn' ? 'Nhận' : 'Tiêu'},${t.amount},${t.description},${formatDate(t.date)},${t.status}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transaction_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintHistory = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lịch sử giao dịch</h1>
        <p className="text-gray-600">Theo dõi tất cả giao dịch xu của bạn</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm giao dịch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="all">Tất cả loại</option>
              <option value="earn">Nhận xu</option>
              <option value="spend">Tiêu xu</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="90">3 tháng qua</option>
              <option value="365">1 năm qua</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="completed">Hoàn thành</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>

        {/* Export Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
          >
            <FaDownload />
            Xuất CSV
          </button>
          <button
            onClick={handlePrintHistory}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            <FaPrint />
            In lịch sử
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600">Tổng nhận</p>
              <p className="text-2xl font-bold text-green-800">
                {transactions
                  .filter(t => t.type === 'earn')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()} xu
              </p>
            </div>
            <FaPlus className="text-2xl text-green-600" />
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600">Tổng tiêu</p>
              <p className="text-2xl font-bold text-red-800">
                {transactions
                  .filter(t => t.type === 'spend')
                  .reduce((sum, t) => sum + t.amount, 0)
                  .toLocaleString()} xu
              </p>
            </div>
            <FaMinus className="text-2xl text-red-600" />
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600">Số giao dịch</p>
              <p className="text-2xl font-bold text-blue-800">
                {transactions.length}
              </p>
            </div>
            <FaHistory className="text-2xl text-blue-600" />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Không có giao dịch nào</h3>
          <p className="text-gray-500">Không tìm thấy giao dịch nào phù hợp với bộ lọc</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                    {transaction.type === 'earn' ? <FaPlus /> : <FaMinus />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-800">{transaction.description}</h4>
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>ID: {transaction.id}</span>
                      <span>{formatDate(transaction.date)}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status === 'completed' ? 'Hoàn thành' : 
                         transaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'earn' ? '+' : '-'}{transaction.amount.toLocaleString()} xu
                  </div>
                  <div className="text-sm text-gray-500">
                    Số dư: {transaction.balanceAfter.toLocaleString()} xu
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredTransactions.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Hiển thị {filteredTransactions.length} trong tổng số {transactions.length} giao dịch
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Trước
            </button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
