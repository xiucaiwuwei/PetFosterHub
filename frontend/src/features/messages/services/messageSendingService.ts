/**
 * 消息发送服务
 * 处理各类消息的发送功能
 */
import { sendTextMessage, sendImageMessage as apiSendImageMessage, sendVideoMessage as apiSendVideoMessage, sendAudioMessage as apiSendAudioMessage, sendSystemMessage as apiSendSystemMessage } from '../api';
import { handleFileUpload } from '../../uploads/services/uploadService';
import { FileTypes } from '../../uploads/types/enums/FileTypes';
import { UploadFileDto } from '../../uploads/types/dto/A_index';
import { Message } from '../types/entity/Message';
import { TextMessageRequest, ImageMessageRequest, VideoMessageRequest, AudioMessageRequest, SystemMessageRequest } from '../types/dto';
import { validateMessageContent } from '../utils/validationUtils';
import { MessageType } from '../types/enums/MessageType';

export class MessageSendingService {
  /**
   * 发送视频消息
   * @param request 视频消息请求对象
   * @param file 视频文件
   * @returns 发送的消息Promise
   */
  static async sendVideoMessage(
    request: VideoMessageRequest,
    file: File
  ): Promise<Message> {
    try {
      // 创建上传文件DTO
      const uploadFileDto: UploadFileDto = {
        file,
        fileType: FileTypes.Video
      };
      
      // 使用uploads模块的服务处理文件上传
      const uploadResponse = await handleFileUpload(uploadFileDto);
      
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
   * @param file 音频文件
   * @returns 发送的消息Promise
   */
  static async sendAudioMessage(
    request: AudioMessageRequest,
    file: File
  ): Promise<Message> {
    try {
      // 创建上传文件DTO
      const uploadFileDto: UploadFileDto = {
        file,
        fileType: FileTypes.Audio
      };
      
      // 使用uploads模块的服务处理文件上传
      const uploadResponse = await handleFileUpload(uploadFileDto);
      
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
  /** 上传图片并发送图片消息 */
  static async sendImageMessage(
    request: ImageMessageRequest,
    file: File
  ): Promise<Message> {
    try {
      // 创建上传文件DTO
      const uploadFileDto: UploadFileDto = {
        file,
        fileType: FileTypes.Image
      };
      
      // 使用uploads模块的服务处理文件上传
      // 不传入进度回调，因为在这个服务层不需要直接处理进度UI更新
      const uploadResponse = await handleFileUpload(uploadFileDto);
      
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
}