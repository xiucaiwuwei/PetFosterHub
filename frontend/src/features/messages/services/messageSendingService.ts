/**
 * 消息发送服务
 * 处理各类消息的发送功能
 */
import { sendTextMessage, sendImageMessage as apiSendImageMessage, sendVideoMessage as apiSendVideoMessage, sendAudioMessage as apiSendAudioMessage, sendSystemMessage as apiSendSystemMessage } from '../api';
import { UploadResponse } from '../../uploads/types/dto/UploadResponse';
import { Message } from '../types/entity/Message';
import { TextMessageRequest, ImageMessageRequest, VideoMessageRequest, AudioMessageRequest, SystemMessageRequest } from '../types/dto';
import { validateMessageContent } from '../utils/validationUtils';
import { MessageType } from '../types/enums/MessageType';

export class MessageSendingService {
  /**
   * 发送视频消息
   * @param request 视频消息请求对象
   * @param uploadResponse 已上传的文件信息
   * @returns 发送的消息Promise
   */
  static async sendVideoMessage(
    request: VideoMessageRequest,
    uploadResponse: UploadResponse
  ): Promise<Message> {
    try {
      // 创建视频消息发送DTO，添加BaseRequest所需的字段
      const dto: VideoMessageRequest = {
        ...request,
        fileUrl: uploadResponse.url,
        operationType: 'CREATE',
        operationContent: '发送视频消息'
      };
      
      // 发送视频消息到服务器
      const response = await apiSendVideoMessage(dto);
      
      // 返回格式化后的消息
      return {
        id: response.data.id,
        conversationId: request.conversationId,
        senderId: request.senderId,
        receiverId: request.receiverId,
        content: request.caption || '',
        type: MessageType.Video,
        createdAt: new Date(),
        isRead: false,
        deleted: false,
        mediaUrl: uploadResponse.url,
        fileName: uploadResponse.fileName,
        fileSize: uploadResponse.fileSize,
        isSentByMe: true,
        status: 'sent'
      };
    } catch (error) {
      console.error('发送视频消息失败:', error);
      throw new Error('发送视频失败，请重试');
    }
  }

  /**
   * 发送音频消息
   * @param request 音频消息请求对象
   * @param uploadResponse 已上传的文件信息
   * @returns 发送的消息Promise
   */
  static async sendAudioMessage(
    request: AudioMessageRequest,
    uploadResponse: UploadResponse
  ): Promise<Message> {
    try {
      // 创建音频消息发送DTO，添加BaseRequest所需的字段
      const dto: AudioMessageRequest = {
        ...request,
        fileUrl: uploadResponse.url,
        operationType: 'CREATE',
        operationContent: '发送音频消息'
      };
      
      // 发送音频消息到服务器
      const response = await apiSendAudioMessage(dto);
      
      // 返回格式化后的消息
      return {
        id: response.data.id,
        conversationId: request.conversationId,
        senderId: request.senderId,
        receiverId: request.receiverId,
        content: request.caption || '',
        type: MessageType.Audio,
        createdAt: new Date(),
        isRead: false,
        deleted: false,
        mediaUrl: uploadResponse.url,
        fileName: uploadResponse.fileName,
        fileSize: uploadResponse.fileSize,
        isSentByMe: true,
        status: 'sent'
      };
    } catch (error) {
      console.error('发送音频消息失败:', error);
      throw new Error('发送音频失败，请重试');
    }
  }

  /**
   * 发送系统消息
   * @param request 系统消息请求对象
   * @returns 发送的消息Promise
   */
  static async sendSystemMessage(
    request: SystemMessageRequest
  ): Promise<Message> {
    try {
      // 发送系统消息到服务器
      const response = await apiSendSystemMessage(request);
      
      // 返回格式化后的消息
      return {
        id: response.data.id,
        conversationId: request.conversationId,
        senderId: 'system', // 系统消息的发送者ID为'system'
        receiverId: request.receiverId,
        content: request.content,
        type: MessageType.System,
        createdAt: new Date(),
        isRead: false,
        deleted: false,
        isSentByMe: false,
        status: 'sent'
      };
    } catch (error) {
      console.error('发送系统消息失败:', error);
      throw new Error('发送系统消息失败，请重试');
    }
  }
  /** 发送图片消息（使用已上传的图片信息） */
  static async sendImageMessage(
    request: ImageMessageRequest,
    uploadResponse: UploadResponse
  ): Promise<Message> {
    try {
      // 创建图片消息发送DTO，添加BaseRequest所需的字段
      const dto: ImageMessageRequest = {
        ...request,
        fileUrl: uploadResponse.url,
        operationType: 'CREATE',
        operationContent: '发送图片消息'
      };
      
      // 发送图片消息到服务器
      const response = await apiSendImageMessage(dto);
      
      // 返回格式化后的消息
      return {
        id: response.data.id,
        conversationId: request.conversationId,
        senderId: request.senderId,
        receiverId: request.receiverId,
        content: request.caption || '',
        type: MessageType.Image,
        createdAt: new Date(),
        isRead: false,
        deleted: false,
        mediaUrl: uploadResponse.url,
        fileName: uploadResponse.fileName,
        fileSize: uploadResponse.fileSize,
        isSentByMe: true,
        status: 'sent'
      };
    } catch (error) {
      console.error('发送图片消息失败:', error);
      throw new Error('发送图片失败，请重试');
    }
  }

  /**
   * 发送文本消息
   * @param dto 发送消息的数据传输对象
   * @returns 发送的消息Promise
   */
  static async sendMessage(dto: TextMessageRequest): Promise<Message> {
    // 验证消息内容
    const validationResult = validateMessageContent(dto.content);
    if (!validationResult.isValid) {
      throw new Error(validationResult.error || '消息内容无效');
    }

    try {
      // 添加BaseRequest所需的字段
      const requestDto: TextMessageRequest = {
        ...dto,
        operationType: 'CREATE',
        operationContent: '发送文本消息'
      };
      
      const response = await sendTextMessage(requestDto);
      
      // 将响应转换为Message实体类型
      const messageResponse = response.data;
      const formattedMessage: Message = {
        id: messageResponse.id,
        content: messageResponse.content || '',
        senderId: messageResponse.senderId,
        receiverId: messageResponse.receiverId,
        conversationId: messageResponse.conversationId,
        type: MessageType.Text,
        createdAt: typeof messageResponse.createdAt === 'string' ? new Date(messageResponse.createdAt) : 
                   (messageResponse.createdAt && typeof messageResponse.createdAt === 'object' && (messageResponse.createdAt as any) instanceof Date ? messageResponse.createdAt : new Date()),
        ...(messageResponse.updatedAt ? {
          updatedAt: typeof messageResponse.updatedAt === 'string' ? new Date(messageResponse.updatedAt) : 
                    (messageResponse.updatedAt && typeof messageResponse.updatedAt === 'object' && (messageResponse.updatedAt as any) instanceof Date ? messageResponse.updatedAt : new Date())
        } : {}),
        isRead: messageResponse.isRead,
        deleted: false,
        ...(messageResponse.status && ['sending', 'sent', 'delivered', 'read'].includes(messageResponse.status as any) ? 
             { status: messageResponse.status as 'sending' | 'sent' | 'delivered' | 'read' } : {})
      };
      
      return formattedMessage;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw new Error('发送消息失败，请重试');
    }
  }
}