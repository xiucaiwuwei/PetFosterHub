/**
 * 处理消息列表的自定义Hook
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { fetchMessages, markConversationAsRead, MessageState } from '../slice/messageSlice';
import { Message } from '../types/entity';

/**
 * 消息列表Hook的返回类型
 */
export interface UseMessageListReturn {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  refreshMessages: () => void;
}

/**
 * 处理消息列表的自定义Hook
 * @param conversationId 对话ID
 * @param currentUserId 当前用户ID
 * @returns 消息列表相关的状态和操作函数
 */
export const useMessageList = (
  conversationId: string | null,
  currentUserId: string
): UseMessageListReturn => {
  const dispatch = useDispatch();
  const { messages, isLoading } = useSelector<RootState, MessageState>(
    (state) => state.message
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * 加载消息列表
   */
  const loadMessages = useCallback(() => {
    if (conversationId) {
      dispatch(fetchMessages({ conversationId }));
      // 标记为已读
      dispatch(markConversationAsRead({ conversationId, userId: currentUserId }));
    }
  }, [dispatch, conversationId, currentUserId]);

  /**
   * 刷新消息列表
   */
  const refreshMessages = useCallback(() => {
    loadMessages();
  }, [loadMessages]);

  /**
   * 自动滚动到最新消息
   */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 当选择的对话或消息列表变化时，加载消息并滚动到底部
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      // 使用setTimeout确保DOM更新后再滚动
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages.length, scrollToBottom]);

  return {
    messages,
    isLoading,
    messagesEndRef,
    refreshMessages
  };
};