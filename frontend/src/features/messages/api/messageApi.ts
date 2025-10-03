/**
 * 消息API调用函数
 */
import { GetMessagesDto, SendMessageDto } from '../types/dto';
import { Message } from '../types/entity/Message';
import { Conversation } from '../types/entity/Conversation';

// 由于当前使用mock数据，这里定义API调用函数的接口
// 实际项目中，这些函数将使用fetch或axios等HTTP客户端调用后端API

/**
 * 获取用户的对话列表
 * @param userId 用户ID
 * @returns 对话列表Promise
 */
export const getConversations = async (userId: string): Promise<Conversation[]> => {
  // 实际项目中，这里应该是一个API调用
  // 例如: return await httpClient.get<Conversation[]>(`/api/messages/conversations/${userId}`);
  
  // 目前使用mock数据
  const { getConversations: mockGetConversations } = await import('@/features/messages/mocks/messages');
  return mockGetConversations(userId);
};

/**
 * 获取指定对话的消息列表
 * @param dto 获取消息列表的数据传输对象
 * @returns 消息列表Promise
 */
export const getMessagesByConversationId = async (dto: GetMessagesDto): Promise<Message[]> => {
  // 实际项目中，这里应该是一个API调用
  // 例如: return await httpClient.get<Message[]>(`/api/messages/${dto.conversationId}`, { params: { limit: dto.limit, offset: dto.offset } });
  
  // 目前使用mock数据
  const { getMessagesByConversationId: mockGetMessagesByConversationId } = await import('@/features/messages/mocks/messages');
  return mockGetMessagesByConversationId(dto.conversationId);
};

/**
 * 发送消息
 * @param dto 发送消息的数据传输对象
 * @returns 发送的消息Promise
 */
export const sendMessage = async (dto: SendMessageDto): Promise<Message> => {
  // 实际项目中，这里应该是一个API调用
  // 例如: return await httpClient.post<Message>(`/api/messages/send`, dto);
  
  // 目前使用mock数据
  const { sendMessage: mockSendMessage } = await import('@/features/messages/mocks/messages');
  const currentUserId = 'u4'; // 模拟当前登录用户ID
  return mockSendMessage(dto.conversationId, currentUserId, dto.receiverId, dto.content);
};

/**
 * 标记消息为已读
 * @param conversationId 对话ID
 * @param userId 用户ID
 * @returns 操作结果Promise
 */
export const markAsRead = async (conversationId: string, userId: string): Promise<boolean> => {
  // 实际项目中，这里应该是一个API调用
  // 例如: return await httpClient.post<boolean>(`/api/messages/${conversationId}/read`, { userId });
  
  // 目前使用mock数据
  const { markAsRead: mockMarkAsRead } = await import('@/features/messages/mocks/messages');
  mockMarkAsRead(conversationId, userId);
  return true;
};