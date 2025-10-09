/**
 * 处理消息操作的自定义Hook
 */
import { useCallback } from 'react';
import { useAppDispatch } from '@/app/store/store';
import { sendMessage, markConversationAsRead, sendImageMessage } from '../slice/messageSlice';
import { TextMessageRequest, ImageMessageRequest } from '../types/dto/sendMessage/MessageRequest';
import { Message } from '../types/entity/Message';
import { uploadImage } from '../../uploads/api/uploadApi';

/**
 * 消息操作Hook的返回类型
 */
export interface UseMessageActionsReturn {
  handleSendMessage: (dto: TextMessageRequest) => Promise<Message>;
  handleMarkAsRead: (conversationId: string, userId: string) => void;
  handleSendImageMessage: (conversationId: string, senderId: string, receiverId: string, file: File, caption?: string) => void;
}

/**
 * 处理消息操作的自定义Hook
 * @returns 消息操作相关的函数
 */
export const useMessageActions = (): UseMessageActionsReturn => {
  const dispatch = useAppDispatch();

  /**
   * 发送消息
   * @param dto 发送消息的数据传输对象
   * @returns 发送的消息Promise
   */
  const handleSendMessage = useCallback(async (dto: TextMessageRequest): Promise<Message> => {
    try {
      const action = await dispatch(sendMessage(dto)).unwrap();
      return action;
    } catch (error) {
      console.error('发送消息失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 发送图片消息
   * @param conversationId 对话ID
   * @param senderId 发送者ID
   * @param receiverId 接收者ID
   * @param file 图片文件
   * @param caption 图片说明（可选）
   */
  const handleSendImageMessage = useCallback(async (
    conversationId: string,
    senderId: string,
    receiverId: string,
    file: File,
    caption?: string
  ) => {
    try {
      // 1. 先调用uploads模块上传图片
      const uploadResponse = await uploadImage({
        file,
        fileType: file.type,
        operationType: 'CREATE',
        operationContent: '发送图片消息'
      });
      
      // 2. 构建ImageMessageRequest对象
      const request: ImageMessageRequest = {
        conversationId,
        senderId,
        receiverId,
        fileUrl: uploadResponse.data.url,
        operationType: 'CREATE',
        operationContent: '发送图片消息',
        ...(caption !== undefined && { caption })
      };
      
      // 3. 发送消息
      dispatch(sendImageMessage({
        request,
        uploadResponse: uploadResponse.data
      }));
    } catch (error) {
      console.error('发送图片消息失败:', error);
      throw error;
    }
  }, [dispatch]);

  /**
   * 标记消息为已读
   * @param conversationId 对话ID
   * @param userId 用户ID
   */
  const handleMarkAsRead = useCallback((conversationId: string, userId: string) => {
    dispatch(markConversationAsRead({ conversationId, userId }));
  }, [dispatch]);

  return {
    handleSendMessage,
    handleMarkAsRead,
    handleSendImageMessage
  };
};