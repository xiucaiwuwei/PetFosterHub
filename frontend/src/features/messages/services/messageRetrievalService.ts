/**
 * 消息获取服务
 * 处理对话和消息的获取功能
 */
import { getConversations, getMessagesByConversationId } from '../api';
import { Message } from '../types/entity/Message';
import { Conversation } from '../types/entity/Conversation';
import { GetConversationsRequest } from '../types/dto';
import { MessageType } from '../types/enums/MessageType';

/**
 * 消息获取服务类
 */
export class MessageRetrievalService {
  /**
   * 获取用户的对话列表
   * @param userId 用户ID
   * @returns 对话列表Promise
   */
  static async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      // 构造获取对话列表的请求参数
      const requestDto: GetConversationsRequest = {
        userId,
        pageSize: 100,  // 默认获取100条对话
        page: 0,
        sortBy: 'recent',
        operationType: 'QUERY',
        operationContent: '获取用户对话列表'
      };
      
      const response = await getConversations(requestDto);
      const conversations = response.data || [];
      
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
  static async getConversationMessages(dto: any): Promise<Message[]> {
      try {
        const response = await getMessagesByConversationId(dto);
        
        // 从响应对象中提取消息数组
        const messageListResponse = response.data;
        const messages = Array.isArray(messageListResponse?.messages) ? messageListResponse.messages : [];
        
        // 确保日期格式正确并转换为Message实体类型
        const formattedMessages = messages.map((message: any) => ({
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
          mediaUrl: message.mediaUrl || (message.fileUrl ? message.fileUrl : undefined),
          fileName: message.fileName || undefined,
          fileSize: message.fileSize || undefined,
          isSentByMe: message.senderId === dto.userId,
          status: message.status || 'sent'
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
   * 从消息响应对象中获取消息类型
   * @param messageResponse 消息响应对象
   * @returns 消息类型枚举值
   */
  private static getMessageTypeFromResponse(messageResponse: any): MessageType {
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