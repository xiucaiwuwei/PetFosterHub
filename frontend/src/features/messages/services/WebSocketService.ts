/**
 * WebSocket服务类
 * 管理消息模块的实时通信功能
 */

import type { Message } from '../types/entity/Message';
import type { Conversation } from '../types/entity/Conversation';
import { getToken } from '@/lib/utils/TokenManager';

// WebSocket事件回调类型定义
export interface WebSocketEventCallbacks {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  onMessage?: (message: Message) => void;
  onConversationUpdate?: (conversation: Conversation) => void;
  onUserStatusChange?: (userId: string, status: 'online' | 'offline' | 'away') => void;
}

/**
 * WebSocket服务类
 * 负责管理与服务器的WebSocket连接，处理实时消息通信
 */
export class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 1000;
  private eventCallbacks: WebSocketEventCallbacks = {};
  private userId: string | null = null;
  private isConnecting: boolean = false;

  /**
   * 构造函数
   * @param userId 用户ID
   */
  constructor(userId: string) {
    this.userId = userId;
    // 根据环境变量确定WebSocket服务器地址
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.VITE_API_BASE_URL || 'localhost:8080';
    this.url = `${wsProtocol}//${wsHost.replace('http://', '').replace('https://', '')}/api/ws/messages/${userId}`;
  }

  /**
   * 设置事件回调
   * @param callbacks 事件回调对象
   */
  setCallbacks(callbacks: WebSocketEventCallbacks): void {
    this.eventCallbacks = { ...this.eventCallbacks, ...callbacks };
  }

  /**
   * 连接WebSocket服务器
   */
  connect(): void {
    if (this.isConnecting || this.socket?.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    
    // 获取认证token
    const token = getToken();
    
    try {
      // 创建WebSocket连接，添加认证token到URL参数
      const urlWithAuth = `${this.url}?token=${encodeURIComponent(token || '')}`;
      this.socket = new WebSocket(urlWithAuth);

      // 连接成功事件
      this.socket.onopen = (event: Event) => {
        console.log('WebSocket连接成功:', event);
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.eventCallbacks.onConnect?.();
      };

      // 接收消息事件
      this.socket.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('解析WebSocket消息失败:', error);
        }
      };

      // 连接关闭事件
      this.socket.onclose = (event: CloseEvent) => {
        console.log('WebSocket连接关闭:', event);
        this.isConnecting = false;
        this.eventCallbacks.onDisconnect?.();
        
        // 自动重连逻辑
        if (event.code !== 1000) { // 不是正常关闭
          this.attemptReconnect();
        }
      };

      // 连接错误事件
      this.socket.onerror = (event: Event) => {
        console.error('WebSocket连接错误:', event);
        this.isConnecting = false;
        this.eventCallbacks.onError?.(event);
      };
    } catch (error) {
      console.error('创建WebSocket连接失败:', error);
      this.isConnecting = false;
      this.eventCallbacks.onError?.(error as Event);
    }
  }

  /**
   * 断开WebSocket连接
   */
  disconnect(): void {
    if (this.socket) {
      // 正常关闭连接
      this.socket.close(1000, 'Client initiated close');
      this.socket = null;
    }
  }

  /**
   * 发送消息
   * @param message 要发送的消息对象
   */
  send(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket未连接，无法发送消息');
    }
  }

  /**
   * 尝试重新连接
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连');
      return;
    }

    this.reconnectAttempts++;
    console.log(`尝试第 ${this.reconnectAttempts} 次重连...`);

    // 指数退避策略
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * 处理接收到的消息
   * @param data 消息数据
   */
  private handleMessage(data: any): void {
    switch (data.type) {
      case 'NEW_MESSAGE':
        // 新消息通知
        this.eventCallbacks.onMessage?.(data.payload as Message);
        break;
      case 'CONVERSATION_UPDATE':
        // 对话更新通知
        this.eventCallbacks.onConversationUpdate?.(data.payload as Conversation);
        break;
      case 'USER_STATUS_CHANGE':
        // 用户状态变化通知
        this.eventCallbacks.onUserStatusChange?.(data.payload.userId, data.payload.status);
        break;
      default:
        console.log('收到未知类型的WebSocket消息:', data);
    }
  }

  /**
   * 获取连接状态
   * @returns 连接状态
   */
  getConnectionStatus(): number {
    return this.socket?.readyState || WebSocket.CLOSED;
  }

  /**
   * 发送消息已读确认
   * @param conversationId 对话ID
   * @param messageIds 消息ID列表
   */
  sendReadReceipt(conversationId: string, messageIds: string[]): void {
    this.send({
      type: 'READ_RECEIPT',
      payload: {
        conversationId,
        messageIds
      }
    });
  }

  /**
   * 发送正在输入状态
   * @param conversationId 对话ID
   * @param isTyping 是否正在输入
   */
  sendTypingStatus(conversationId: string, isTyping: boolean): void {
    this.send({
      type: 'TYPING_STATUS',
      payload: {
        conversationId,
        isTyping
      }
    });
  }
}

// 全局WebSocket服务实例管理器
class WebSocketServiceManager {
  private static instance: WebSocketServiceManager;
  private services: Map<string, WebSocketService> = new Map();

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): WebSocketServiceManager {
    if (!WebSocketServiceManager.instance) {
      WebSocketServiceManager.instance = new WebSocketServiceManager();
    }
    return WebSocketServiceManager.instance;
  }

  /**
   * 获取或创建用户的WebSocket服务
   * @param userId 用户ID
   */
  getService(userId: string): WebSocketService {
    if (!this.services.has(userId)) {
      this.services.set(userId, new WebSocketService(userId));
    }
    return this.services.get(userId)!;
  }

  /**
   * 移除用户的WebSocket服务
   * @param userId 用户ID
   */
  removeService(userId: string): void {
    const service = this.services.get(userId);
    if (service) {
      service.disconnect();
      this.services.delete(userId);
    }
  }
}

// 导出管理器实例
export const wsServiceManager = WebSocketServiceManager.getInstance();