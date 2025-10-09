/**
 * WebSocket模块主入口
 * 统一导出WebSocket相关的服务、Hook和类型定义
 */

// 服务
export { WebSocketService } from './services/WebSocketService';
export { wsServiceManager } from './services/WebSocketService';

// Hook
export { useWebSocket } from './hooks/useWebSocket';
export type { UseWebSocketReturn } from './hooks/useWebSocket';

// 配置
export { defaultWebSocketConfig } from './config';
export type { WebSocketConfig } from './config';
export { createWebSocketUrl, formatDestination } from './config';

// 类型定义
export type { WebSocketEventHandler } from './types/common';
export { ConnectionStatus, WebSocketErrorType, TypingStatus } from './types/common';
export type { BaseMessage, TextMessageContent, ImageMessageContent, SystemMessageContent } from './types/common';
export { WebSocketError } from './types/common';

// 实体类型（从业务模块导入）
export type { Message } from '@/features/messages/types/entity/Message';
export type { Conversation } from '@/features/messages/types/entity/Conversation';