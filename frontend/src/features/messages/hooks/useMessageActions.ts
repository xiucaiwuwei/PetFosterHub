/**
 * 处理消息操作的自定义Hook
 */
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage, markConversationAsRead } from '../slice/messageSlice';
import { SendMessageDto } from '../types/dto';
import { Message } from '../types/entity';

/**
 * 消息操作Hook的返回类型
 */
export interface UseMessageActionsReturn {
  handleSendMessage: (dto: SendMessageDto) => Promise<Message>;
  handleMarkAsRead: (conversationId: string, userId: string) => void;
}

/**
 * 处理消息操作的自定义Hook
 * @returns 消息操作相关的函数
 */
export const useMessageActions = (): UseMessageActionsReturn => {
  const dispatch = useDispatch();

  /**
   * 发送消息
   * @param dto 发送消息的数据传输对象
   * @returns 发送的消息Promise
   */
  const handleSendMessage = useCallback(async (dto: SendMessageDto): Promise<Message> => {
    try {
      const action = await dispatch(sendMessage(dto)).unwrap();
      return action;
    } catch (error) {
      console.error('发送消息失败:', error);
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
    handleMarkAsRead
  };
};