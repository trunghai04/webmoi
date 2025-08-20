import React, { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, 
  FaQuestionCircle, 
  FaInfoCircle,
  FaTimes,
  FaCheck,
  FaTimes as FaX
} from 'react-icons/fa';

const ConfirmPopup = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  type = 'warning', 
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  showCloseButton = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    setIsVisible(false);
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 300);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: FaExclamationTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          confirmButtonColor: 'bg-red-500 hover:bg-red-600',
          cancelButtonColor: 'bg-gray-500 hover:bg-gray-600'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
          confirmButtonColor: 'bg-yellow-500 hover:bg-yellow-600',
          cancelButtonColor: 'bg-gray-500 hover:bg-gray-600'
        };
      case 'info':
        return {
          icon: FaInfoCircle,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          confirmButtonColor: 'bg-blue-500 hover:bg-blue-600',
          cancelButtonColor: 'bg-gray-500 hover:bg-gray-600'
        };
      case 'success':
        return {
          icon: FaCheck,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          confirmButtonColor: 'bg-green-500 hover:bg-green-600',
          cancelButtonColor: 'bg-gray-500 hover:bg-gray-600'
        };
      default:
        return {
          icon: FaQuestionCircle,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-500',
          titleColor: 'text-gray-800',
          messageColor: 'text-gray-700',
          confirmButtonColor: 'bg-gray-500 hover:bg-gray-600',
          cancelButtonColor: 'bg-gray-400 hover:bg-gray-500'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Popup */}
      <div 
        className={`relative transform transition-all duration-300 ease-in-out ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-[-50px] opacity-0 scale-95'
        }`}
      >
        <div className={`max-w-md w-full ${config.bgColor} border-2 ${config.borderColor} rounded-xl shadow-2xl p-6 relative backdrop-blur-md bg-opacity-98`}>
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          )}
          
          {/* Content */}
          <div className="flex items-start gap-4">
            <Icon className={`w-8 h-8 mt-1 ${config.iconColor} flex-shrink-0`} />
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-lg font-semibold ${config.titleColor} mb-2`}>
                {title}
              </h3>
              <p className={`text-sm ${config.messageColor} leading-relaxed`}>
                {message}
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={handleClose}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${config.cancelButtonColor}`}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${config.confirmButtonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
