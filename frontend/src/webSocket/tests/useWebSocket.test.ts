/**
 * useWebSocket Hook 单元测试
 * 测试React Hook与WebSocket服务的集成功能
 */

import { renderHook, act } from '@testing-library/react';
import { useWebSocket } from '../hooks/useWebSocket';
import { wsServiceManager } from '../services/WebSocketService';
import { ConnectionStatus, WebSocketErrorType, WebSocketError } from '../types/common';

// Mock wsServiceManager
jest.mock('../services/WebSocketService', () => ({
  wsServiceManager: {
    getService: jest.fn().mockReturnValue({
      setEventHandlers: jest.fn(),
      connect: jest.fn().mockResolvedValue(undefined),
      disconnect: jest.fn().mockResolvedValue(undefined),
      sendReadReceipt: jest.fn().mockResolvedValue(undefined),
      sendTypingStatus: jest.fn().mockResolvedValue(undefined),
      getConnectionStatus: jest.fn().mockReturnValue(ConnectionStatus.DISCONNECTED)
    }),
    removeService: jest.fn()
  }
}));

describe('useWebSocket Hook', () => {
  let mockWebSocketService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWebSocketService = (wsServiceManager.getService as jest.Mock).mock.results[0].value;
  });

  describe('initialization', () => {
    it('should initialize with DISCONNECTED status', () => {
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      expect(result.current.status).toBe(ConnectionStatus.DISCONNECTED);
      expect(result.current.connectionError).toBeNull();
      expect(result.current.currentUserStatus).toBeInstanceOf(Map);
      expect(result.current.typingUsers).toBeInstanceOf(Map);
    });

    it('should get WebSocket service on mount', () => {
      renderHook(() => useWebSocket('test-user-id'));
      
      expect(wsServiceManager.getService).toHaveBeenCalledWith('test-user-id');
    });
  });

  describe('connect function', () => {
    it('should call connect on WebSocket service', async () => {
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      let connectPromise;
      act(() => {
        connectPromise = result.current.connect();
      });
      
      expect(mockWebSocketService.connect).toHaveBeenCalled();
      
      await connectPromise;
    });

    it('should update status to CONNECTING when connecting', async () => {
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      act(() => {
        result.current.connect();
      });
      
      expect(result.current.status).toBe(ConnectionStatus.CONNECTING);
    });

    it('should handle connection error', async () => {
      const mockError = new WebSocketError(
        'Connection failed',
        WebSocketErrorType.CONNECTION_ERROR
      );
      mockWebSocketService.connect.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      let connectPromise;
      act(() => {
        connectPromise = result.current.connect();
      });
      
      await expect(connectPromise).rejects.toBe(mockError);
      expect(result.current.status).toBe(ConnectionStatus.FAILED);
      expect(result.current.connectionError).toBe(mockError);
    });
  });

  describe('disconnect function', () => {
    it('should call disconnect on WebSocket service', async () => {
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      let disconnectPromise;
      act(() => {
        disconnectPromise = result.current.disconnect();
      });
      
      expect(result.current.status).toBe(ConnectionStatus.DISCONNECTING);
      
      await disconnectPromise;
      expect(mockWebSocketService.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnect error gracefully', async () => {
      const mockError = new Error('Disconnect failed');
      mockWebSocketService.disconnect.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      let disconnectPromise;
      act(() => {
        disconnectPromise = result.current.disconnect();
      });
      
      await expect(disconnectPromise).rejects.toBe(mockError);
    });
  });

  describe('sendReadReceipt function', () => {
    it('should call sendReadReceipt on WebSocket service when connected', async () => {
      mockWebSocketService.getConnectionStatus.mockReturnValue(ConnectionStatus.CONNECTED);
      
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      const conversationId = 'test-conversation';
      const messageIds = ['msg1', 'msg2'];
      
      let promise;
      act(() => {
        promise = result.current.sendReadReceipt(conversationId, messageIds);
      });
      
      expect(mockWebSocketService.sendReadReceipt).toHaveBeenCalledWith(conversationId, messageIds);
      
      await promise;
    });

    it('should throw error when not connected', async () => {
      mockWebSocketService.getConnectionStatus.mockReturnValue(ConnectionStatus.DISCONNECTED);
      
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      const conversationId = 'test-conversation';
      const messageIds = ['msg1', 'msg2'];
      
      let promise;
      act(() => {
        promise = result.current.sendReadReceipt(conversationId, messageIds);
      });
      
      await expect(promise).rejects.toThrow('WebSocket未连接，无法发送已读确认');
    });
  });

  describe('sendTypingStatus function', () => {
    it('should call sendTypingStatus on WebSocket service when connected', async () => {
      mockWebSocketService.getConnectionStatus.mockReturnValue(ConnectionStatus.CONNECTED);
      
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      const conversationId = 'test-conversation';
      const isTyping = true;
      
      let promise;
      act(() => {
        promise = result.current.sendTypingStatus(conversationId, isTyping);
      });
      
      expect(mockWebSocketService.sendTypingStatus).toHaveBeenCalledWith(conversationId, isTyping);
      
      await promise;
    });

    it('should throw error when not connected', async () => {
      mockWebSocketService.getConnectionStatus.mockReturnValue(ConnectionStatus.DISCONNECTED);
      
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      const conversationId = 'test-conversation';
      const isTyping = true;
      
      let promise;
      act(() => {
        promise = result.current.sendTypingStatus(conversationId, isTyping);
      });
      
      await expect(promise).rejects.toThrow('WebSocket未连接，无法发送正在输入状态');
    });
  });

  describe('event callbacks', () => {
    it('should set event handlers on WebSocket service', () => {
      renderHook(() => useWebSocket('test-user-id'));
      
      expect(mockWebSocketService.setEventHandlers).toHaveBeenCalledWith(expect.objectContaining({
        onConnect: expect.any(Function),
        onDisconnect: expect.any(Function),
        onError: expect.any(Function),
        onMessage: expect.any(Function),
        onConversationUpdate: expect.any(Function),
        onUserStatusChange: expect.any(Function)
      }));
    });

    it('should update status on connect event', () => {
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      // 获取设置的回调函数
      const eventHandlers = (mockWebSocketService.setEventHandlers as jest.Mock).mock.calls[0][0];
      
      act(() => {
        eventHandlers.onConnect();
      });
      
      expect(result.current.status).toBe(ConnectionStatus.CONNECTED);
    });

    it('should update status on disconnect event', () => {
      const { result } = renderHook(() => useWebSocket('test-user-id'));
      
      // 获取设置的回调函数
      const eventHandlers = (mockWebSocketService.setEventHandlers as jest.Mock).mock.calls[0][0];
      
      act(() => {
        eventHandlers.onDisconnect();
      });
      
      expect(result.current.status).toBe(ConnectionStatus.DISCONNECTED);
    });
  });

  describe('cleanup on unmount', () => {
    it('should disconnect and remove service on unmount', () => {
      const { unmount } = renderHook(() => useWebSocket('test-user-id'));
      
      unmount();
      
      expect(mockWebSocketService.disconnect).toHaveBeenCalled();
      expect(wsServiceManager.removeService).toHaveBeenCalledWith('test-user-id');
    });
  });
});