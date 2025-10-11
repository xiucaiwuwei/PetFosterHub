import notificationApi from '../api/notificationApi';
import { NotificationType } from '../types';
import type { NotificationService as LocalNotificationService } from '../hooks/useNotificationService';

/**
 * 通知服务类
 * 处理通知相关的业务逻辑
 */
export class NotificationService {
  /**
   * 获取用户通知列表
   * @param params 查询参数
   * @returns 通知列表数据
   */
  static async getNotifications(params?: {
    page?: number;
    size?: number;
    isRead?: boolean;
    type?: string;
  }) {
    try {
      const response = await notificationApi.getNotifications(params);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '获取通知列表失败');
    } catch (error) {
      console.error('获取通知列表失败:', error);
      throw error;
    }
  }

  /**
   * 获取未读通知数量
   * @returns 未读通知数量
   */
  static async getUnreadCount() {
    try {
      const response = await notificationApi.getUnreadCount();
      if (response.success && response.data !== undefined) {
        return response.data;
      }
      throw new Error(response.message || '获取未读通知数量失败');
    } catch (error) {
      console.error('获取未读通知数量失败:', error);
      throw error;
    }
  }

  /**
   * 标记单个通知为已读
   * @param notificationId 通知ID
   */
  static async markAsRead(notificationId: string) {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      if (!response.success) {
        throw new Error(response.message || '标记通知已读失败');
      }
    } catch (error) {
      console.error('标记通知已读失败:', error);
      throw error;
    }
  }

  /**
   * 标记所有通知为已读
   */
  static async markAllAsRead() {
    try {
      const response = await notificationApi.markAllAsRead();
      if (!response.success) {
        throw new Error(response.message || '标记所有通知已读失败');
      }
    } catch (error) {
      console.error('标记所有通知已读失败:', error);
      throw error;
    }
  }

  /**
   * 删除单个通知
   * @param notificationId 通知ID
   */
  static async deleteNotification(notificationId: string) {
    try {
      const response = await notificationApi.deleteNotification(notificationId);
      if (!response.success) {
        throw new Error(response.message || '删除通知失败');
      }
    } catch (error) {
      console.error('删除通知失败:', error);
      throw error;
    }
  }

  /**
   * 批量删除通知
   * @param notificationIds 通知ID数组
   */
  static async deleteNotifications(notificationIds: string[]) {
    try {
      const response = await notificationApi.deleteNotifications(notificationIds);
      if (!response.success) {
        throw new Error(response.message || '批量删除通知失败');
      }
    } catch (error) {
      console.error('批量删除通知失败:', error);
      throw error;
    }
  }

  /**
   * 显示成功通知
   * @param notificationService local notification service实例
   * @param message 通知消息
   * @param title 通知标题
   */
  static showSuccess(
    notificationService: LocalNotificationService,
    message: string,
    title?: string
  ) {
    notificationService.showSuccess(message, title ? { title } : {});
  }

  /**
   * 显示错误通知
   * @param notificationService local notification service实例
   * @param message 通知消息
   * @param title 通知标题
   */
  static showError(
    notificationService: LocalNotificationService,
    message: string,
    title?: string
  ) {
    notificationService.showError(message, title ? { title } : {});
  }

  /**
   * 显示警告通知
   * @param notificationService local notification service实例
   * @param message 通知消息
   * @param title 通知标题
   */
  static showWarning(
    notificationService: LocalNotificationService,
    message: string,
    title?: string
  ) {
    notificationService.showWarning(message, title ? { title } : {});
  }

  /**
   * 显示信息通知
   * @param notificationService local notification service实例
   * @param message 通知消息
   * @param title 通知标题
   */
  static showInfo(
    notificationService: LocalNotificationService,
    message: string,
    title?: string
  ) {
    notificationService.showInfo(message, title ? { title } : {});
  }

  /**
   * 显示自定义类型的通知
   * @param notificationService local notification service实例
   * @param message 通知消息
   * @param options 通知选项
   */
  static showNotification(
    notificationService: LocalNotificationService,
    message: string,
    options?: {
      title?: string;
      type?: NotificationType;
      duration?: number;
      onClick?: () => void;
    }
  ) {
    notificationService.showNotification(message, options);
  }
}

export default NotificationService;