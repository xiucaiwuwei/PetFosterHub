/**
 * WebSocketService 单元测试
 * 测试WebSocket连接管理、消息收发等核心功能
 */

import { WebSocketService } from '../services/WebSocketService';
import { defaultWebSocketConfig } from '../config';
import { ConnectionStatus, WebSocketErrorType, WebSocketError } from '../types/common';

// Mock StompJS
jest.mock('@stomp/stompjs', () => ({
  Client: jest.fn().mockImplementation(() => ({
    activate: jest.fn(),
    deactivate: jest.fn(),
    publish: jest.fn(),
    subscribe: jest.fn().mockReturnValue({
      unsubscribe: jest.fn()
    }),
    connected: false,
    onConnect: null,
    onDisconnect: null,
    onStompError: null
  }))
}));

// Mock TokenManager
jest.mock('@/features/authentication/services/TokenManager', () => ({
  getInstance: jest.fn().mockReturnValue({
    getToken: jest.fn().mockReturnValue('mock-token')
  })
}));

describe('WebSocketService', () => {
  let webSocketService: WebSocketService;
  let mockStompClient: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // 创建服务实例
    webSocketService = new WebSocketService('test-user-id', {
      ...defaultWebSocketConfig,
      baseUrl: 'ws://localhost:8080'
    });
    
    // 获取mock的Stomp客户端
    const { Client } = require('@stomp/stompjs');
    mockStompClient = (Client as jest.Mock).mock.results[0].value;
  });

  describe('constructor', () => {
    it('should initialize with default config when no config provided', () => {
      const service = new WebSocketService('test-user-id');
      expect(service['userId']).toBe('test-user-id');
      expect(service['config']).toEqual(defaultWebSocketConfig);
    });

    it('should initialize with custom config when provided', () => {
      const customConfig = {
        ...defaultWebSocketConfig,
        baseUrl: 'ws://custom-host:8080'
      };
      const service = new WebSocketService('test-user-id', customConfig);
      expect(service['config']).toBe(customConfig);
    });

    it('should initialize with tokenProvider when provided', () => {
      const mockTokenProvider = jest.fn().mockReturnValue('custom-token');
      const service = new WebSocketService('test-user-id', defaultWebSocketConfig, { tokenProvider: mockTokenProvider });
      expect(service['tokenProvider']).toBe(mockTokenProvider);
    });
  });

  describe('connect', () => {
    it('should connect successfully and call onConnect callback', async () => {
      const onConnectMock = jest.fn();
      webSocketService.setEventHandlers({ onConnect: onConnectMock });
      
      // 模拟连接成功
      const connectPromise = webSocketService.connect();
      
      // 手动触发连接回调
      if (mockStompClient.onConnect) {
        mockStompClient.connected = true;
        mockStompClient.onConnect({});
      }
      
      await connectPromise;
      
      expect(onConnectMock).toHaveBeenCalled();
      expect(webSocketService.getConnectionStatus()).toBe(ConnectionStatus.CONNECTED);
    });

    it('should handle connection error', async () => {
      const onErrorMock = jest.fn();
      webSocketService.setEventHandlers({ onError: onErrorMock });
      
      // 模拟连接失败
      const connectPromise = webSocketService.connect();
      
      // 手动触发错误回调
      if (mockStompClient.onStompError) {
        mockStompClient.onStompError(new Error('Connection failed'));
      }
      
      await expect(connectPromise).rejects.toThrow(WebSocketError);
      expect(onErrorMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: WebSocketErrorType.CONNECTION_ERROR
        })
      );
    });
  });

  describe('disconnect', () => {
    it('should disconnect successfully and call onDisconnect callback', async () => {
      const onDisconnectMock = jest.fn();
      webSocketService.setEventHandlers({ onDisconnect: onDisconnectMock });
      
      // 模拟已连接状态
      mockStompClient.connected = true;
      
      await webSocketService.disconnect();
      
      expect(mockStompClient.deactivate).toHaveBeenCalled();
      expect(onDisconnectMock).toHaveBeenCalled();
      expect(webSocketService.getConnectionStatus()).toBe(ConnectionStatus.DISCONNECTED);
    });
  });

  describe('send', () => {
    it('should send message successfully when connected', async () => {
      // 模拟已连接状态
      mockStompClient.connected = true;
      
      const messageData = { content: 'test message' };
      await webSocketService.send(messageData);
      
      expect(mockStompClient.send).toHaveBeenCalledWith(
        defaultWebSocketConfig.destinations.sendMessage,
        {},
        JSON.stringify(messageData)
      );
    });

    it('should throw error when not connected', async () => {
      // 模拟未连接状态
      mockStompClient.connected = false;
      
      const messageData = { content: 'test message' };
      
      await expect(webSocketService.send(messageData)).rejects.toThrow(WebSocketError);
    });
  });

  describe('reconnect mechanism', () => {
    beforeEach(() => {
      // 增加超时时间以避免测试超时
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should attempt to reconnect after disconnection', () => {
      const onReconnectAttemptMock = jest.fn();
      webSocketService.setEventHandlers({ onReconnectAttempt: onReconnectAttemptMock });
      
      // 模拟连接断开
      if (mockStompClient.onDisconnect) {
        mockStompClient.onDisconnect({});
      }
      
      // 快进时间到重连延迟后
      jest.advanceTimersByTime(1000);
      
      expect(onReconnectAttemptMock).toHaveBeenCalledWith(1);
    });
  });
});