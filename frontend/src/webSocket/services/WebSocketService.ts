/**
 * WebSocket服务类
 * 负责管理与服务器的WebSocket连接，处理实时消息通信
 * 支持配置化参数、自动重连和错误处理机制
 */

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { WebSocketConfig, defaultWebSocketConfig, createWebSocketUrl, formatDestination } from '../config';
import { 
  ConnectionStatus, 
  WebSocketEventHandler, 
  WebSocketError, 
  WebSocketErrorType, 
  TypingStatusMessage,
  TypingStatus,
  ReadReceiptMessage 
} from '../types/common';

/**
 * Token获取函数类型
 */
export type TokenProvider = () => string | null | undefined;

/**
 * WebSocket服务配置选项
 */
export interface WebSocketServiceOptions {
  /** 认证Token获取函数 */
  tokenProvider?: TokenProvider;
  /** 调试模式标志 */
  debug?: boolean;
}

/**
 * WebSocket服务类
 * 负责管理与服务器的WebSocket连接，处理实时消息通信
 */
export class WebSocketService {
  private stompClient: Stomp.Client | null = null;
  private reconnectAttempts: number = 0;
  private userId: string;
  private isConnecting: boolean = false;
  private config: WebSocketConfig;
  private eventHandlers: WebSocketEventHandler = {};
  private tokenProvider: TokenProvider;
  private debug: boolean;

  /**
   * 构造函数
   * @param userId 用户ID
   * @param config 可选的WebSocket配置
   * @param options 可选的服务选项
   */
  constructor(
    userId: string,
    config?: Partial<WebSocketConfig>,
    options?: WebSocketServiceOptions
  ) {
    if (!userId) {
      throw new Error('User ID is required to initialize WebSocketService');
    }
    
    this.userId = userId;
    // 合并自定义配置和默认配置
    this.config = {
      ...defaultWebSocketConfig,
      ...config,
      destinations: {
        ...defaultWebSocketConfig.destinations,
        ...config?.destinations
      },
      connection: {
        ...defaultWebSocketConfig.connection,
        ...config?.connection
      }
    };
    
    // 设置Token提供器，默认返回空字符串
    this.tokenProvider = options?.tokenProvider || (() => '');
    
    // 调试模式
    this.debug = options?.debug ?? false;
  }

