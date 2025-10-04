/**
 * 消息业务逻辑服务
 */
import { getConversations, getMessagesByConversationId, sendMessage as apiSendMessage, markAsRead, uploadImage, MessageResponse, ConversationListItemResponse, MessageListResponse } from '../api/messageApi';
import { Message } from '../types/entity/Message';
import { Conversation } from '../types/entity/Conversation';
import { GetMessagesDto, SendMessageDto } from '../types/dto';
import { validateMessageContent } from '../utils/validationUtils';
import { MessageType } from '../types/enums/MessageType';

/**
 * 消息服务类
 */
export class MessageService {
  /**
 * 上传图片并发送图片消息
 * @param conversationId 对话ID
 * @param senderId 发送者ID
 * @param receiverId 接收者ID
 * @param file 图片文件
 * @param caption 图片说明文字
 * @param width 图片宽度
 * @param height 图片高度
 * @returns 发送的消息Promise
 */
  static async sendImageMessage(
    conversationId: string,
    senderId: string,
    receiverId: string,
    file: File,
    caption?: string,
    width?: number,
    height?: number
  ): Promise<Message> {
    try {
      // 上传图片文件
      const fileUrl = await uploadImage(file);
      
      // 创建图片消息
      const message: Message = {
        id: `m${Date.now()}`,
        conversationId,
        senderId,
        receiverId,
        content: caption || '',
        type: MessageType.IMAGE,
        createdAt: new Date(),
        isRead: false,
        fileUrl,
        isSentByMe: true,
        status: 'sending'
      };
      
      return message;
    } catch (error) {
      console.error('发送图片消息失败:', error);
      throw new Error('发送图片失败，请重试');
    }
  }

  /**
   * 获取用户的对话列表
   * @param userId 用户ID
   * @returns 对话列表Promise
   */
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      const conversations = await getConversations(userId);
      
      // 确保日期格式正确
      const formattedConversations = conversations.map(conversation => ({
        conversationId: conversation.id,
        otherUser: {
          id: conversation.participants.find(p => p.id !== userId)?.id || '',
          name: conversation.participants.find(p => p.id !== userId)?.name || '',
          avatar: conversation.participants.find(p => p.id !== userId)?.avatar || '',
          role: conversation.participants.find(p => p.id !== userId)?.role
        },
        lastMessage: conversation.lastMessage ? {
          id: conversation.lastMessage.id,
          content: conversation.lastMessage.content || '',
          senderId: conversation.lastMessage.senderId,
          receiverId: conversation.lastMessage.receiverId,
          conversationId: conversation.lastMessage.conversationId,
          type: conversation.lastMessage.type || MessageType.TEXT,
          createdAt: conversation.lastMessage.createdAt instanceof Date ? conversation.lastMessage.createdAt : 
                     typeof conversation.lastMessage.createdAt === 'string' ? new Date(conversation.lastMessage.createdAt) : new Date(),
          isRead: conversation.lastMessage.isRead,
          deleted: false,
          mediaUrl: conversation.lastMessage.fileUrl || undefined,
          fileName: conversation.lastMessage.fileName || undefined,
          fileSize: conversation.lastMessage.fileSize || undefined,
          isSentByMe: conversation.lastMessage.senderId === userId,
          status: conversation.lastMessage.status
        } : {
          id: '',
          content: '',
          senderId: '',
          receiverId: '',
          conversationId: conversation.id,
          type: MessageType.TEXT,
          createdAt: new Date(),
          isRead: true,
          deleted: false
        },
        unreadCount: conversation.unreadCount,
        createdAt: conversation.updatedAt instanceof Date ? conversation.updatedAt : 
                  typeof conversation.updatedAt === 'string' ? new Date(conversation.updatedAt) : new Date()
      }));
      
      // 按最后消息时间排序，最新的对话在前面
      return formattedConversations.sort((a, b) => {
        // 将ISO字符串转换为Date对象后再获取时间戳进行排序
        const aTime = new Date(a.lastMessage.createdAt).getTime();
        const bTime = new Date(b.lastMessage.createdAt).getTime();
        return bTime - aTime;
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
      const messageListResponse = await getMessagesByConversationId(dto);
      
      // 从响应对象中提取消息数组
      const messages = messageListResponse.messages || [];
      
      // 确保日期格式正确并转换为Message实体类型
      const formattedMessages = messages.map((message: MessageResponse) => ({
        id: message.id,
        content: message.content || '',
        senderId: message.senderId,
        receiverId: message.receiverId,
        conversationId: message.conversationId,
        type: this.getMessageTypeFromResponse(message),
        createdAt: message.createdAt instanceof Date ? message.createdAt : 
                   typeof message.createdAt === 'string' ? new Date(message.createdAt) : new Date(),
        updatedAt: message.updatedAt instanceof Date ? message.updatedAt : 
                   typeof message.updatedAt === 'string' ? new Date(message.updatedAt) : undefined,
        isRead: message.isRead,
        deleted: false,
        mediaUrl: 'fileUrl' in message ? message.fileUrl : undefined,
        fileName: 'fileName' in message ? message.fileName : undefined,
        fileSize: 'fileSize' in message ? message.fileSize : undefined,
        status: message.status
      }));
      
      // 按时间排序，最早的消息在前面
      return formattedMessages.sort((a, b) => {
        // 将ISO字符串转换为Date对象后再获取时间戳进行排序
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return aTime - bTime;
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
      const messageResponse = await apiSendMessage(dto);
      
      // 将MessageResponse转换为Message实体类型
      const formattedMessage: Message = {
        id: messageResponse.id,
        content: messageResponse.content || '',
        senderId: messageResponse.senderId,
        receiverId: messageResponse.receiverId,
        conversationId: messageResponse.conversationId,
        type: MessageType.TEXT,
        createdAt: messageResponse.createdAt instanceof Date ? messageResponse.createdAt : 
                   typeof messageResponse.createdAt === 'string' ? new Date(messageResponse.createdAt) : new Date(),
        updatedAt: messageResponse.updatedAt instanceof Date ? messageResponse.updatedAt : 
                   typeof messageResponse.updatedAt === 'string' ? new Date(messageResponse.updatedAt) : undefined,
        isRead: messageResponse.isRead,
        deleted: false,
        status: messageResponse.status
      };
      
      return formattedMessage;
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
  
  /**
   * 从消息响应对象中获取消息类型
   * @param messageResponse 消息响应对象
   * @returns 消息类型枚举值
   */
  private static getMessageTypeFromResponse(messageResponse: MessageResponse): MessageType {
    if ('fileUrl' in messageResponse) {
      if ('width' in messageResponse && 'height' in messageResponse) {
        return 'duration' in messageResponse ? MessageType.VIDEO : MessageType.IMAGE;
      } else if ('duration' in messageResponse) {
        return MessageType.AUDIO;
      } else if ('fileName' in messageResponse) {
        return MessageType.FILE;
      }
    } else if ('latitude' in messageResponse && 'longitude' in messageResponse) {
      return MessageType.LOCATION;
    } else if ('contactUserId' in messageResponse) {
      return MessageType.CONTACT;
    } else if ('stickerUrl' in messageResponse) {
      return MessageType.STICKER;
    }
    return MessageType.TEXT;
  }
}