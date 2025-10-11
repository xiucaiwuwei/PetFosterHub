import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Notification, NotificationsContextType } from '../types';
import notificationApi from '../api/notificationApi';

// 创建通知上下文
const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// 生成唯一ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// 通知上下文提供者组件
export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 从后端加载通知列表
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getNotifications({ page: 1, size: 50 });
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('加载通知失败:', error);
      // 可以选择使用本地通知或显示错误提示
    } finally {
      setLoading(false);
    }
  }, []);

  // 从后端获取未读通知数量
  const fetchUnreadCount = useCallback(async (): Promise<number> => {
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      return notifications.filter(notification => !notification.isRead).length;
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      return notifications.filter(notification => !notification.isRead).length;
    }
  }, [notifications]);

  // 组件挂载时加载通知
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // 添加通知
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: Date.now(),
      isRead: false,
      duration: notification.duration ?? 5000 // 默认5秒
    };

    setNotifications(prev => [...prev, newNotification]);

    // 如果设置了自动关闭，则添加定时器
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, newNotification.duration);
    }
  }, []);

  // 移除通知
  const removeNotification = useCallback(async (id: string) => {
    try {
      // 先更新本地状态，提升用户体验
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      // 然后调用API更新后端数据
      await notificationApi.deleteNotification(id);
    } catch (error) {
      console.error('删除通知失败:', error);
      // 如果API调用失败，可以选择回滚本地状态
      loadNotifications();
    }
  }, [loadNotifications]);

  // 标记为已读
  const markAsRead = useCallback(async (id: string) => {
    try {
      // 先更新本地状态
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      // 然后调用API更新后端数据
      await notificationApi.markAsRead(id);
    } catch (error) {
      console.error('标记通知已读失败:', error);
      // 如果API调用失败，可以选择回滚本地状态
      loadNotifications();
    }
  }, [loadNotifications]);

  // 标记所有通知为已读
  const markAllAsRead = useCallback(async () => {
    try {
      // 先更新本地状态
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      // 然后调用API更新后端数据
      await notificationApi.markAllAsRead();
    } catch (error) {
      console.error('标记所有通知已读失败:', error);
      // 如果API调用失败，可以选择回滚本地状态
      loadNotifications();
    }
  }, [loadNotifications]);

  // 清除所有通知
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // 获取未读通知数量
  const getUnreadCount = useCallback(() => {
    return notifications.filter(notification => !notification.isRead).length;
  }, [notifications]);

  const value: NotificationsContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getUnreadCount,
    loadNotifications,
    fetchUnreadCount,
    loading
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// 自定义Hook，用于使用通知上下文
export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}