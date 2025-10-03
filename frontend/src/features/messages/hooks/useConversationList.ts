/**
 * 处理对话列表的自定义Hook
 */
import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { fetchConversations, setSelectedConversation } from '../slice/messageSlice';
import { Conversation } from '../types/entity/Conversation';
import { MessageService } from '../services/messageService';

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
  }, [loadConversations]);

  return {
    conversations,
    selectedConversation,
    isLoading,
    totalUnreadCount,
    handleSelectConversation,
    refreshConversations
  };
};