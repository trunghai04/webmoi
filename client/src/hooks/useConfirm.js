import { useState, useCallback } from 'react';

const useConfirm = () => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy',
    onConfirm: null
  });

  const showConfirm = useCallback(({
    type = 'warning',
    title = 'Xác nhận hành động',
    message = 'Bạn có chắc chắn muốn thực hiện hành động này?',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy',
    onConfirm
  }) => {
    setConfirmDialog({
      isOpen: true,
      type,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm
    });
  }, []);

  const hideConfirm = useCallback(() => {
    setConfirmDialog(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const showDeleteConfirm = useCallback((message, onConfirm) => {
    showConfirm({
      type: 'danger',
      title: 'Xác nhận xóa',
      message: message || 'Bạn có chắc chắn muốn xóa mục này?',
      confirmText: 'Xóa',
      cancelText: 'Hủy',
      onConfirm
    });
  }, [showConfirm]);

  const showWarningConfirm = useCallback((title, message, onConfirm) => {
    showConfirm({
      type: 'warning',
      title: title || 'Cảnh báo',
      message: message || 'Bạn có chắc chắn muốn thực hiện hành động này?',
      confirmText: 'Tiếp tục',
      cancelText: 'Hủy',
      onConfirm
    });
  }, [showConfirm]);

  const showInfoConfirm = useCallback((title, message, onConfirm) => {
    showConfirm({
      type: 'info',
      title: title || 'Thông tin',
      message: message || 'Bạn có chắc chắn muốn thực hiện hành động này?',
      confirmText: 'Đồng ý',
      cancelText: 'Hủy',
      onConfirm
    });
  }, [showConfirm]);

  return {
    confirmDialog,
    showConfirm,
    hideConfirm,
    showDeleteConfirm,
    showWarningConfirm,
    showInfoConfirm
  };
};

export default useConfirm;

