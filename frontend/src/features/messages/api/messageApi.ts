/**
 * 消息API调用函数
 */
import {
  GetMessagesDto,
  ImageMessageRequest,
  VideoMessageRequest,
  FileMessageRequest,
  AudioMessageRequest,
  LocationMessageRequest,
  ContactMessageRequest,
  StickerMessageRequest,
  SystemMessageRequest,
  MarkMessagesAsReadRequest,
  MessageResponse,
  ConversationListItemResponse,
  MessageListResponse,
  FileMessageResponse,
  AudioMessageResponse,
  LocationMessageResponse,
  ContactMessageResponse,
  StickerMessageResponse,
  SystemMessageResponse,
  TextMessageRequest,
  ImageMessageResponse,
  TextMessageResponse,
  VideoMessageResponse,
  BlockUserRequest,
  BlockedUsersResponse,
  UnblockUserRequest,
  MarkAsReadRequest,
  MarkAsUnreadRequest
} from '../types/dto';
import { get, post, del } from '@/lib/api/axios';
import { BaseResponse } from '@/types';
import { MessageType } from '../types/enums';

/**
 * 获取用户的对话列表
 * @param userId 用户ID
 */
export const getConversations = async (userId: string): Promise<ConversationListItemResponse[]> => {
  return get<ConversationListItemResponse[]>(`/api/messages/conversations/${userId}`);
};


/** 发送文本消息 */
export const sendTextMessage = async (dto: TextMessageRequest): Promise<BaseResponse<TextMessageResponse>> => {
  return post<BaseResponse<TextMessageResponse>>('/api/messages/send', dto);
};

/** 发送图片消息 */
export const sendImageMessage = async (dto: ImageMessageRequest): Promise<BaseResponse<ImageMessageResponse>> => {
  return post<BaseResponse<ImageMessageResponse>>('/api/messages/send-image', dto);
};

/** 发送视频消息 */
export const sendVideoMessage = async (dto: VideoMessageRequest): Promise<BaseResponse<VideoMessageResponse>> => {
  return post<BaseResponse<VideoMessageResponse>>('/api/messages/send-video', dto);
};

/** 发送文件消息 */
export const sendFileMessage = async (dto: FileMessageRequest): Promise<BaseResponse<FileMessageResponse>> => {
  return post<BaseResponse<FileMessageResponse>>('/api/messages/send-file', dto);
};

/** 发送音频消息 */
export const sendAudioMessage = async (dto: AudioMessageRequest): Promise<BaseResponse<AudioMessageResponse>> => {
  return post<BaseResponse<AudioMessageResponse>>('/api/messages/send-audio', dto);
};

/** 发送位置消息 */
export const sendLocationMessage = async (dto: LocationMessageRequest): Promise<BaseResponse<LocationMessageResponse>> => {
  return post<BaseResponse<LocationMessageResponse>>('/api/messages/send-location', dto);
};

/** 发送联系人消息 */
export const sendContactMessage = async (dto: ContactMessageRequest): Promise<BaseResponse<ContactMessageResponse>> => {
  return post<BaseResponse<ContactMessageResponse>>('/api/messages/send-contact', dto);
};

/** 发送贴纸消息 */
export const sendStickerMessage = async (dto: StickerMessageRequest): Promise<BaseResponse<StickerMessageResponse>> => {
  return post<BaseResponse<StickerMessageResponse>>('/api/messages/send-sticker', dto);
};

/** 发送系统消息 */
export const sendSystemMessage = async (dto: SystemMessageRequest): Promise<BaseResponse<SystemMessageResponse>> => {
  return post<BaseResponse<SystemMessageResponse>>('/api/messages/send-system', dto);
};

