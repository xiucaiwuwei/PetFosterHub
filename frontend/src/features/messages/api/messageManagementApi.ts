/**
 * 消息管理相关的API调用函数
 */
// 导入axios库，用于发送HTTP请求
import { post, del } from '@/lib/api';
// 导入基础响应数据传输对象（DTO）
import { BaseResponse } from '@/types';

// 导入消息管理相关的数据传输对象（DTO）
import {
  MarkMessagesAsReadRequest,
  MarkAsReadRequest,
  MarkAsUnreadRequest,
  BlockUserRequest,
  UnblockUserRequest
} from '../types/dto';
// 导入删除操作相关的数据传输对象（DTO）
import { DeleteMessageRequest, DeleteMultipleMessagesRequest, RecallMessageRequest } from '../types/dto';

/**
 * 屏蔽用户
 */
export const blockUser = async (dto: BlockUserRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/block', dto);
};

/**
 * 取消屏蔽用户
 */
export const unblockUser = async (dto: UnblockUserRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/unblock', dto);
};

/**
 * 标记消息为已读
 */
export const markAsRead = async (dto: MarkAsReadRequest): Promise<BaseResponse> => {
  return post<BaseResponse>(`/api/messages/${dto.conversationId}/read`, dto);
};

/**
 * 标记消息为未读
 */
export const markAsUnread = async (dto: MarkAsUnreadRequest): Promise<BaseResponse> => {
  return post<BaseResponse>(`/api/messages/${dto.conversationId}/unread`, dto);
};

/**
 * 批量标记消息为已读
 */
export const markMultipleAsRead = async (dto: MarkMessagesAsReadRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/mark-read', dto);
};

/**
 * 删除多条消息
 */
export const deleteMultipleMessages = async (dto: DeleteMultipleMessagesRequest): Promise<boolean> => {
  return del<boolean>('/api/messages/batch', {
    params: {
      conversationId: dto.conversationId,
      messageIds: dto.messageIds.join(','),
      userId: dto.userId
    }
  });
};

/**
 * 删除单条消息
 */
export const deleteMessage = async (dto: DeleteMessageRequest): Promise<boolean> => {
  return del<boolean>('/api/messages', {
    params: {
      messageId: dto.messageId,
      userId: dto.userId
    }
  });
};

/**
 * 转发消息
 * @param messageId 要转发的消息ID
 * @param receiverIds 接收者用户ID列表
 * @param currentUserId 当前用户ID
 */
export const forwardMessage = async (messageId: string, receiverIds: string[], currentUserId: string): Promise<boolean> => {
  return post<boolean>('/api/messages/forward', {
    messageId,
    receiverIds,
    currentUserId
  });
};

/**
 * 撤回消息
 */
export const recallMessage = async (dto: RecallMessageRequest): Promise<boolean> => {
  return post<boolean>('/api/messages/recall', {
    messageId: dto.messageId,
    userId: dto.userId
  });
};