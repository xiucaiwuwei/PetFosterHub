import { get, post, put, del } from '@/lib/api';
import type { BaseResponse } from '@/types/dto/baseDto';
import type { Notification } from '../types';

/**
 * 通知相关API接口
 */
export const notificationApi = {
  /**
   * 获取用户通知列表
   * @param params 查询参数
   * @returns 通知列表数据
   */
  getNotifications: async (params?: {
    page?: number;
    size?: number;
    isRead?: boolean;
    type?: string;
  }): Promise<BaseResponse<Notification[]>> => {
    return get<BaseResponse<Notification[]>>('/api/notifications', { params });
  },

  /**
   * 获取未读通知数量
   * @returns 未读通知数量
   */
  getUnreadCount: async (): Promise<BaseResponse<number>> => {
    return get<BaseResponse<number>>('/api/notifications/unread-count');
  },

  /**
   * 标记单个通知为已读
   * @param notificationId 通知ID
   * @returns 操作结果
   */
  markAsRead: async (notificationId: string): Promise<BaseResponse<void>> => {
    return put<BaseResponse<void>>(`/api/notifications/${notificationId}/read`);
  },

  /**
   * 标记所有通知为已读
   * @returns 操作结果
   */
  markAllAsRead: async (): Promise<BaseResponse<void>> => {
    return put<BaseResponse<void>>('/api/notifications/mark-all-read');
  },

  /**
   * 删除单个通知
   * @param notificationId 通知ID
   * @returns 操作结果
   */
  deleteNotification: async (notificationId: string): Promise<BaseResponse<void>> => {
    return del<BaseResponse<void>>(`/api/notifications/${notificationId}`);
  },

  /**
   * 批量删除通知
   * @param notificationIds 通知ID数组
   * @returns 操作结果
   */
  deleteNotifications: async (notificationIds: string[]): Promise<BaseResponse<void>> => {
    return post<BaseResponse<void>>('/api/notifications/delete-multiple', { notificationIds });
  }
};

export default notificationApi;