/**
 * 消息实体类型
 * 用于表示用户之间的消息，支持文本、图片、视频等多种消息类型
 * 与后端Java实体类保持一致
 */
import { MessageType } from '../enums';

export interface Message {
  /**
   * 消息ID
   */
  id: string;
  
  /**
   * 消息内容
   */
  content: string;
  
  /**
   * 发送者ID
   */
  senderId: string;
  
  /**
   * 接收者ID
   */
  receiverId: string;
  
  /**
   * 对话ID
   */
  conversationId: string;
  
  /**
   * 消息类型
   * 使用与后端一致的MessageType枚举
   */
  type: MessageType;
  
  /**
   * 创建时间
   */
  createdAt: Date;
  
  /**
   * 更新时间
   */
  updatedAt?: Date;
  
  /**
   * 是否已读
   */
  isRead: boolean;
  
  /**
   * 是否已删除（逻辑删除）
   */
  deleted: boolean;
  
  /**
   * 媒体文件URL
   * 与后端mediaUrl字段对应
   */
  mediaUrl?: string;
  
  /**
   * 文件名
   */
  fileName?: string;
  
  /**
   * 文件大小
   */
  fileSize?: number;
  
  // 以下属性用于UI显示
  /**
   * 是否是当前用户发送的
   */
  isSentByMe?: boolean;
  
  /**
   * 消息发送状态
   */
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  
  /**
   * 为了向后兼容保留的消息ID
   */
  messageId?: string;
}