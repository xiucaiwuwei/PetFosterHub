/**
 * 消息管理服务
 * 处理消息的标记、更新和统计功能
 */
import { markAsRead } from '../api';
import { Message } from '../types/entity/Message';
import { Conversation } from '../types/entity/Conversation';
import { MarkAsReadRequest } from '../types/dto';
import { MessageType } from '../types/enums/MessageType';

/**
 * 消息管理服务类
 */
export class MessageManagementService {
  /**
   * 标记对话中的消息为已读
   * @param conversationId 对话ID
   * @param userId 用户ID
   * @returns 操作结果Promise
   */
  static async markConversationAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      // 构造标记为已读的请求参数
      const requestDto: MarkAsReadRequest = {
        conversationId,
        userId,
        operationType: 'UPDATE',
        operationContent: '标记对话为已读'
      };
      
      const response = await markAsRead(requestDto);
      return response.success === true;
    } catch (error) {
      console.error('标记消息为已读失败:', error);
      throw new Error('标记消息为已读失败，请重试');
    }
  }

  /**
   * 更新对话列表中的最后一条消息
   * @param conversations 当前对话列表
   * @param conversationId 对话ID
   * @param newMessage 新消息
   * @returns 更新后的对话列表
   */
  static updateConversationLastMessage(
    conversations: Conversation[],
    conversationId: string,
    newMessage: Message
  ): Conversation[] {
    // 确保新消息中的createdAt是Date对象
    const formattedNewMessage: Message = {
      ...newMessage,
      createdAt: newMessage.createdAt instanceof Date ? newMessage.createdAt : 
                 typeof newMessage.createdAt === 'string' ? new Date(newMessage.createdAt) : new Date()
    };
    
    // 更新对话列表中的最后一条消息
    const updatedConversations = conversations.map(conv => 
      conv.conversationId === conversationId 
        ? { ...conv, lastMessage: formattedNewMessage, unreadCount: 0 } 
        : conv
    );

    // 将当前对话移到列表顶部
    const sortedConversations = [
      updatedConversations.find(conv => conv.conversationId === conversationId),
      ...updatedConversations.filter(conv => conv.conversationId !== conversationId)
    ].filter(Boolean) as Conversation[];

    return sortedConversations;
  }

  /**
   * 获取未读消息总数
   * @param conversations 对话列表
   * @returns 未读消息总数
   */
  static getTotalUnreadCount(conversations: Conversation[]): number {
    return conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);
  }
}