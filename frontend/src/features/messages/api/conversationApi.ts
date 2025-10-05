/**
 * 对话相关的API调用函数
 */
// 导入axios库，用于发送HTTP请求
import { get, post, del } from '@/lib/api';
// 导入基础响应数据传输对象（DTO）
import { BaseResponse } from '@/types';

// 导入对话操作相关的数据传输对象（DTO）
import {
  GetConversationsRequest,
  ExtendedConversationListResponse,
  MessageListResponse,
  DeleteConversationRequest,
  DeleteMultipleConversationsRequest,
  ClearConversationHistoryRequest
} from '../types/dto';

/** 获取用户的对话列表 */
export const getConversations = async (dto: GetConversationsRequest): Promise<BaseResponse<ExtendedConversationListResponse>> => {
  return post<BaseResponse<ExtendedConversationListResponse>>(`/api/messages/conversations`, dto);
};

/**
 * 获取指定对话的消息列表
 * @param dto 获取消息列表的数据
 */
export const getMessagesByConversationId = async (dto: {
  conversationId: string;
  limit?: number;
  offset?: number;
}): Promise<BaseResponse<MessageListResponse>> => {
  return get<BaseResponse<MessageListResponse>>(`/api/messages/${dto.conversationId}`, {
    params: {
      limit: dto.limit,
      offset: dto.offset
    }
  });
};

/** 删除单个对话 */
export const deleteConversationWithDto = async (dto: DeleteConversationRequest): Promise<BaseResponse> => {
  return del<BaseResponse>('/api/messages/conversation', {
    params: {
      conversationId: dto.conversationId,
      userId: dto.userId,
      deleteForAll: dto.deleteForAll
    }
  });
};

/** 批量删除对话 */
export const deleteMultipleConversations = async (dto: DeleteMultipleConversationsRequest): Promise<BaseResponse> => {
  return del<BaseResponse>('/api/messages/conversations/batch', {
    params: {
      conversationIds: dto.conversationIds.join(','),
      userId: dto.userId
    }
  });
};

/** 清除对话历史记录 */
export const clearConversationHistory = async (dto: ClearConversationHistoryRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/conversation/clear', {
    conversationId: dto.conversationId,
    userId: dto.userId
  });
};