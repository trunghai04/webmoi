import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaTimes,
  FaTimesCircle
} from 'react-icons/fa';

const NotificationPopup = ({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  duration = 5000,
  showCloseButton = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      
      // Auto close after duration
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-500',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700'
        };
      case 'error':
        return {
          icon: FaTimesCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-500',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-500',
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700'
        };
      case 'info':
      default:
        return {
          icon: FaInfoCircle,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-500',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pointer-events-none">
      <div 
        className={`transform transition-all duration-300 ease-in-out pointer-events-auto ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-[-100%] opacity-0 scale-95'
        }`}
      >
        <div className={`max-w-sm w-full ${config.bgColor} border ${config.borderColor} rounded-lg shadow-lg p-4 relative`}>
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          )}
          
          {/* Content */}
          <div className="flex items-start gap-3">
            <Icon className={`w-6 h-6 mt-0.5 ${config.iconColor} flex-shrink-0`} />
            
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className={`text-sm font-semibold ${config.titleColor} mb-1`}>
                  {title}
                </h3>
              )}
              {message && (
                <p className={`text-sm ${config.messageColor}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          {duration > 0 && (
            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${config.iconColor.replace('text-', 'bg-')} transition-all duration-300 ease-linear`}
                style={{
                  width: isVisible ? '0%' : '100%',
                  transitionDuration: `${duration}ms`
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;

