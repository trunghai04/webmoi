import { useState, useCallback } from 'react';

const useNotification = () => {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    duration: 5000
  });

  const showNotification = useCallback(({ type = 'info', title = '', message = '', duration = 5000 }) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
      duration
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const showSuccess = useCallback((message, title = 'Thành công') => {
    showNotification({ type: 'success', title, message });
  }, [showNotification]);

  const showError = useCallback((message, title = 'Lỗi') => {
    showNotification({ type: 'error', title, message });
  }, [showNotification]);

  const showWarning = useCallback((message, title = 'Cảnh báo') => {
    showNotification({ type: 'warning', title, message });
  }, [showNotification]);

  const showInfo = useCallback((message, title = 'Thông tin') => {
    showNotification({ type: 'info', title, message });
  }, [showNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useNotification;

