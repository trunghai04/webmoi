import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBolt, FaClock, FaFire } from "react-icons/fa";

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 50,
    seconds: 40
  });

  // Mock flash sale data
  const flashSaleItems = [
    {
      id: 1,
      title: "iPhone 15 Pro Max 256GB",
      price: 29990000,
      originalPrice: 34990000,
      discount: 14,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
      sold: 1250,
      stock: 45,
      rating: 4.8
    },
    {
      id: 2,
      title: "Samsung Galaxy S24 Ultra",
      price: 25990000,
      originalPrice: 29990000,
      discount: 13,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      sold: 890,
      stock: 32,
      rating: 4.7
    },
    {
      id: 3,
      title: "MacBook Air M2 13-inch",
      price: 25990000,
      originalPrice: 29990000,
      discount: 13,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
      sold: 567,
      stock: 28,
      rating: 4.9
    },
    {
      id: 4,
      title: "AirPods Pro 2nd Gen",
      price: 5990000,
      originalPrice: 7990000,
      discount: 25,
      image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
      sold: 2340,
      stock: 67,
      rating: 4.6
    },
    {
      id: 5,
      title: "iPad Air 5th Gen",
      price: 15990000,
      originalPrice: 18990000,
      discount: 16,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      sold: 789,
      stock: 23,
      rating: 4.8
    },
    {
      id: 6,
      title: "Sony WH-1000XM5",
      price: 7990000,
      originalPrice: 9990000,
      discount: 20,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      sold: 456,
      stock: 15,
      rating: 4.9
    }
  ];

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        let { hours, minutes, seconds } = prevTime;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              // Flash sale ended - reset to next session
              clearInterval(timer);
              return { hours: 2, minutes: 0, seconds: 0 };
            }
          }
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  const isFlashSaleActive = timeLeft.hours > 0 || timeLeft.minutes > 0 || timeLeft.seconds > 0;

  return (
    <section className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl shadow-lg p-6 mb-8 border border-orange-200">
      {/* Header with countdown */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FaBolt className="text-orange-500 text-2xl" />
            <h2 className="text-2xl font-bold text-orange-600">Flash Sale</h2>
            <FaFire className="text-red-500 text-xl" />
          </div>
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-2 ml-4">
            <FaClock className="text-orange-500" />
            <span className="text-sm font-medium text-orange-700">Kết thúc sau:</span>
            <div className="flex gap-1">
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-center min-w-[40px]">
                <div className="text-sm font-bold">{formatTime(timeLeft.hours)}</div>
                <div className="text-xs">Giờ</div>
              </div>
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-center min-w-[40px]">
                <div className="text-sm font-bold">{formatTime(timeLeft.minutes)}</div>
                <div className="text-xs">Phút</div>
              </div>
              <div className="bg-orange-500 text-white px-2 py-1 rounded text-center min-w-[40px]">
                <div className="text-sm font-bold">{formatTime(timeLeft.seconds)}</div>
                <div className="text-xs">Giây</div>
              </div>
            </div>
          </div>
        </div>
        
        <Link 
          to="/flash-sale" 
          className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1 transition-colors"
        >
          Xem tất cả
          <span className="text-lg">→</span>
        </Link>
      </div>

      {/* Flash Sale Status */}
      <div className="mb-6">
        {isFlashSaleActive ? (
          <div className="bg-green-100 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 font-medium">Flash Sale đang diễn ra - Giảm giá cực sốc!</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-gray-700 font-medium">Flash Sale đã kết thúc. Hẹn gặp lại trong phiên tiếp theo!</span>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {flashSaleItems.map((item) => (
          <Link key={item.id} to={`/product/${item.id}`} className="block group">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-105">
              {/* Product Image */}
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full aspect-square object-cover"
                  onError={(e) => { 
                    e.currentTarget.src = '/uploads/products/default.svg'; 
                  }} 
                />
                
                {/* Flash Sale Badge */}
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
                  -{item.discount}%
                </div>
                
                {/* Stock Indicator */}
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  Còn {item.stock}
                </div>
              </div>
              
              {/* Product Info */}
              <div className="p-3">
                {/* Title */}
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] mb-2 group-hover:text-orange-600 transition-colors">
                  {item.title}
                </h3>
                
                {/* Price */}
                <div className="mb-2">
                  <div className="text-orange-600 font-bold text-lg">
                    ₫{item.price.toLocaleString("vi-VN")}
                  </div>
                  {item.originalPrice > item.price && (
                    <div className="text-xs text-gray-400 line-through">
                      ₫{item.originalPrice.toLocaleString("vi-VN")}
                    </div>
                  )}
                </div>
                
                {/* Rating and Sold */}
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{item.rating}</span>
                  </div>
                  <span>Đã bán {item.sold.toLocaleString("vi-VN")}</span>
                </div>
                
                {/* Flash Sale Status */}
                <div className="bg-orange-100 text-orange-700 text-xs font-semibold rounded-full px-3 py-1 text-center">
                  {isFlashSaleActive ? 'ĐANG BÁN CHẠY' : 'ĐÃ KẾT THÚC'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Next Flash Sale Times */}
      <div className="mt-6 pt-4 border-t border-orange-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Các khung giờ Flash Sale tiếp theo:</h4>
        <div className="flex flex-wrap gap-2">
          <div className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-center">
            <div className="text-xs text-gray-600">20:00 - 22:00</div>
            <div className="text-orange-600 font-semibold text-sm">Flash Sale Tối</div>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-center">
            <div className="text-xs text-gray-600">08:00 - 10:00</div>
            <div className="text-orange-600 font-semibold text-sm">Flash Sale Sáng</div>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-center">
            <div className="text-xs text-gray-600">14:00 - 16:00</div>
            <div className="text-orange-600 font-semibold text-sm">Flash Sale Chiều</div>
          </div>
          <div className="bg-white border border-orange-200 rounded-lg px-3 py-2 text-center">
            <div className="text-xs text-gray-600">00:00 - 02:00</div>
            <div className="text-orange-600 font-semibold text-sm">Flash Sale Đêm</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;


