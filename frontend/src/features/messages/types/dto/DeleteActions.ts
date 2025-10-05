/**
 * 删除操作相关的数据传输对象
 */
import { BaseRequest } from "@/types";

/** 删除单条消息的请求数据传输对象 */
export interface DeleteMessageRequest extends BaseRequest {
  messageId: string; // 要删除的消息ID
  conversationId: string; // 对话ID
  userId: string; // 用户ID
}

/** 批量删除消息的请求数据传输对象 */
export interface DeleteMultipleMessagesRequest extends BaseRequest {
  conversationId: string; // 对话ID
  messageIds: string[]; // 要删除的消息ID列表
  userId: string; // 用户ID
}

/** 撤回消息的请求数据传输对象 */
export interface RecallMessageRequest extends BaseRequest {
  messageId: string; // 要撤回的消息ID
  userId: string; // 用户ID
  reason?: string; // 撤回原因（可选）
}

/** 删除对话的请求数据传输对象 */
export interface DeleteConversationRequest extends BaseRequest {
  conversationId: string; // 对话ID
  userId: string; // 用户ID
  deleteForAll?: boolean; // 是否为所有参与者删除（可选）
}

/** 批量删除对话的请求数据传输对象 */
export interface DeleteMultipleConversationsRequest extends BaseRequest {
  conversationIds: string[]; // 要删除的对话ID列表
  userId: string; // 用户ID
}

/** 清空对话历史的请求数据传输对象 */
export interface ClearConversationHistoryRequest extends BaseRequest {
  conversationId: string; // 对话ID
  userId: string; // 用户ID
  beforeTimestamp?: number; // 只清空指定时间戳之前的消息（可选）
}