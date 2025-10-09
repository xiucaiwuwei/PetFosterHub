/**
 * WebSocket模块通用类型定义
 * 包含不依赖于特定业务逻辑的基础类型
 */

/**
 * WebSocket连接状态
 */
export enum ConnectionStatus {
  /** 未连接 */
  DISCONNECTED = 'disconnected',
  /** 连接中 */
  CONNECTING = 'connecting',
  /** 已连接 */
  CONNECTED = 'connected',
  /** 断开连接中 */
  DISCONNECTING = 'disconnecting',
  /** 连接失败 */
  FAILED = 'failed'
}

/**
 * WebSocket错误类型
 */
export enum WebSocketErrorType {
  /** 连接错误 */
  CONNECTION_ERROR = 'connection_error',
  /** 认证错误 */
  AUTHENTICATION_ERROR = 'authentication_error',
  /** 消息发送错误 */
  SEND_ERROR = 'send_error',
  /** 订阅错误 */
  SUBSCRIPTION_ERROR = 'subscription_error',
  /** 重连失败 */
  RECONNECT_FAILED = 'reconnect_failed',
  /** 未知错误 */
  UNKNOWN_ERROR = 'unknown_error'
}

/**
 * 基础消息接口
 */
export interface BaseMessage<T = unknown> {
  /** 消息ID */
  id: string;
  /** 消息类型 */
  type: string;
  /** 发送者ID */
  senderId: string;
  /** 接收者ID */
  recipientId: string;
  /** 消息内容 */
  content: T;
  /** 发送时间 */
  timestamp: number;
  /** 是否已读 */
  isRead?: boolean;
  /** 附加信息 */
  metadata?: Record<string, unknown>;
}

/**
 * 文本消息内容
 */
export interface TextMessageContent {
  /** 文本内容 */
  text: string;
}

/**
 * 图片消息内容
 */
export interface ImageMessageContent {
  /** 图片URL */
  url: string;
  /** 图片宽度 */
  width?: number;
  /** 图片高度 */
  height?: number;
  /** 图片预览URL */
  thumbnailUrl?: string;
}

/**
 * 系统消息内容
 */
export interface SystemMessageContent {
  /** 系统消息类型 */
  systemType: string;
  /** 系统消息描述 */
  description: string;
}

/**
 * 输入状态类型
 */
export enum TypingStatus {
  /** 开始输入 */
  TYPING = 'typing',
  /** 停止输入 */
  STOPPED = 'stopped',
  /** 已发送 */
  SENT = 'sent'
}

/**
 * 输入状态消息
 */
export interface TypingStatusMessage {
  /** 会话ID */
  conversationId: string;
  /** 用户ID */
  userId: string;
  /** 用户名称 */
  userName?: string;
  /** 输入状态 */
  status: TypingStatus;
  /** 时间戳 */
  timestamp: number;
}

/**
 * 已读确认消息
 */
export interface ReadReceiptMessage {
  /** 消息ID */
  messageId: string;
  /** 会话ID */
  conversationId: string;
  /** 读取者ID */
  readerId: string;
  /** 读取时间 */
  readTimestamp: number;
}

/**
 * WebSocket事件处理器接口
 */
export interface WebSocketEventHandler {
  /** 连接建立时触发 */
  onConnect?: () => void;
  /** 连接断开时触发 */
  onDisconnect?: (error?: Error) => void;
  /** 连接错误时触发 */
  onError?: (error: WebSocketError) => void;
  /** 收到消息时触发 */
  onMessage?: <T>(message: BaseMessage<T>) => void;
  /** 输入状态更新时触发 */
  onTypingStatus?: (status: TypingStatusMessage) => void;
  /** 会话更新时触发 */
  onConversationUpdate?: (update: ConversationUpdate) => void;
  /** 用户状态变更时触发 */
  onUserStatusChange?: (userId: string, status: string) => void;
  /** 重连尝试时触发 */
  onReconnectAttempt?: (attempt: number) => void;
  /** 重连失败时触发 */
  onReconnectFailed?: (error: WebSocketError) => void;
}

/**
 * WebSocket自定义错误
 */
export class WebSocketError extends Error {
  /** 错误类型 */
  type: WebSocketErrorType;
  /** 错误代码 */
  code: string | undefined;
  /** 原始错误 */
  originalError: Error | undefined;
  /** 是否可重试 */
  retryable: boolean | undefined;

  /**
   * 构造WebSocket错误
   * @param message 错误消息
   * @param type 错误类型
   * @param options 额外选项
   */
  constructor(
    message: string,
    type: WebSocketErrorType,
    options?: {
      code?: string;
      originalError?: Error;
      retryable?: boolean;
    }
  ) {
    super(message);
    this.name = 'WebSocketError';
    this.type = type;
    this.code = options?.code ?? undefined;
    this.originalError = options?.originalError ?? undefined;
    this.retryable = options?.retryable ?? undefined;

    // 兼容ES5环境
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, WebSocketError.prototype);
    } else {
      (this as any).__proto__ = WebSocketError.prototype;
    }
  }
}

/**
 * 会话更新类型
 */
export enum ConversationUpdateType {
  /** 新增会话 */
  CREATED = 'created',
  /** 更新会话 */
  UPDATED = 'updated',
  /** 删除会话 */
  DELETED = 'deleted',
  /** 未读数量更新 */
  UNREAD_COUNT_UPDATED = 'unread_count_updated'
}

/**
 * 会话更新消息
 */
export interface ConversationUpdate {
  /** 更新类型 */
  type: ConversationUpdateType;
  /** 会话ID */
  conversationId: string;
  /** 更新数据 */
  data?: Record<string, unknown>;
  /** 更新时间 */
  timestamp: number;
}