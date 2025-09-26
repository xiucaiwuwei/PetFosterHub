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
}