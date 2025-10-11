import { useNotifications } from '../contexts/NotificationsContext';
import { Notification, NotificationType } from '../types';

// 通知服务接口
export interface NotificationService {
  // 显示成功通知
  showSuccess: (message: string, options?: {
    title?: string;
    duration?: number;
    onClick?: () => void;
  }) => void;
  
  // 显示错误通知
  showError: (message: string, options?: {
    title?: string;
    duration?: number;
    onClick?: () => void;
  }) => void;
  
  // 显示警告通知
  showWarning: (message: string, options?: {
    title?: string;
    duration?: number;
    onClick?: () => void;
  }) => void;
  
  // 显示信息通知
  showInfo: (message: string, options?: {
    title?: string;
    duration?: number;
    onClick?: () => void;
  }) => void;
  
  // 显示默认通知
  showNotification: (message: string, options?: {
    title?: string;
    type?: NotificationType;
    duration?: number;
    onClick?: () => void;
  }) => void;
}

// 创建通知服务Hook
export function useNotificationService(): NotificationService {
  const { addNotification } = useNotifications();

  // 基础显示通知函数
  const showNotification = (
    message: string,
    options?: {
      title?: string;
      type?: NotificationType;
      duration?: number;
      onClick?: () => void;
    }
  ) => {
    const { title, type = NotificationType.DEFAULT, duration, onClick } = options || {};
    
    // 使用对象解构和条件运算符构建notificationData，避免直接修改对象字面量
    const notificationData: Omit<Notification, "id" | "timestamp" | "isRead"> = {
      message,
      type,
      ...(title !== undefined && { title }),
      ...(duration !== undefined && { duration }),
      ...(onClick !== undefined && { onClick })
    };
    
    addNotification(notificationData);
  };

  // 显示成功通知
  const showSuccess = (
    message: string,
    options?: {
      title?: string;
      duration?: number;
      onClick?: () => void;
    }
  ) => {
    showNotification(message, {
      ...options,
      type: NotificationType.SUCCESS
    });
  };

  // 显示错误通知
  const showError = (
    message: string,
    options?: {
      title?: string;
      duration?: number;
      onClick?: () => void;
    }
  ) => {
    showNotification(message, {
      ...options,
      type: NotificationType.ERROR
    });
  };

  // 显示警告通知
  const showWarning = (
    message: string,
    options?: {
      title?: string;
      duration?: number;
      onClick?: () => void;
    }
  ) => {
    showNotification(message, {
      ...options,
      type: NotificationType.WARNING
    });
  };

  // 显示信息通知
  const showInfo = (
    message: string,
    options?: {
      title?: string;
      duration?: number;
      onClick?: () => void;
    }
  ) => {
    showNotification(message, {
      ...options,
      type: NotificationType.INFO
    });
  };

  return {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}