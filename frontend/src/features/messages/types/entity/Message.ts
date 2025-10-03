/**
 * 消息实体类型
 */
import { MessageType } from '../enums';

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  type: MessageType;
  createdAt: Date;
  isRead: boolean;
  // 以下属性用于UI显示
  isSentByMe?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  messageId?: string; // 为了向后兼容保留messageId
}