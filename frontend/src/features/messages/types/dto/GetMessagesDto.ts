/**
 * 获取消息列表的数据传输对象
 */
export interface GetMessagesDto {
  conversationId: string;
  limit?: number;
  offset?: number;
}