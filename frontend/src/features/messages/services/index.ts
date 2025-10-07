/**
 * 消息服务统一导出文件
 * 提供消息系统相关的所有服务的统一访问入口
 */

// 统一导出所有消息相关的服务
import { MessageSendingService } from './messageSendingService';
import { MessageRetrievalService } from './messageRetrievalService';
import { MessageManagementService } from './messageManagementService';

// 导出各个服务类
export { MessageSendingService };
export { MessageRetrievalService };
export { MessageManagementService };

// 组合所有服务到一个统一的服务接口中
// 保持原有MessageService类的向后兼容性
export class MessageService {
  // 消息发送相关方法
  static sendImageMessage = MessageSendingService.sendImageMessage;
  static sendMessage = MessageSendingService.sendMessage;
  
  // 消息获取相关方法
  static getUserConversations = MessageRetrievalService.getUserConversations;
  static getConversationMessages = MessageRetrievalService.getConversationMessages;
  
  // 消息管理相关方法
  static markConversationAsRead = MessageManagementService.markConversationAsRead;
  static updateConversationLastMessage = MessageManagementService.updateConversationLastMessage;
  static getTotalUnreadCount = MessageManagementService.getTotalUnreadCount;
}