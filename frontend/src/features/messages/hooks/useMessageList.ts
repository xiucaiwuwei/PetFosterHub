/**
 * 处理消息列表的自定义Hook
 * 集成WebSocket实时通信功能
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchMessages, markConversationAsRead, addNewMessage } from '../slice/messageSlice';
import { Message } from '../types/entity/Message';
import { useWebSocket } from '@/webSocket/hooks/useWebSocket';
import { ConnectionStatus } from '@/webSocket/types/common';

/**
 * 消息列表Hook的返回类型
 */
export interface UseMessageListReturn {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  refreshMessages: () => void;
  // WebSocket相关状态和方法
  isWsConnected: boolean;
  wsConnecting: boolean;
  typingUsers: Map<string, boolean>;
  currentUserStatus: Map<string, 'online' | 'offline' | 'away'>;
  sendReadReceipt: (messageIds: string[]) => void;
  sendTypingStatus: (isTyping: boolean) => void;
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
  const dispatch = useAppDispatch();
  const { messages, isLoading } = useAppSelector(
    (state) => state.message
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  /**
   * 处理收到的新消息
   */
  const handleNewMessage = useCallback((message: Message) => {
    // 只有当消息属于当前选中的对话时才添加到消息列表
    if (message.conversationId === conversationId) {
      dispatch(addNewMessage(message));
      // 自动滚动到底部
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [dispatch, conversationId]);

  // 使用WebSocket Hook
  const {
    isConnected,
    status,
    currentUserStatus,
    typingUsers,
    connect: wsConnect,
    disconnect: wsDisconnect,
    sendReadReceipt: wsSendReadReceipt,
    sendTypingStatus: wsSendTypingStatus
  } = useWebSocket(
    currentUserId,
    handleNewMessage,
    undefined // 暂时不需要处理对话更新
  );

  // 计算连接中状态
  const wsConnecting = status === ConnectionStatus.CONNECTING;

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

  /**
   * 发送消息已读确认
   */
  const sendReadReceipt = useCallback((messageIds: string[]) => {
    if (conversationId) {
      wsSendReadReceipt(conversationId, messageIds);
    }
  }, [conversationId, wsSendReadReceipt]);

  /**
   * 发送正在输入状态
   */
  const sendTypingStatus = useCallback((isTyping: boolean) => {
    if (conversationId) {
      wsSendTypingStatus(conversationId, isTyping);
    }
  }, [conversationId, wsSendTypingStatus]);

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

  // 不再在这里连接WebSocket，使用useConversationList中建立的全局连接
  // 只处理断开连接的情况
  useEffect(() => {
    // 组件卸载时清理资源，但不断开全局连接
    return () => {
      // 清理资源但不断开全局WebSocket连接
    };
  }, []);

  return {
    messages,
    isLoading,
    messagesEndRef,
    refreshMessages,
    // WebSocket相关状态和方法
    isWsConnected: isConnected,
    wsConnecting,
    typingUsers,
    currentUserStatus,
    sendReadReceipt,
    sendTypingStatus
  };
};