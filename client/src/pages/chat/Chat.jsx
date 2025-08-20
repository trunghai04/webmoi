import React, { useState, useContext, useEffect, useRef } from "react";
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
  FaEllipsisH,
  FaBell,
  FaTimes,
  FaPhone,
  FaVideo
} from "react-icons/fa";
import io from "socket.io-client";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FloatingActions from "../../components/FloatingActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [messageInput, setMessageInput] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const socketRef = useRef();
  const messagesEndRef = useRef();
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Helper function to get token
  const getToken = () => {
    const stored = localStorage.getItem('msv_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return parsed.token;
      } catch (error) {
        console.error('Error parsing stored auth:', error);
      }
    }
    return null;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng chat');
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isAuthenticated && user) {
      socketRef.current = io(API_BASE, {
        withCredentials: true
      });

      // Join with user data
      socketRef.current.emit('join', {
        userId: user.id,
        username: user.username,
        role: user.role
      });

      // Listen for new messages
      socketRef.current.on('new_message', (message) => {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Play notification sound or show toast
        if (message.sender_id !== user.id) {
          toast.info(`Tin nhắn mới từ ${message.sender_name}`);
        }
      });

      // Listen for admin notifications
      socketRef.current.on('admin_notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        toast.success(`Thông báo: ${notification.title}`, {
          autoClose: 5000
        });
      });

      // Listen for typing indicators
      socketRef.current.on('user_typing', (data) => {
        if (data.userId !== user.id) {
          setTypingUsers(prev => {
            if (data.isTyping) {
              return [...prev.filter(u => u.userId !== data.userId), data];
            } else {
              return prev.filter(u => u.userId !== data.userId);
            }
          });
        }
      });

      // Listen for errors
      socketRef.current.on('error', (error) => {
        toast.error(error.message);
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isAuthenticated, user, API_BASE]);

  // Load chat rooms
  useEffect(() => {
    if (isAuthenticated) {
      loadChatRooms();
      loadNotifications();
    }
  }, [isAuthenticated]);

  // Load messages when chat room is selected
  useEffect(() => {
    if (selectedChat && selectedChat.id) {
      loadMessages(selectedChat.id);
      
      // Join the room
      if (socketRef.current) {
        socketRef.current.emit('join_room', selectedChat.id);
      }
    }
  }, [selectedChat]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatRooms = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/api/chat/rooms`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatRooms(data.data.rooms);
      } else if (response.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/api/chat/rooms/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.data.messages);
      } else if (response.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else if (response.status === 403) {
        toast.error('Bạn không có quyền truy cập phòng chat này');
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/api/chat/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data.notifications);
      } else if (response.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

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

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedChat && socketRef.current) {
      const messageData = {
        roomId: selectedChat.id,
        content: messageInput.trim(),
        type: 'text'
      };

      // Send via Socket.IO for real-time
      socketRef.current.emit('send_message', messageData);
      
      // Also send via HTTP API as backup
      try {
        const token = getToken();
        
        if (!token) {
          toast.error('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }

        await fetch(`${API_BASE}/api/chat/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(messageData)
        });
      } catch (error) {
        console.error('Error sending message via API:', error);
      }

      setMessageInput("");
      
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        socketRef.current.emit('typing', { roomId: selectedChat.id, isTyping: false });
      }
    }
  };

  const handleTyping = (e) => {
    setMessageInput(e.target.value);
    
    if (selectedChat && socketRef.current) {
      if (!isTyping && e.target.value.length > 0) {
        setIsTyping(true);
        socketRef.current.emit('typing', { roomId: selectedChat.id, isTyping: true });
      } else if (isTyping && e.target.value.length === 0) {
        setIsTyping(false);
        socketRef.current.emit('typing', { roomId: selectedChat.id, isTyping: false });
      }
    }
  };

  const createChatWithPartner = async (partnerId) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_BASE}/api/chat/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ partnerId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSelectedChat(data.data.room);
        loadChatRooms(); // Refresh room list
        return data.data.room;
      }
    } catch (error) {
      console.error('Error creating chat room:', error);
      toast.error('Không thể tạo phòng chat');
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      const token = getToken();
      
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      await fetch(`${API_BASE}/api/chat/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
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
              <h2 className="text-lg font-semibold text-red-500">
                Chat ({chatRooms.length})
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <FaBell className="text-gray-600 text-sm" />
                  {notifications.filter(n => !n.is_read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.filter(n => !n.is_read).length}
                    </span>
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <FaExternalLinkAlt className="text-gray-600 text-sm" />
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

            {/* Notifications Panel */}
            {showNotifications && (
              <div className="border-b border-gray-200 max-h-48 overflow-y-auto bg-gray-50">
                <div className="p-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Thông báo</h3>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Không có thông báo mới
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => markNotificationAsRead(notification.id)}
                        className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-white transition-colors ${
                          !notification.is_read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleString('vi-VN')}
                            </p>
                          </div>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {(chatRooms.length > 0 ? chatRooms : chatList).map((chat) => (
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
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>Chưa có tin nhắn nào</p>
                        <p className="text-sm mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender_id === user?.id 
                              ? 'bg-orange-500 text-white' 
                              : 'bg-white shadow-sm'
                          }`}>
                            {message.sender_id !== user?.id && (
                              <p className="text-xs text-gray-500 mb-1">
                                {message.sender_name}
                              </p>
                            )}
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender_id === user?.id ? 'text-orange-100' : 'text-gray-400'
                            }`}>
                              {new Date(message.created_at).toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    
                    {/* Typing Indicator */}
                    {typingUsers.length > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                          <div className="flex items-center space-x-1">
                            <span className="text-sm text-gray-500">
                              {typingUsers[0].username} đang nhập...
                            </span>
                            <div className="flex space-x-1">
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
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
                        onChange={handleTyping}
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