  /**
   * 更新配置
   * @param config 新的WebSocket配置
   */
  updateConfig(config: Partial<WebSocketConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      destinations: {
        ...this.config.destinations,
        ...config?.destinations
      },
      connection: {
        ...this.config.connection,
        ...config?.connection
      }
    };
  }

  /**
   * 设置事件处理器
   * @param handlers 事件处理器对象
   */
  setEventHandlers(handlers: WebSocketEventHandler): void {
    this.eventHandlers = {
      ...this.eventHandlers,
      ...handlers
    };
  }

  /**
   * 连接WebSocket服务器
   * @returns Promise<void> 连接操作的Promise
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || this.stompClient?.connected) {
        resolve();
        return;
      }

      this.isConnecting = true;
      
      // 获取认证token
      const token = this.tokenProvider();
      
      try {
        // 创建WebSocket URL并建立SockJS连接
      const wsUrl = createWebSocketUrl(this.config, this.userId);
      const sockJs = new SockJS(wsUrl, undefined, {
        transports: ['websocket', 'xhr-streaming', 'xhr-polling']
      });
        
        // 创建STOMP客户端
        this.stompClient = Stomp.over(sockJs);
        
        // 配置STOMP客户端调试日志
        this.stompClient.debug = (message) => {
          if (this.debug) {
            console.log(`STOMP: ${message}`);
          }
        };
        
        // 连接选项 - token会在STOMP连接时传递
        const connectOptions = {
          token: token || '',
          // 心跳配置
          heartbeat_outgoing: this.config.connection.heartbeatOutgoing,
          heartbeat_incoming: this.config.connection.heartbeatIncoming
        };
        
        // 连接STOMP服务器
        this.stompClient.connect(connectOptions, 
          // 连接成功回调
          () => {
            if (this.debug) {
              console.log('WebSocket连接成功');
            }
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.eventHandlers.onConnect?.();
            
            // 订阅用户消息
            this.subscribeToUserMessages();
            resolve();
          }, 
          // 连接错误回调
          (error: any) => {
            const wsError = new WebSocketError(
              'WebSocket connection error',
              WebSocketErrorType.CONNECTION_ERROR,
              { originalError: error as Error ?? undefined, retryable: true }
            );
            
            if (this.debug) {
              console.error('WebSocket连接错误:', error);
            }
            
            this.isConnecting = false;
            this.eventHandlers.onError?.(wsError);
            
            // 自动重连逻辑
            this.attemptReconnect();
            reject(wsError);
          }
        );
        
        // 连接关闭事件
        sockJs.onclose = (event: CloseEvent) => {
          if (this.debug) {
            console.log('WebSocket连接关闭:', event);
          }
          
          this.isConnecting = false;
          this.eventHandlers.onDisconnect?.(new Error(`Connection closed with code ${event.code}`));
          
          // 自动重连逻辑
          if (event.code !== 1000) { // 不是正常关闭
            this.attemptReconnect();
          }
        };
      } catch (error) {
        const wsError = new WebSocketError(
          'Failed to create WebSocket connection',
          WebSocketErrorType.CONNECTION_ERROR,
          { originalError: error as Error ?? undefined, retryable: true }
        );
        
        if (this.debug) {
          console.error('创建WebSocket连接失败:', error);
        }
        
        this.isConnecting = false;
        this.eventHandlers.onError?.(wsError);
        reject(wsError);
      }
    });
  }

  /**
   * 订阅用户消息和相关事件
   */
  private subscribeToUserMessages(): void {
    if (!this.stompClient || !this.stompClient.connected) {
      return;
    }
    
    try {
      // 订阅特定用户的消息
      const userMessagesDest = formatDestination(this.config.destinations.userMessages, { userId: this.userId });
      this.stompClient.subscribe(userMessagesDest, (message: Stomp.Message) => {
        try {
          const data = JSON.parse(message.body);
          this.handleMessage(data);
        } catch (error) {
          const wsError = new WebSocketError(
            'Failed to parse user message',
            WebSocketErrorType.SUBSCRIPTION_ERROR,
            { originalError: error as Error ?? undefined }
          );
          
          if (this.debug) {
            console.error('解析WebSocket消息失败:', error);
          }
          
          this.eventHandlers.onError?.(wsError);
        }
      });
      
      // 订阅对话更新
      const conversationDest = formatDestination(this.config.destinations.conversationUpdates, { userId: this.userId });
      this.stompClient.subscribe(conversationDest, (message: Stomp.Message) => {
        try {
          const data = JSON.parse(message.body);
          this.eventHandlers.onConversationUpdate?.(data);
        } catch (error) {
          const wsError = new WebSocketError(
            'Failed to parse conversation update',
            WebSocketErrorType.SUBSCRIPTION_ERROR,
            { originalError: error as Error ?? undefined }
          );
          
          if (this.debug) {
            console.error('解析对话更新消息失败:', error);
          }
          
          this.eventHandlers.onError?.(wsError);
        }
      });
      
      // 订阅用户状态变更
      const userStatusDest = formatDestination(this.config.destinations.userStatus, { userId: this.userId });
      this.stompClient.subscribe(userStatusDest, (message: Stomp.Message) => {
        try {
          const data = JSON.parse(message.body);
          // 用户状态变更暂时不处理
          if (this.debug) {
            console.log('收到用户状态变更消息:', data);
          }
        } catch (error) {
          const wsError = new WebSocketError(
            'Failed to parse user status',
            WebSocketErrorType.SUBSCRIPTION_ERROR,
            { originalError: error as Error ?? undefined }
          );
          
          if (this.debug) {
            console.error('解析用户状态消息失败:', error);
          }
          
          this.eventHandlers.onError?.(wsError);
        }
      });
      
      // 订阅输入状态广播
      this.stompClient.subscribe(this.config.destinations.typing, (message: Stomp.Message) => {
        try {
          const data = JSON.parse(message.body) as TypingStatusMessage;
          this.eventHandlers.onTypingStatus?.(data);
        } catch (error) {
          const wsError = new WebSocketError(
            'Failed to parse typing status',
            WebSocketErrorType.SUBSCRIPTION_ERROR,
            { originalError: error as Error ?? undefined }
          );
          
          if (this.debug) {
            console.error('解析输入状态消息失败:', error);
          }
          
          this.eventHandlers.onError?.(wsError);
        }
      });
    } catch (error) {
      const wsError = new WebSocketError(
        'Failed to subscribe to message destinations',
        WebSocketErrorType.SUBSCRIPTION_ERROR,
        { originalError: error as Error ?? undefined }
      );
      
      if (this.debug) {
        console.error('订阅消息失败:', error);
      }
      
      this.eventHandlers.onError?.(wsError);
    }
  }

  /**
   * 断开WebSocket连接
   * @returns Promise<void> 断开连接操作的Promise
   */
  disconnect(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.stompClient) {
        this.isConnecting = false;
        resolve();
        return;
      }

      try {
        this.stompClient.disconnect(() => {
          if (this.debug) {
            console.log('WebSocket断开连接');
          }
          
          this.stompClient = null;
          this.isConnecting = false;
          this.eventHandlers.onDisconnect?.();
          resolve();
        });
      } catch (error) {
        if (this.debug) {
          console.error('断开WebSocket连接失败:', error);
        }
        
        this.stompClient = null;
        this.isConnecting = false;
        this.eventHandlers.onDisconnect?.(error as Error);
        resolve();
      }
    });
  }

  /**
   * 处理接收到的消息
   * @param messageData 消息数据
   * @private
   */
  private handleMessage(messageData: any): void {
    try {
      // 处理不同类型的消息
      if (messageData.type === 'MESSAGE' && this.eventHandlers.onMessage) {
        this.eventHandlers.onMessage(messageData.payload);
      } else if (messageData.type === 'TYPING_STATUS' && this.eventHandlers.onTypingStatus) {
        // 处理输入状态消息
        const typingStatus: TypingStatusMessage = {
          conversationId: messageData.conversationId,
          userId: messageData.userId,
          status: messageData.isTyping ? TypingStatus.TYPING : TypingStatus.STOPPED,
          timestamp: messageData.timestamp || Date.now()
        };
        this.eventHandlers.onTypingStatus(typingStatus);
      } else if (messageData.type === 'CONVERSATION_UPDATE' && this.eventHandlers.onConversationUpdate) {
        // 处理对话更新消息
        this.eventHandlers.onConversationUpdate(messageData.payload);
      } else if (this.debug) {
        // 记录其他类型的消息
        console.log('接收到其他类型的消息:', messageData);
      }
    } catch (error) {
      const wsError = new WebSocketError(
        'Failed to process received message',
        WebSocketErrorType.SUBSCRIPTION_ERROR,
        { originalError: error as Error ?? undefined }
      );
      
      if (this.debug) {
        console.error('处理消息失败:', error);
      }
      
      this.eventHandlers.onError?.(wsError);
    }
  }

  /**
   * 发送消息
   * @param messageData 要发送的消息数据
   * @returns Promise<void> 发送操作的Promise
   */
  send(messageData: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.stompClient || !this.stompClient.connected) {
        const error = new WebSocketError(
          'WebSocket is not connected, cannot send message',
          WebSocketErrorType.SEND_ERROR,
          { retryable: true }
        );
        
        if (this.debug) {
          console.error('WebSocket未连接，无法发送消息');
        }
        
        this.eventHandlers.onError?.(error);
        reject(error);
        return;
      }

      try {
        // 发送消息到服务器的应用目的地
        this.stompClient.send(this.config.destinations.sendMessage, {}, JSON.stringify(messageData));
        
        // Stomp.js不支持onReceipt回调，这里立即resolve
        if (this.debug) {
          console.log('消息发送请求已发送:', messageData);
        }
        resolve();
      } catch (error) {
        const wsError = new WebSocketError(
          'Failed to send message',
          WebSocketErrorType.SEND_ERROR,
          { originalError: error as Error ?? undefined, retryable: true }
        );
        
        if (this.debug) {
          console.error('发送消息失败:', error);
        }
        
        this.eventHandlers.onError?.(wsError);
        reject(wsError);
      }
    });
  }

  /**
   * 发送消息已读确认
   * @param conversationId 对话ID
   * @param messageIds 消息ID列表
   * @returns Promise<void> 发送操作的Promise
   */
  sendReadReceipt(conversationId: string, messageIds: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.stompClient || !this.stompClient.connected) {
        const error = new WebSocketError(
          'WebSocket is not connected, cannot send read receipt',
          WebSocketErrorType.SEND_ERROR,
          { retryable: true }
        );
        
        if (this.debug) {
          console.error('WebSocket未连接，无法发送已读确认');
        }
        
        this.eventHandlers.onError?.(error);
        reject(error);
        return;
      }

      try {
        const data: ReadReceiptMessage = {
          conversationId,
          messageId: messageIds[0], // 兼容单条消息的情况
          readerId: this.userId,
          readTimestamp: Date.now()
        };
        
        this.stompClient.send(this.config.destinations.readReceipt, {}, JSON.stringify(data));
        
        if (this.debug) {
          console.log('已读确认发送成功:', data);
        }
        resolve();
      } catch (error) {
        const wsError = new WebSocketError(
          'Failed to send read receipt',
          WebSocketErrorType.SEND_ERROR,
          { originalError: error as Error ?? undefined, retryable: true }
        );
        
        if (this.debug) {
          console.error('发送已读确认失败:', error);
        }
        
        this.eventHandlers.onError?.(wsError);
        reject(wsError);
      }
    });
  }

  /**
   * 发送输入状态
   * @param conversationId 对话ID
   * @param isTyping 是否正在输入
   * @returns Promise<void> 发送操作的Promise
   */
  sendTypingStatus(conversationId: string, isTyping: boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.stompClient || !this.stompClient.connected) {
        const error = new WebSocketError(
          'WebSocket is not connected, cannot send typing status',
          WebSocketErrorType.SEND_ERROR,
          { retryable: true }
        );
        
        if (this.debug) {
          console.error('WebSocket未连接，无法发送输入状态');
        }
        
        this.eventHandlers.onError?.(error);
        reject(error);
        return;
      }

      try {
        const data: TypingStatusMessage = {
          conversationId,
          userId: this.userId,
          status: isTyping ? TypingStatus.TYPING : TypingStatus.STOPPED,
          timestamp: Date.now()
        };
        
        this.stompClient.send(this.config.destinations.typing, {}, JSON.stringify(data));
        
        if (this.debug) {
          console.log('输入状态发送成功:', data);
        }
        resolve();
      } catch (error) {
        const wsError = new WebSocketError(
          'Failed to send typing status',
          WebSocketErrorType.SEND_ERROR,
          { originalError: error as Error ?? undefined, retryable: true }
        );
        
        if (this.debug) {
          console.error('发送输入状态失败:', error);
        }
        
        this.eventHandlers.onError?.(wsError);
        reject(wsError);
      }
    });
  }


  /**
   * 获取连接状态
   * @returns ConnectionStatus 连接状态枚举值
   */
  getConnectionStatus(): ConnectionStatus {
    if (!this.stompClient) {
      return ConnectionStatus.DISCONNECTED;
    }
    return this.stompClient.connected 
      ? ConnectionStatus.CONNECTED 
      : this.isConnecting 
        ? ConnectionStatus.CONNECTING 
        : ConnectionStatus.DISCONNECTED;
  }

  /**
   * 尝试重新连接
   * @param error 导致重连的错误信息
   */
  private attemptReconnect(error?: Error): void {
    if (this.reconnectAttempts >= this.config.connection.maxReconnectAttempts) {
      const reconnectError = new WebSocketError(
        `Reached maximum reconnection attempts (${this.config.connection.maxReconnectAttempts})`,
        WebSocketErrorType.RECONNECT_FAILED,
        { originalError: error as Error ?? undefined, retryable: false }
      );
      
      if (this.debug) {
        console.error(`达到最大重连次数(${this.config.connection.maxReconnectAttempts})，停止重连`, error);
      }
      
      this.eventHandlers.onReconnectFailed?.(reconnectError);
      this.eventHandlers.onError?.(reconnectError);
      return;
    }

    this.reconnectAttempts++;
    const delay = this.calculateReconnectDelay(this.reconnectAttempts);

    if (this.debug) {
      console.log(`计划在${delay}毫秒后进行第${this.reconnectAttempts}次重连`);
    }

    // 实际执行重连操作
    setTimeout(() => {
      if (this.debug) {
        console.log(`执行第${this.reconnectAttempts}次重连`);
      }
      // 重新连接前先断开可能存在的连接
      if (this.stompClient) {
        try {
          this.stompClient.disconnect(() => {
            this.stompClient = null;
            this.connect().catch(err => {
              if (this.debug) {
                console.error(`第${this.reconnectAttempts}次重连失败:`, err);
              }
            });
          });
        } catch (err) {
          this.stompClient = null;
          this.connect().catch(err => {
            if (this.debug) {
              console.error(`第${this.reconnectAttempts}次重连失败:`, err);
            }
          });
        }
      } else {
        this.connect().catch(err => {
          if (this.debug) {
            console.error(`第${this.reconnectAttempts}次重连失败:`, err);
          }
        });
      }
    }, delay);
  }

  /**
   * 计算重连延迟时间（带指数退避）
   * @param attempt 重连尝试次数
   * @returns 延迟时间（毫秒）
   */
  private calculateReconnectDelay(attempt: number): number {
    // 基础延迟加上随机抖动以避免服务器被同时请求
    const baseDelay = (this.config.connection.initialReconnectInterval || 1000) * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000;
    // 限制最大延迟为30秒
    return Math.min(baseDelay + jitter, 30000);
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