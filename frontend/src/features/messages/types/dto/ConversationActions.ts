/**
 * 对话操作相关的数据传输对象
 */

import { BaseRequest } from "@/types";

/** 删除对话的请求数据传输对象 */
export interface DeleteConversationRequest extends BaseRequest {
  conversationId: string; // 对话ID
  userId: string; // 用户ID
}

/** 转发消息的请求数据传输对象 */
export interface ForwardMessageRequest extends BaseRequest {
  messageId: string; // 要转发的消息ID
  receiverIds: string[]; // 接收者用户ID列表
  currentUserId: string; // 当前用户ID
}