/**
 * 实时WebSocket通信自定义Hook
 * 用于管理实时通信功能
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Message } from '@/features/messages/types/entity/Message';
import type { Conversation } from '@/features/messages/types/entity/Conversation';
import { wsServiceManager } from '../services/WebSocketService';
import { ConnectionStatus, WebSocketErrorType } from '../types/common';
import { WebSocketEventHandler, WebSocketError } from '../types/common';

// Hook返回类型定义
export interface UseWebSocketReturn {
  status: ConnectionStatus;
  connectionError: WebSocketError | null;
  currentUserStatus: Map<string, 'online' | 'offline' | 'away'>;
  typingUsers: Map<string, boolean>; // 存储每个对话中正在输入的用户
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendReadReceipt: (conversationId: string, messageIds: string[]) => Promise<void>;
  sendTypingStatus: (conversationId: string, isTyping: boolean) => Promise<void>;
  // 派生属性，用于快速判断是否已连接
  isConnected: boolean;
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
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [connectionError, setConnectionError] = useState<WebSocketError | null>(null);
  const [currentUserStatus, setCurrentUserStatus] = useState<Map<string, 'online' | 'offline' | 'away'>>(new Map());
  const [typingUsers] = useState<Map<string, boolean>>(new Map());
  
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
    setStatus(ConnectionStatus.CONNECTED);
    setConnectionError(null);
  }, []);

  const handleDisconnect = useCallback(() => {
    setStatus(ConnectionStatus.DISCONNECTED);
  }, []);

  const handleError = useCallback((error: WebSocketError) => {
    setConnectionError(error);
    if (error.type === WebSocketErrorType.CONNECTION_ERROR) {
      setStatus(ConnectionStatus.FAILED);
    }
  }, []);

  // 定义内部处理函数，用于适配类型差异
  const internalHandleNewMessage = useCallback((message: any) => {
    // 调用外部提供的回调
    onNewMessage?.(message);
  }, [onNewMessage]);

  const internalHandleConversationUpdate = useCallback((conversationUpdate: any) => {
    // 调用外部提供的回调
    onConversationUpdate?.(conversationUpdate);
  }, [onConversationUpdate]);

  const internalHandleUserStatusChange = useCallback((userId: string, status: string) => {
    // 验证状态值
    const validStatuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
    if (validStatuses.includes(status as any)) {
      setCurrentUserStatus(prev => new Map(prev).set(userId, status as any));
    }
  }, []);

  // 设置WebSocket事件回调
  useEffect(() => {
    if (wsServiceRef.current) {
      const eventHandlers: WebSocketEventHandler = {
        onConnect: handleConnect,
        onDisconnect: handleDisconnect,
        onError: handleError,
        // 类型安全转换
        onMessage: internalHandleNewMessage as any,
        onConversationUpdate: internalHandleConversationUpdate as any,
        onUserStatusChange: internalHandleUserStatusChange as any
      };

      wsServiceRef.current.setEventHandlers(eventHandlers);
    }
  }, [handleConnect, handleDisconnect, handleError, internalHandleNewMessage, internalHandleConversationUpdate, internalHandleUserStatusChange]);

  // 注意：不再自动尝试连接
  // WebSocket连接应该由具体使用的组件在需要时（如打开对话框）才调用connect方法

  // 连接WebSocket - 增强错误处理和智能重连机制
  const connectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const baseReconnectDelay = 1000; // 基础重连延迟(ms)
  const maxReconnectAttempts = 3; // 最大重连尝试次数
  const shouldAttemptReconnect = useRef(false); // 控制是否应该尝试重连的标志
  
  // 清除之前的重连定时器
  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);
  
  // 自动重连逻辑
  const scheduleReconnect = useCallback(() => {
    // 清除之前的定时器
    clearReconnectTimeout();
    
    // 只有在明确允许重连时才尝试
    if (shouldAttemptReconnect.current &&
        connectAttemptRef.current < maxReconnectAttempts && 
        status !== ConnectionStatus.CONNECTED && 
        status !== ConnectionStatus.CONNECTING) {
      connectAttemptRef.current++;
      
      // 指数退避策略，增加随机抖动避免雪崩效应
      const delay = baseReconnectDelay * 
                    Math.pow(2, connectAttemptRef.current - 1) * 
                    (0.9 + Math.random() * 0.2);
      
      console.log(`将在${Math.round(delay)}ms后尝试第${connectAttemptRef.current}/${maxReconnectAttempts}次重连`);
      
      // 设置新的重连定时器
      reconnectTimeoutRef.current = setTimeout(() => {
        if (shouldAttemptReconnect.current) { // 再次检查标志
          connect().catch((error) => {
            console.error(`自动重连失败:`, error);
          });
        }
      }, delay);
    } else if (connectAttemptRef.current >= maxReconnectAttempts) {
      console.warn('达到最大连接尝试次数，暂停连接');
      const originalError = new Error('Max connection attempts reached');
      setConnectionError(new WebSocketError(
        'Max connection attempts reached',
        WebSocketErrorType.CONNECTION_ERROR,
        { originalError: originalError, retryable: false }
      ));
      setStatus(ConnectionStatus.FAILED);
    }
  }, [status, clearReconnectTimeout]);
  
  // 连接WebSocket函数
  const connect = useCallback(async (): Promise<void> => {
    if (wsServiceRef.current && status !== ConnectionStatus.CONNECTED && status !== ConnectionStatus.CONNECTING) {
      clearReconnectTimeout(); // 清除可能存在的重连定时器
      
      // 标记为应该尝试重连
      shouldAttemptReconnect.current = true;
      
      setStatus(ConnectionStatus.CONNECTING);
      try {
        await wsServiceRef.current.connect();
        // 连接成功后重置尝试次数
        connectAttemptRef.current = 0;
      } catch (error) {
        const wsError = error as WebSocketError;
        setConnectionError(wsError);
        setStatus(ConnectionStatus.FAILED);
        
        // 如果错误可重试且仍然应该重连，安排自动重连
        if (wsError.retryable !== false && shouldAttemptReconnect.current) {
          scheduleReconnect();
        }
        
        console.error(`WebSocket连接尝试失败:`, wsError);
        throw wsError;
      }
    }
  }, [status, clearReconnectTimeout, scheduleReconnect]);
  
  // 清理重连定时器
  useEffect(() => {
    return () => {
      clearReconnectTimeout();
    };
  }, [clearReconnectTimeout]);

  // 断开WebSocket连接
  const disconnect = useCallback(async (): Promise<void> => {
    if (wsServiceRef.current) {
      // 标记为不应该尝试重连
      shouldAttemptReconnect.current = false;
      // 清除重连定时器
      clearReconnectTimeout();
      // 重置尝试次数
      connectAttemptRef.current = 0;
      
      setStatus(ConnectionStatus.DISCONNECTING);
      try {
        await wsServiceRef.current.disconnect();
      } catch (error) {
        console.error('断开连接时出错:', error);
        // 即使出错，我们仍然将状态设置为DISCONNECTED
        setStatus(ConnectionStatus.DISCONNECTED);
        throw error;
      }
    }
  }, [clearReconnectTimeout]);

  // 发送消息已读确认
  const sendReadReceipt = useCallback(async (conversationId: string, messageIds: string[]): Promise<void> => {
    if (wsServiceRef.current && status === ConnectionStatus.CONNECTED) {
      try {
        await wsServiceRef.current.sendReadReceipt(conversationId, messageIds);
      } catch (error) {
        console.error('发送已读确认失败:', error);
        throw error;
      }
    } else {
      const error = new Error('WebSocket未连接，无法发送已读确认');
      console.error(error.message);
      throw error;
    }
  }, [status]);

  // 发送正在输入状态
  const sendTypingStatus = useCallback(async (conversationId: string, isTyping: boolean): Promise<void> => {
    if (wsServiceRef.current && status === ConnectionStatus.CONNECTED) {
      try {
        await wsServiceRef.current.sendTypingStatus(conversationId, isTyping);
      } catch (error) {
        console.error('发送正在输入状态失败:', error);
        throw error;
      }
    } else {
      const error = new Error('WebSocket未连接，无法发送正在输入状态');
      console.error(error.message);
      throw error;
    }
  }, [status]);

  // 监听输入状态变化的WebSocket消息
  useEffect(() => {
    if (wsServiceRef.current) {
      // 这里假设WebSocket服务内部已经处理了TYPING_STATUS类型的消息
      // 如果需要额外处理，可以在WebSocketService.ts中的handleMessage方法中添加
    }
  }, []);

  // 计算是否已连接的派生属性
  const isConnected = status === ConnectionStatus.CONNECTED;

  return {
    status,
    connectionError,
    currentUserStatus,
    typingUsers,
    connect,
    disconnect,
    sendReadReceipt,
    sendTypingStatus,
    isConnected
  };
};