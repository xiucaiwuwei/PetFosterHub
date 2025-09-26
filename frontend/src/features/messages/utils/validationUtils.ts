/**
 * 消息验证和格式化工具函数
 */

/**
 * 格式化日期显示
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date): string => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  } else if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * 验证消息内容
 * @param content 消息内容
 * @returns 验证结果对象，包含是否有效和错误消息
 */
export const validateMessageContent = (content: string): { isValid: boolean; error?: string } => {
  if (!content || content.trim().length === 0) {
    return { isValid: false, error: '消息内容不能为空' };
  }
  
  if (content.length > 1000) {
    return { isValid: false, error: '消息内容不能超过1000个字符' };
  }
  
  return { isValid: true };
};

/**
 * 生成唯一消息ID
 * @returns 唯一的消息ID字符串
 */
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 生成唯一对话ID
 * @param userId1 用户ID1
 * @param userId2 用户ID2
 * @returns 唯一的对话ID字符串
 */
export const generateConversationId = (userId1: string, userId2: string): string => {
  // 确保对话ID的一致性，无论用户ID的顺序如何
  const sortedIds = [userId1, userId2].sort();
  return `conv_${sortedIds[0]}_${sortedIds[1]}`;
};