/**
 * 统计相关的数据传输对象
 */

/**
 * 消息统计信息的响应数据传输对象
 */
export interface MessageStatisticsResponse {
  /**
   * 总未读消息数
   */
  totalUnread: number;
  
  /**
   * 总对话数
   */
  totalConversations: number;
  
  /**
   * 最近未读对话数
   */
  recentUnreadConversations: number;
}

/**
 * 已屏蔽用户列表的响应数据传输对象
 */
export type BlockedUsersResponse = string[];