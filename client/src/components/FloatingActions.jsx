import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaComment, FaShoppingCart, FaHeadset, FaArrowUp, FaReply } from "react-icons/fa";
import { CartContext } from "../context/CartContext";

const FloatingActions = ({ hideCart = false }) => {
  const { cartItems } = useContext(CartContext);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 w-12 space-y-2 z-50 hidden lg:block">
      <Link to="/chat" className="block">
        <div className="bg-white rounded-l-lg shadow-sm p-2 text-center cursor-pointer hover:shadow-md border border-r-0 hover:bg-orange-50">
          <FaComment className="text-gray-600 text-sm mx-auto mb-1" />
          <div className="text-xs text-gray-600">Chat</div>
        </div>
      </Link>
      
      {!hideCart && (
        <Link to="/cart" className="block">
          <div className="bg-white rounded-l-lg shadow-sm p-2 text-center cursor-pointer hover:shadow-md border border-r-0 hover:bg-orange-50 relative">
            <FaShoppingCart className="text-gray-600 text-sm mx-auto mb-1" />
            <div className="text-xs text-gray-600">Giỏ hàng</div>
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            )}
          </div>
        </Link>
      )}
      
      <Link to="/support" className="block">
        <div className="bg-white rounded-l-lg shadow-sm p-2 text-center cursor-pointer hover:shadow-md border border-r-0 hover:bg-orange-50">
          <FaHeadset className="text-gray-600 text-sm mx-auto mb-1" />
          <div className="text-xs text-gray-600">Hỗ trợ</div>
        </div>
      </Link>
      
      <Link to="/feedback" className="block">
        <div className="bg-white rounded-l-lg shadow-sm p-2 text-center cursor-pointer hover:shadow-md border border-r-0 hover:bg-orange-50">
          <FaReply className="text-gray-600 text-sm mx-auto mb-1" />
          <div className="text-xs text-gray-600">Phản hồi</div>
        </div>
      </Link>
      
      <div onClick={scrollToTop} className="bg-white rounded-l-lg shadow-sm p-2 text-center cursor-pointer hover:shadow-md border border-r-0 hover:bg-orange-50 mt-5">
        <FaArrowUp className="text-gray-600 text-sm mx-auto mb-1" />
        <div className="text-xs text-gray-600">Lên đầu</div>
      </div>
    </div>
  );
};

export default FloatingActions;


