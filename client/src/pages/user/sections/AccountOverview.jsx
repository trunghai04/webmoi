import React, { useContext } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaCreditCard,
  FaShieldAlt,
  FaBell
} from "react-icons/fa";
import { AuthContext } from "../../../context/AuthContext";

const AccountOverview = () => {
  const { user } = useContext(AuthContext);
  
  // AccountOverview component loaded

  const accountStats = [
    {
      title: "Đơn hàng",
      value: "12",
      icon: FaUser,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Đánh giá",
      value: "8",
      icon: FaUser,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Voucher",
      value: "5",
      icon: FaUser,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Xu tích lũy",
      value: "1,250",
      icon: FaUser,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  const quickActions = [
    {
      title: "Thông tin cá nhân",
      description: "Cập nhật thông tin cá nhân",
      icon: FaUser,
      path: "/user/account/personal",
      color: "text-blue-500"
    },
    {
      title: "Đổi mật khẩu",
      description: "Bảo mật tài khoản",
      icon: FaShieldAlt,
      path: "/user/account/password",
      color: "text-green-500"
    },
    {
      title: "Thông báo",
      description: "Cài đặt thông báo",
      icon: FaBell,
      path: "/user/account/notifications",
      color: "text-orange-500"
    },
    {
      title: "Ngân hàng",
      description: "Quản lý tài khoản ngân hàng",
      icon: FaCreditCard,
      path: "/user/account/bank",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Chào mừng trở lại, {user?.name || user?.username || 'Người dùng'}!
        </h1>
        <p className="text-orange-100">
          Quản lý tài khoản và theo dõi hoạt động mua sắm của bạn
        </p>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {accountStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`text-lg ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin tài khoản</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Tên đăng nhập</p>
                <p className="font-medium text-gray-800">{user?.username || 'Chưa cập nhật'}</p>
              </div>
            </div>
            
            {user?.email && (
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
                </div>
              </div>
            )}
            
            {user?.phone && (
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại</p>
                  <p className="font-medium text-gray-800">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {user?.birthDate && (
              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Ngày sinh</p>
                  <p className="font-medium text-gray-800">{user.birthDate}</p>
                </div>
              </div>
            )}
            
            {user?.address && (
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Địa chỉ</p>
                  <p className="font-medium text-gray-800">{user.address}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Trạng thái</p>
                <p className="font-medium text-green-600">Đã xác thực</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Thao tác nhanh</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gray-50`}>
                  <action.icon className={`text-lg ${action.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Đăng nhập thành công</p>
              <p className="text-xs text-gray-500">Hôm nay, 14:30</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Cập nhật thông tin cá nhân</p>
              <p className="text-xs text-gray-500">Hôm qua, 16:45</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">Đặt hàng thành công</p>
              <p className="text-xs text-gray-500">2 ngày trước</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverview;
