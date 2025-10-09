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
  try {
    // 移除字符串前缀，仅保留数字部分并转换为Long类型
    const numericUserId = dto.userId.replace(/[^0-9]/g, '');
    
    // 后端接口目前只接受userId作为路径参数，不支持其他查询参数
    const response = await get<BaseResponse<any>>(`/api/messages/conversations/${numericUserId}`);
    
    // 适配后端返回的简单消息列表，转换为前端期望的ExtendedConversationListResponse格式
    return {
      success: response.success,
      timestamp: response.timestamp,
      message: response.message,
      data: {
        conversations: response.data || [],
        total: response.data?.length || 0,
        totalUnreadCount: 0
      }
    };
  } catch (error) {
    console.error('获取对话列表失败:', error);
    throw error;
  }
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