/** 根据消息类型发送对应的消息 */
export const sendMessageByType = async (
  messageType: MessageType,
  data: any
): Promise<BaseResponse<MessageResponse>> => {
  switch (messageType) {
    case MessageType.Text:
      const response = await sendTextMessage(data as TextMessageRequest);
      return response;
    case MessageType.Image:
      const imageResponse = await sendImageMessage(data as ImageMessageRequest);
      return imageResponse;
    case MessageType.Video:
      const videoResponse = await sendVideoMessage(data as VideoMessageRequest);
      return videoResponse;
    case MessageType.File:
      const fileResponse = await sendFileMessage(data as FileMessageRequest);
      return fileResponse;
    case MessageType.Audio:
      const audioResponse = await sendAudioMessage(data as AudioMessageRequest);
      return audioResponse;
    case MessageType.Location:
      const locationResponse = await sendLocationMessage(data as LocationMessageRequest);
      return locationResponse;
    case MessageType.Contact:
      const contactResponse = await sendContactMessage(data as ContactMessageRequest);
      return contactResponse;
    case MessageType.Sticker:
      const stickerResponse = await sendStickerMessage(data as StickerMessageRequest);
      return stickerResponse;
    case MessageType.System:
      const systemResponse = await sendSystemMessage(data as SystemMessageRequest);
      return systemResponse;
    default:
      throw new Error(`不支持的消息类型: ${messageType}`);
  }
};

/** 屏蔽用户 */
export const blockUser = async (dto: BlockUserRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/block', dto);
};

/** 取消屏蔽用户 */
export const unblockUser = async (dto: UnblockUserRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/unblock', dto);
};

/** 标记消息为已读 */
export const markAsRead = async (dto: MarkAsReadRequest): Promise<BaseResponse> => {
  return post<BaseResponse>(`/api/messages/${dto.conversationId}/read`, dto);
};

/** 标记消息为未读 */
export const markAsUnread = async (dto: MarkAsUnreadRequest): Promise<BaseResponse> => {
  return post<BaseResponse>(`/api/messages/${dto.conversationId}/unread`, dto);
};

/**
 * 批量标记消息为已读
 * @param dto 批量标记已读请求数据
 */
export const markMultipleAsRead = async (dto: MarkMessagesAsReadRequest): Promise<BaseResponse> => {
  return post<BaseResponse>('/api/messages/mark-read', dto);
};





/**
 * 删除对话
 * @param conversationId 对话ID
 * @param userId 用户ID
 */
export const deleteConversation = async (conversationId: string, userId: string): Promise<boolean> => {
  return del<boolean>(`/api/messages/conversations/${conversationId}`, {
    params: { userId }
  });
};

/**
 * 获取指定对话的消息列表
 * @param dto 获取消息列表的数据
 */
export const getMessagesByConversationId = async (dto: GetMessagesDto): Promise<MessageListResponse> => {
  return get<MessageListResponse>(`/api/messages/${dto.conversationId}`, {
    params: {
      limit: dto.limit,
      offset: dto.offset
    }
  });
};







/**
 * 批量删除消息
 * @param conversationId 对话ID
 * @param messageIds 消息ID列表
 * @param userId 用户ID
 */
export const deleteMultipleMessages = async (conversationId: string, messageIds: string[], userId: string): Promise<boolean> => {
  return del<boolean>('/api/messages/batch', {
    params: {
      conversationId,
      messageIds: messageIds.join(','),
      userId
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
 * @param messageId 要撤回的消息ID
 * @param userId 用户ID
 */
export const recallMessage = async (messageId: string, userId: string): Promise<boolean> => {
  return post<boolean>('/api/messages/recall', {
    messageId,
    userId
  });
};

/**
 * 获取消息统计信息
 * @param userId 用户ID
 */
export const getMessageStatistics = async (userId: string): Promise<{
  totalUnread: number;
  totalConversations: number;
  recentUnreadConversations: number;
}> => {
  return get<{
    totalUnread: number;
    totalConversations: number;
    recentUnreadConversations: number;
  }>(`/api/messages/statistics/${userId}`);
};

/**
 * 获取已屏蔽用户列表
 * @param userId 用户ID
 */
export const getBlockedUsers = async (userId: string): Promise<string[]> => {
  return get<string[]>(`/api/messages/blocked/${userId}`);
};

/**
 * 检查是否已屏蔽用户
 * @param userId 当前用户ID
 * @param targetUserId 目标用户ID
 */
export const isUserBlocked = async (userId: string, targetUserId: string): Promise<boolean> => {
  return get<boolean>(`/api/messages/blocked/check`, {
    params: {
      userId,
      targetUserId
    }
  });
};
