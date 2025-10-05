/**
 * 消息统计相关的API调用函数
 */
// 导入axios库，用于发送HTTP请求
import { get } from '@/lib/api';

/**
 * 获取消息统计信息
 * @param userId 用户ID
 */
export const getMessageStatistics = async (userId: string): Promise<{
  totalUnread: number;
  totalConversations: number;
  recentUnreadConversations: number;
}> => {
  return get<{
    totalUnread: number;
    totalConversations: number;
    recentUnreadConversations: number;
  }>(`/api/messages/statistics/${userId}`);
};

/**
 * 获取已屏蔽用户列表
 * @param userId 用户ID
 */
export const getBlockedUsers = async (userId: string): Promise<string[]> => {
  return get<string[]>(`/api/messages/blocked/${userId}`);
};

/**
 * 检查是否已屏蔽用户
 * @param userId 当前用户ID
 * @param targetUserId 目标用户ID
 */
export const isUserBlocked = async (userId: string, targetUserId: string): Promise<boolean> => {
  return get<boolean>(`/api/messages/blocked/check`, {
    params: {
      userId,
      targetUserId
    }
  });
};