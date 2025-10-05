/**
 * 消息操作相关的数据传输对象
 */
import { BaseRequest } from "@/types";

/** 批量标记消息为已读的请求数据传输对象 */
export interface MarkMessagesAsReadRequest extends BaseRequest {
  conversationId: string; // 对话ID
  messageIds: string[]; // 要标记为已读的消息ID列表
  userId: string; // 用户ID
}

/** 标记消息为已读的请求数据传输对象 */
export interface MarkAsReadRequest extends BaseRequest {
  conversationId: string; // 对话ID
  userId: string; // 用户ID
}

/** 标记消息为未读的请求数据传输对象 */
export interface MarkAsUnreadRequest extends BaseRequest {
  conversationId: string; // 对话ID
  userId: string; // 用户ID
}

/** 批量标记消息为未读的请求数据传输对象 */
export interface MarkMultipleAsUnreadRequest extends BaseRequest {
  conversationId: string; // 对话ID
  messageIds: string[]; // 要标记为未读的消息ID列表
  userId: string; // 用户ID
}