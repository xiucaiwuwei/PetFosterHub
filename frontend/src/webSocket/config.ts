/**
 * WebSocket模块配置文件
 * 用于管理WebSocket连接的关键配置参数
 */

/**
 * WebSocket配置接口
 */
export interface WebSocketConfig {
  /** WebSocket服务器基础URL */
  baseUrl: string;
  /** 消息端点路径前缀 */
  messageEndpointPrefix: string;
  /** STOMP消息目的地配置 */
  destinations: {
    /** 用户消息队列 */
    userMessages: string;
    /** 对话更新队列 */
    conversationUpdates: string;
    /** 用户状态更新队列 */
    userStatus: string;
    /** 输入状态广播 */
    typing: string;
    /** 发送消息的应用目的地 */
    sendMessage: string;
    /** 发送已读确认的应用目的地 */
    readReceipt: string;
    /** 发送输入状态的应用目的地 */
    typingStatus: string;
  };
  /** 连接配置 */
  connection: {
    /** 发送心跳间隔(ms) */
    heartbeatOutgoing: number;
    /** 接收心跳间隔(ms) */
    heartbeatIncoming: number;
    /** 最大重连次数 */
    maxReconnectAttempts: number;
    /** 初始重连间隔(ms) */
    initialReconnectInterval: number;
  };
}

/**
 * 默认WebSocket配置
 */
export const defaultWebSocketConfig: WebSocketConfig = {
  baseUrl: 'ws://localhost:8080', // 默认的WebSocket服务器地址，可在运行时被环境变量覆盖
  messageEndpointPrefix: '/api/ws/messages',
  destinations: {
    userMessages: '/user/{userId}/queue/messages',
    conversationUpdates: '/user/{userId}/queue/conversation-updates',
    userStatus: '/user/{userId}/queue/user-status',
    typing: '/topic/typing',
    sendMessage: '/app/message.send',
    readReceipt: '/app/message.read_receipt',
    typingStatus: '/app/message.typing_status'
  },
  connection: {
    heartbeatOutgoing: 20000,
    heartbeatIncoming: 20000,
    maxReconnectAttempts: 5,
    initialReconnectInterval: 1000
  }
};

/**
 * 创建WebSocket服务器URL
 * @param config WebSocket配置
 * @param userId 用户ID
 * @returns 完整的WebSocket服务器URL
 */
export function createWebSocketUrl(config: WebSocketConfig, userId: string): string {
  // 优先使用专门的WebSocket环境变量
  if (import.meta.env.VITE_WEBSOCKET_URL) {
    // 如果已经提供了完整的WebSocket URL，则直接使用它
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;
    // 确保URL不以斜杠结尾
    const cleanWsUrl = wsUrl.endsWith('/') ? wsUrl.slice(0, -1) : wsUrl;
    // 确保路径以斜杠开头
    const cleanEndpoint = config.messageEndpointPrefix.startsWith('/') ? config.messageEndpointPrefix : `/${config.messageEndpointPrefix}`;
    
    return `${cleanWsUrl}${cleanEndpoint}/${userId}`;
  }
  
  // 否则，根据协议和主机构建WebSocket URL
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsHost = import.meta.env.VITE_API_BASE_URL || 'localhost:8080';
  
  // 移除协议前缀并构建基础URL
  let hostWithoutProtocol = wsHost.replace('http://', '').replace('https://', '');
  // 确保主机名不以斜杠结尾
  hostWithoutProtocol = hostWithoutProtocol.endsWith('/') ? hostWithoutProtocol.slice(0, -1) : hostWithoutProtocol;
  
  const baseUrl = config.baseUrl || `${wsProtocol}//${hostWithoutProtocol}`;
  
  // 确保路径以斜杠开头
  const cleanEndpoint = config.messageEndpointPrefix.startsWith('/') ? config.messageEndpointPrefix : `/${config.messageEndpointPrefix}`;
  
  // 构建完整的WebSocket URL
  return `${baseUrl}${cleanEndpoint}/${userId}`;
}

/**
 * 格式化消息目的地
 * @param template 目的地模板
 * @param params 模板参数
 * @returns 格式化后的目的地字符串
 */
export function formatDestination(template: string, params: Record<string, string>): string {
  let result = template;
  
  // 替换模板中的参数
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  
  return result;
}