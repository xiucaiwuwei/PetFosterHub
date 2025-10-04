/**
 * 对话实体类型
 */
import { Message } from './Message';
import { UserRole } from '../../../auth/types/enums/UserRole';

export interface UserInfo {
  id: string;
  name: string;
  avatar: string;
  // 用户角色 - 新增字段
  role?: UserRole;
}

export interface Conversation {
  conversationId: string;
  otherUser: UserInfo;
  lastMessage: Message;
  unreadCount: number;
  createdAt: Date;
}