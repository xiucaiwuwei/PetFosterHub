/** 消息响应数据传输对象集合 */

/** 基础消息响应接口 - 包含所有消息响应的共同字段 */
export interface BaseMessageResponse {
  id: string; // 消息ID
  conversationId: string; // 对话ID
  senderId: string; // 发送者ID
  receiverId: string; // 接收者ID
  createdAt: string; // 创建时间
  updatedAt?: string; // 更新时间(可选)
  isRead: boolean; // 是否已读
  status: 'sent' | 'delivered' | 'read' | 'failed'; // 消息状态
}

/** 带文件的消息响应基础接口 */
export interface FileBasedMessageResponse extends BaseMessageResponse {
  fileUrl: string; // 文件URL
  caption?: string; // 文件说明文字(可选)
  thumbnailUrl?: string; // 缩略图URL(可选)
}

/** 文本消息响应数据传输对象 */
export interface TextMessageResponse extends BaseMessageResponse {
  content: string; // 消息内容
}

/** 图片消息响应数据传输对象 */
export interface ImageMessageResponse extends FileBasedMessageResponse {
  width?: number; // 图片宽度(可选)
  height?: number; // 图片高度(可选)
}

/** 视频消息响应数据传输对象 */
export interface VideoMessageResponse extends FileBasedMessageResponse {
  duration?: number; // 视频时长(秒，可选)
  width?: number; // 视频宽度(可选)
  height?: number; // 视频高度(可选)
}

/** 文件消息响应数据传输对象 */
export interface FileMessageResponse extends FileBasedMessageResponse {
  fileName: string; // 文件名
  fileSize: number; // 文件大小(字节)
  fileType: string; // 文件类型(MIME类型)
}

/** 音频消息响应数据传输对象 */
export interface AudioMessageResponse extends FileBasedMessageResponse {
  duration: number; // 音频时长(秒)
  waveform?: number[]; // 音频波形数据(可选)
}

/** 位置消息响应数据传输对象 */
export interface LocationMessageResponse extends BaseMessageResponse {
  latitude: number; // 纬度
  longitude: number; // 经度
  name?: string; // 位置名称(可选)
  address?: string; // 位置地址(可选)
  mapUrl?: string; // 地图URL(可选)
}

/** 联系人消息响应数据传输对象 */
export interface ContactMessageResponse extends BaseMessageResponse {
  contactUserId: string; // 联系人用户ID
  contactName: string; // 联系人姓名
  contactAvatar?: string; // 联系人头像URL(可选)
  contactPhone?: string; // 联系人电话(可选)
}

/** 贴纸消息响应数据传输对象 */
export interface StickerMessageResponse extends BaseMessageResponse {
  stickerUrl: string; // 贴纸ID或URL
  stickerPackId?: string; // 贴纸包ID(可选)
  stickerName?: string; // 贴纸名称(可选)
}

/** 系统消息响应数据传输对象 */
export interface SystemMessageResponse extends BaseMessageResponse {
  content: string; // 系统消息内容
  systemType?: string; // 系统消息子类型(可选)
  relatedId?: string; // 关联的数据ID(可选)
}

/** 媒体消息响应联合类型 */
export type MediaMessageResponse =
  | ImageMessageResponse
  | VideoMessageResponse
  | FileMessageResponse
  | AudioMessageResponse
  | LocationMessageResponse
  | ContactMessageResponse
  | StickerMessageResponse
  | SystemMessageResponse;

/** 所有消息响应联合类型 */
export type MessageResponse =
  | TextMessageResponse
  | MediaMessageResponse;

/** 对话列表项响应接口 */
export interface ConversationListItemResponse {
  id: string; // 对话ID
  lastMessage?: MessageResponse; // 最后一条消息(可选)
  unreadCount: number; // 未读消息数
  participants: Array<{
    id: string; // 用户ID
    name: string; // 用户名称
    avatar?: string; // 用户头像URL(可选)
    isOnline?: boolean; // 是否在线(可选)
  }>;
  updatedAt: string; // 最后更新时间
  isGroup?: boolean; // 是否为群组对话(可选)
  groupName?: string; // 群组名称(可选)
  groupAvatar?: string; // 群组头像URL(可选)
}

/** 对话列表响应接口 */
export interface ConversationListResponse {
  conversations: ConversationListItemResponse[]; // 对话列表
  total: number; // 总数量
  page?: number; // 当前页码(可选)
  pageSize?: number; // 每页数量(可选)
}

/** 消息列表响应接口 */
export interface MessageListResponse {
  messages: MessageResponse[]; // 消息列表
  total: number; // 总数量
  hasMore: boolean; // 是否有更多消息
  nextCursor?: string; // 下一页游标(可选)
}

/** 类型保护函数 */

export function isTextMessageResponse(response: MessageResponse): response is TextMessageResponse {
  return 'content' in response && !('fileUrl' in response) && !('stickerUrl' in response);
}

export function isImageMessageResponse(response: MediaMessageResponse): response is ImageMessageResponse {
  return 'fileUrl' in response && 'width' in response && 'height' in response;
}

export function isVideoMessageResponse(response: MediaMessageResponse): response is VideoMessageResponse {
  return 'fileUrl' in response && 'duration' in response && 'width' in response && 'height' in response;
}

export function isFileMessageResponse(response: MediaMessageResponse): response is FileMessageResponse {
  return 'fileUrl' in response && 'fileName' in response && 'fileSize' in response && 'fileType' in response;
}

export function isAudioMessageResponse(response: MediaMessageResponse): response is AudioMessageResponse {
  return 'fileUrl' in response && 'duration' in response && !('width' in response);
}

export function isLocationMessageResponse(response: MediaMessageResponse): response is LocationMessageResponse {
  return 'latitude' in response && 'longitude' in response;
}

export function isContactMessageResponse(response: MediaMessageResponse): response is ContactMessageResponse {
  return 'contactUserId' in response && 'contactName' in response;
}

export function isStickerMessageResponse(response: MediaMessageResponse): response is StickerMessageResponse {
  return 'stickerUrl' in response && !('fileUrl' in response);
}

export function isSystemMessageResponse(response: MediaMessageResponse): response is SystemMessageResponse {
  return 'content' in response && !('fileUrl' in response) && !('stickerUrl' in response);
}

/** 获取消息类型的辅助函数 */
export function getMessageType(response: MessageResponse): string {
  if (isTextMessageResponse(response)) return 'text';
  if (isImageMessageResponse(response)) return 'image';
  if (isVideoMessageResponse(response)) return 'video';
  if (isFileMessageResponse(response)) return 'file';
  if (isAudioMessageResponse(response)) return 'audio';
  if (isLocationMessageResponse(response)) return 'location';
  if (isContactMessageResponse(response)) return 'contact';
  if (isStickerMessageResponse(response)) return 'sticker';
  if (isSystemMessageResponse(response)) return 'system';
  return 'unknown';
}