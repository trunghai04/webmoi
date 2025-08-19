import React, { useState, useContext, useEffect } from "react";
import { 
  FaSearch, 
  FaChevronDown, 
  FaExternalLinkAlt, 
  FaDownload,
  FaCar,
  FaGamepad,
  FaDesktop,
  FaUser,
  FaPaperPlane,
  FaSmile,
  FaPaperclip,
  FaEllipsisH
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";

const Chat = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [messageInput, setMessageInput] = useState("");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock chat data
  const chatList = [
    {
      id: 1,
      name: "LongVu Auto",
      avatar: "LONGVU AUTO",
      avatarIcon: FaCar,
      lastMessage: "Đánh giá để nhận S...",
      date: "Thứ 4",
      unreadCount: 1,
      isOnline: true
    },
    {
      id: 2,
      name: "izzygamehn",
      avatar: "IZZYGAME",
      avatarIcon: FaGamepad,
      lastMessage: "có sẵn card wifi rồi a ơi",
      date: "02/08",
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 3,
      name: "Spin Electronics",
      avatar: "Spin",
      avatarIcon: FaDesktop,
      lastMessage: "Màn hình không có loa",
      date: "25/07",
      unreadCount: 0,
      isOnline: true
    },
    {
      id: 4,
      name: "Edra Official",
      avatar: "EDRA",
      avatarIcon: FaUser,
      lastMessage: "Dạ không có loa a",
      date: "25/07",
      unreadCount: 0,
      isOnline: false
    }
  ];

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", messageInput);
      setMessageInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500", 
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500"
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

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

      <div className="h-20 md:h-24 lg:h-32"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px] flex">
          {/* Left Sidebar - Chat List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-red-500">Chat (1)</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaExternalLinkAlt className="text-gray-600 text-sm" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaDownload className="text-gray-600 text-sm" />
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="all">Tất cả</option>
                    <option value="unread">Chưa đọc</option>
                    <option value="online">Đang online</option>
                  </select>
                  <FaChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-orange-50 border-orange-200' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full ${getAvatarColor(chat.avatar)} flex items-center justify-center text-white font-semibold text-sm`}>
                        <chat.avatarIcon className="text-lg" />
                      </div>
                      {chat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-gray-500">{chat.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="ml-2">
                        <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full ${getAvatarColor(selectedChat.avatar)} flex items-center justify-center text-white font-semibold text-sm`}>
                        <selectedChat.avatarIcon className="text-base" />
                      </div>
                      {selectedChat.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedChat.isOnline ? 'Đang online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FaEllipsisH className="text-gray-600" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  <div className="space-y-4">
                    {/* Example messages */}
                    <div className="flex justify-end">
                      <div className="bg-orange-500 text-white px-4 py-2 rounded-lg max-w-xs">
                        <p className="text-sm">Xin chào! Tôi cần hỗ trợ về sản phẩm</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white px-4 py-2 rounded-lg max-w-xs shadow-sm">
                        <p className="text-sm">Chào bạn! Tôi có thể giúp gì cho bạn?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <FaPaperclip className="text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                        rows={1}
                      />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <FaSmile className="text-gray-600" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <FaPaperPlane className="text-sm" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-24 bg-gray-300 rounded-lg mx-auto relative">
                      <div className="absolute inset-2 bg-gray-200 rounded"></div>
                      <div className="absolute top-3 left-3 w-16 h-3 bg-blue-500 rounded"></div>
                      <div className="absolute top-8 left-3 w-12 h-2 bg-gray-400 rounded"></div>
                      <div className="absolute top-11 left-3 w-8 h-2 bg-gray-400 rounded"></div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Chào mừng bạn đến với MuaSamViet Chat
                  </h3>
                  <p className="text-gray-600">
                    Bắt đầu trả lời người mua!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingActions />
      <Footer />
    </div>
  );
};

export default Chat;
