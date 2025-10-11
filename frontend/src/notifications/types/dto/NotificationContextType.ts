/**
 * 通知上下文类型 - 定义通知相关的状态和操作
 */
import { Notification } from '../entity';

// 通知上下文接口
export interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
  loadNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<number>;
  loading: boolean;
}