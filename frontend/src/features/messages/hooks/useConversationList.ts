/**
 * 处理对话列表的自定义Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchConversations, setSelectedConversation } from '../slice/messageSlice';
import { Conversation } from '../types/entity/Conversation';
import { MessageService } from '../services/messageService';
import { useWebSocket } from './useWebSocket';

/**
 * 对话列表Hook的返回类型
 */
export interface UseConversationListReturn {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  totalUnreadCount: number;
  handleSelectConversation: (conversation: Conversation) => void;
  refreshConversations: () => void;
  // WebSocket相关状态
  isWsConnected: boolean;
  currentUserStatus: Map<string, 'online' | 'offline' | 'away'>;
}

/**
 * 处理对话列表的自定义Hook
 * @param userId 当前用户ID
 * @returns 对话列表相关的状态和操作函数
 */
export const useConversationList = (userId: string): UseConversationListReturn => {
  const dispatch = useAppDispatch();
  const { conversations, selectedConversation, isLoading } = useAppSelector(
    (state) => state.message
  );
  
  // 计算未读消息总数
  const totalUnreadCount = MessageService.getTotalUnreadCount(conversations);
  
  /**
   * 处理对话更新
   */
  const handleConversationUpdate = useCallback((conversation: Conversation) => {
    // 这里可以实现对话更新的逻辑
    // 例如，更新对话列表中的特定对话
    console.log('Conversation updated:', conversation);
  }, []);
  
  // 使用WebSocket Hook
  const { 
    isConnected, 
    currentUserStatus, 
    connect: wsConnect, 
    disconnect: wsDisconnect 
  } = useWebSocket(
    userId,
    undefined, // 暂时不需要处理新消息
    handleConversationUpdate
  );

  /**
   * 加载对话列表
   */
  const loadConversations = useCallback(() => {
    return dispatch(fetchConversations(userId));
  }, [dispatch, userId]);

  /**
   * 刷新对话列表
   */
  const refreshConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);

  /**
   * 选择对话
   * @param conversation 要选择的对话
   */
  const handleSelectConversation = useCallback((conversation: Conversation) => {
    dispatch(setSelectedConversation(conversation));
  }, [dispatch]);

  // 初始加载对话列表
  useEffect(() => {
    loadConversations();
    // 连接WebSocket
    wsConnect();

    // 组件卸载时断开连接
    return () => {
      wsDisconnect();
    };
  }, [loadConversations, wsConnect, wsDisconnect]);

  return {
    conversations,
    selectedConversation,
    isLoading,
    totalUnreadCount,
    handleSelectConversation,
    refreshConversations,
    // WebSocket相关状态
    isWsConnected: isConnected,
    currentUserStatus
  };
};