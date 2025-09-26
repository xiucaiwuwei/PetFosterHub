/**
 * 发送消息的数据传输对象
 */
import { MessageType } from '../enums';

export interface SendMessageDto {
  conversationId: string;
  receiverId: string;
  content: string;
  type?: MessageType;
}