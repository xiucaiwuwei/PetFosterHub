/**
 * 处理消息表单的自定义Hook
 */
import { useState, useCallback, useEffect } from 'react';
import { useMessageActions } from './useMessageActions';
import { validateMessageContent } from '../utils/validationUtils';
import { TextMessageRequest } from '../types/dto';
import { Message } from '../types/entity/Message';
import { MessageType } from '../types/enums/MessageType';
import { useWebSocket } from '@/webSocket/hooks/useWebSocket';

/**
 * 消息表单Hook的返回类型
 */
export interface UseMessageFormReturn {
  messageContent: string;
  error: string | null;
  isSubmitting: boolean;
  handleContentChange: (content: string) => void;
  handleSubmit: () => Promise<Message | null>;
  handleSendImage: (file: File, caption?: string) => Promise<void>;
  resetForm: () => void;
  // WebSocket相关方法
  handleTypingStatusChange: (isTyping: boolean) => void;
}

/**
 * 处理消息表单的自定义Hook
 * @param conversationId 对话ID
 * @param receiverId 接收者ID
 * @param currentUserId 当前用户ID
 * @returns 消息表单相关的状态和操作函数
 */
export const useMessageForm = (
  conversationId: string | null,
  receiverId: string | null,
  currentUserId: string | null
): UseMessageFormReturn => {
  const [messageContent, setMessageContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { handleSendMessage, handleSendImageMessage } = useMessageActions();
  
  // 使用WebSocket Hook仅用于发送输入状态
  const { sendTypingStatus: wsSendTypingStatus } = useWebSocket(currentUserId || '');

  /**
   * 处理消息内容变化
   * @param content 消息内容
   */
  const handleContentChange = useCallback((content: string) => {
    setMessageContent(content);
    setError(null); // 清除错误
    
    // 触发正在输入状态
    if (conversationId && content.trim().length > 0) {
      handleTypingStatusChange(true);
    } else if (conversationId && content.trim().length === 0) {
      handleTypingStatusChange(false);
    }
  }, [conversationId]);

  /**
   * 处理正在输入状态变化
   */
  const handleTypingStatusChange = useCallback((typing: boolean) => {
    if (!conversationId) return;

    // 清除之前的定时器
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }

    if (typing && !isTyping) {
      setIsTyping(true);
      wsSendTypingStatus(conversationId, true);
    } else if (!typing && isTyping) {
      setIsTyping(false);
      wsSendTypingStatus(conversationId, false);
    }

    // 设置一个定时器，5秒后自动将状态设为未输入
    if (typing) {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        wsSendTypingStatus(conversationId, false);
      }, 5000);
      setTypingTimeout(timeout);
    }
  }, [conversationId, isTyping, typingTimeout, wsSendTypingStatus]);

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
      const dto: TextMessageRequest = {
        conversationId,
        senderId: currentUserId || '',
        receiverId,
        content: messageContent.trim(),
        operationType: 'send_message',
        operationContent: 'text_message'
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
    // 重置输入状态
    if (isTyping && conversationId) {
      handleTypingStatusChange(false);
    }
  }, [isTyping, conversationId, handleTypingStatusChange]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      // 确保组件卸载时将输入状态设为false
      if (isTyping && conversationId) {
        wsSendTypingStatus(conversationId, false);
      }
    };
  }, [typingTimeout, isTyping, conversationId, wsSendTypingStatus]);

  /**
   * 发送图片消息
   */
  const handleSendImage = useCallback(async (
    file: File,
    caption?: string
  ): Promise<void> => {
    if (!conversationId || !receiverId) {
      setError('请选择一个对话');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 当前用户ID固定为'u4'，实际应用中应该从认证状态获取
      handleSendImageMessage(conversationId, 'u4', receiverId, file, caption);
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送图片失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  }, [conversationId, receiverId, handleSendImageMessage]);

  return {
    messageContent,
    error,
    isSubmitting,
    handleContentChange,
    handleSubmit,
    handleSendImage,
    resetForm,
    handleTypingStatusChange
  };
};