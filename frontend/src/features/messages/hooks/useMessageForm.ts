/**
 * 处理消息表单的自定义Hook
 */
import { useState, useCallback } from 'react';
import { useMessageActions } from './useMessageActions';
import { validateMessageContent } from '../utils/validationUtils';
import { SendMessageDto } from '../types/dto';
import { Message } from '../types/entity';

/**
 * 消息表单Hook的返回类型
 */
export interface UseMessageFormReturn {
  messageContent: string;
  error: string | null;
  isSubmitting: boolean;
  handleContentChange: (content: string) => void;
  handleSubmit: () => Promise<Message | null>;
  resetForm: () => void;
}

/**
 * 处理消息表单的自定义Hook
 * @param conversationId 对话ID
 * @param receiverId 接收者ID
 * @returns 消息表单相关的状态和操作函数
 */
export const useMessageForm = (
  conversationId: string | null,
  receiverId: string | null
): UseMessageFormReturn => {
  const [messageContent, setMessageContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { handleSendMessage } = useMessageActions();

  /**
   * 处理消息内容变化
   * @param content 消息内容
   */
  const handleContentChange = useCallback((content: string) => {
    setMessageContent(content);
    setError(null); // 清除错误
  }, []);

  /**
   * 处理表单提交
   * @returns 发送的消息Promise，如失败则返回null
   */
  const handleSubmit = useCallback(async (): Promise<Message | null> => {
    if (!conversationId || !receiverId) {
      setError('请选择一个对话');
      return null;
    }

    // 验证消息内容
    const validationResult = validateMessageContent(messageContent);
    if (!validationResult.isValid) {
      setError(validationResult.error || '消息内容无效');
      return null;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const dto: SendMessageDto = {
        conversationId,
        receiverId,
        content: messageContent.trim()
      };

      const message = await handleSendMessage(dto);
      resetForm();
      return message;
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败，请重试');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [conversationId, receiverId, messageContent, handleSendMessage]);

  /**
   * 重置表单
   */
  const resetForm = useCallback(() => {
    setMessageContent('');
    setError(null);
  }, []);

  return {
    messageContent,
    error,
    isSubmitting,
    handleContentChange,
    handleSubmit,
    resetForm
  };
};