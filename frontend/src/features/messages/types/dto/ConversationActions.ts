/**
 * 对话操作相关的数据传输对象
 */

import { BaseRequest } from "@/types";
import { ConversationListItemResponse } from './sendMessage/MessageResponse';

/** 获取用户对话列表的请求数据传输对象 */
export interface GetConversationsRequest extends BaseRequest {
  userId: string; /** 用户ID */
  page?: number; /** 页码，可选，用于分页查询 */
  pageSize?: number; /** 每页数量，可选，用于分页查询 */
  onlyUnread?: boolean; /** 是否只返回未读对话，可选 */
  includeGroups?: boolean; /** 是否包含群组对话，可选 */
  sortBy?: 'recent' | 'alphabetical'; /** 排序方式，可选，如 'recent'（按最近更新）或 'alphabetical'（按字母顺序） */
}

/** 用户对话列表的扩展响应接口（包含额外字段） */
export interface ExtendedConversationListResponse {
  conversations: ConversationListItemResponse[]; /** 对话列表数据 */
  total: number; /** 总对话数量 */
  page?: number; /** 当前页码 */
  pageSize?: number; /** 每页数量 */
  hasMore?: boolean; /** 是否还有更多数据 */
  totalUnreadCount?: number; /** 总未读消息数 */
}

/** 转发消息的请求数据传输对象 */
export interface ForwardMessageRequest extends BaseRequest {
  messageId: string; // 要转发的消息ID
  receiverIds: string[]; // 接收者用户ID列表
  currentUserId: string; // 当前用户ID
}