/**
 * 对话实体类型
 */
import { Message } from './Message';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
}

export interface Conversation {
  conversationId: string;
  otherUser: UserInfo;
  lastMessage: Message;
  unreadCount: number;
  createdAt: Date;
}