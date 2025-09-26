/**
 * 消息业务逻辑服务
 */
import { getConversations, getMessagesByConversationId, sendMessage as apiSendMessage, markAsRead } from '../api/messageApi';
import { Message, Conversation } from '../types/entity';
import { GetMessagesDto, SendMessageDto } from '../types/dto';
import { validateMessageContent } from '../utils/validationUtils';

/**
 * 消息服务类
 */
export class MessageService {
  /**
   * 获取用户的对话列表
   * @param userId 用户ID
   * @returns 对话列表Promise
   */
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const conversations = await getConversations(userId);
      // 按最后消息时间排序，最新的对话在前面
      return conversations.sort((a, b) => {
        return new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime();
      });
    } catch (error) {
      console.error('获取对话列表失败:', error);
      throw new Error('获取对话列表失败，请重试');
    }
  }

  /**
   * 获取指定对话的消息列表
   * @param dto 获取消息列表的数据传输对象
   * @returns 消息列表Promise
   */
  static async getConversationMessages(dto: GetMessagesDto): Promise<Message[]> {
    try {
      const messages = await getMessagesByConversationId(dto);
      // 按时间排序，最早的消息在前面
      return messages.sort((a, b) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    } catch (error) {
      console.error('获取消息列表失败:', error);
      throw new Error('获取消息列表失败，请重试');
    }
  }

  /**
   * 发送消息
   * @param dto 发送消息的数据传输对象
   * @returns 发送的消息Promise
   */
  static async sendMessage(dto: SendMessageDto): Promise<Message> {
    // 验证消息内容
    const validationResult = validateMessageContent(dto.content);
    if (!validationResult.isValid) {
      throw new Error(validationResult.error || '消息内容无效');
    }

    try {
      const message = await apiSendMessage(dto);
      return message;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw new Error('发送消息失败，请重试');
    }
  }

  /**
   * 标记对话中的消息为已读
   * @param conversationId 对话ID
   * @param userId 用户ID
   * @returns 操作结果Promise
   */
  static async markConversationAsRead(conversationId: string, userId: string): Promise<boolean> {
    try {
      return await markAsRead(conversationId, userId);
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
    // 更新对话列表中的最后一条消息
    const updatedConversations = conversations.map(conv => 
      conv.conversationId === conversationId 
        ? { ...conv, lastMessage: newMessage, unreadCount: 0 } 
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