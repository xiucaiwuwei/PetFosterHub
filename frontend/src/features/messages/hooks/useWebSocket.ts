/**
 * 实时WebSocket通信自定义Hook
 * 用于管理消息模块的实时通信功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '../types/entity/Message';
import type { Conversation } from '../types/entity/Conversation';
import { wsServiceManager, type WebSocketEventCallbacks } from '../services/WebSocketService';

// Hook返回类型定义
export interface UseWebSocketReturn {
  isConnected: boolean;
  connecting: boolean;
  connectionError: Event | null;
  currentUserStatus: Map<string, 'online' | 'offline' | 'away'>;
  typingUsers: Map<string, boolean>; // 存储每个对话中正在输入的用户
  connect: () => void;
  disconnect: () => void;
  sendReadReceipt: (conversationId: string, messageIds: string[]) => void;
  sendTypingStatus: (conversationId: string, isTyping: boolean) => void;
}

/**
 * 实时WebSocket通信自定义Hook
 * @param userId 用户ID
 * @param onNewMessage 收到新消息的回调
 * @param onConversationUpdate 对话更新的回调
 */
export const useWebSocket = (
  userId: string,
  onNewMessage?: (message: Message) => void,
  onConversationUpdate?: (conversation: Conversation) => void
): UseWebSocketReturn => {
  // 状态管理
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<Event | null>(null);
  const [currentUserStatus, setCurrentUserStatus] = useState<Map<string, 'online' | 'offline' | 'away'>>(new Map());
  const [typingUsers, setTypingUsers] = useState<Map<string, boolean>>(new Map());
  
  // 存储WebSocket服务实例的引用
  const wsServiceRef = useRef<any>(null);

  // 获取WebSocket服务实例
  useEffect(() => {
    if (userId) {
      wsServiceRef.current = wsServiceManager.getService(userId);
    }

    return () => {
      // 组件卸载时清理引用
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
        wsServiceManager.removeService(userId);
        wsServiceRef.current = null;
      }
    };
  }, [userId]);

  // 事件处理函数
  const handleConnect = useCallback(() => {
    setConnecting(false);
    setIsConnected(true);
    setConnectionError(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnecting(false);
    setIsConnected(false);
  }, []);

  const handleError = useCallback((error: Event) => {
    setConnectionError(error);
  }, []);

  const handleNewMessage = useCallback((message: Message) => {
    // 调用外部提供的回调
    onNewMessage?.(message);
  }, [onNewMessage]);

  const handleConversationUpdate = useCallback((conversation: Conversation) => {
    // 调用外部提供的回调
    onConversationUpdate?.(conversation);
  }, [onConversationUpdate]);

  const handleUserStatusChange = useCallback((userId: string, status: 'online' | 'offline' | 'away') => {
    setCurrentUserStatus(prev => new Map(prev).set(userId, status));
  }, []);

  // 设置WebSocket事件回调
  useEffect(() => {
    if (wsServiceRef.current) {
      const callbacks: WebSocketEventCallbacks = {
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        onError: handleError,
        onMessage: handleNewMessage,
        onConversationUpdate: handleConversationUpdate,
        onUserStatusChange: handleUserStatusChange
      };

      wsServiceRef.current.setCallbacks(callbacks);
    }
  }, [handleConnect, handleDisconnect, handleError, handleNewMessage, handleConversationUpdate, handleUserStatusChange]);

  // 连接WebSocket
  const connect = useCallback(() => {
    if (wsServiceRef.current && !isConnected && !connecting) {
      setConnecting(true);
      wsServiceRef.current.connect();
    }
  }, [isConnected, connecting]);

  // 断开WebSocket连接
  const disconnect = useCallback(() => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
    }
  }, []);

  // 发送消息已读确认
  const sendReadReceipt = useCallback((conversationId: string, messageIds: string[]) => {
    if (wsServiceRef.current && isConnected) {
      wsServiceRef.current.sendReadReceipt(conversationId, messageIds);
    }
  }, [isConnected]);

  // 发送正在输入状态
  const sendTypingStatus = useCallback((conversationId: string, isTyping: boolean) => {
    if (wsServiceRef.current && isConnected) {
      wsServiceRef.current.sendTypingStatus(conversationId, isTyping);
    }
  }, [isConnected]);

  // 监听输入状态变化的WebSocket消息
  useEffect(() => {
    if (wsServiceRef.current) {
      // 这里假设WebSocket服务内部已经处理了TYPING_STATUS类型的消息
      // 如果需要额外处理，可以在WebSocketService.ts中的handleMessage方法中添加
    }
  }, []);

  return {
    isConnected,
    connecting,
    connectionError,
    currentUserStatus,
    typingUsers,
    connect,
    disconnect,
    sendReadReceipt,
    sendTypingStatus
  };
};