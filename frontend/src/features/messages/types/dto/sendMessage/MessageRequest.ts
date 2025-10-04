/** 消息请求数据传输对象集合 */
import { BaseRequest } from '@/types';

/** 基础消息请求接口 - 包含所有消息请求的共同字段 */
export interface BaseMessageRequest extends BaseRequest {
  conversationId: string; // 对话ID
  senderId: string; // 发送者ID
  receiverId: string; // 接收者ID
}

/** 带文件的消息请求基础接口 */
export interface FileBasedMessageRequest extends BaseMessageRequest {
  fileUrl: string; // 文件URL
  caption?: string; // 文件说明文字(可选)
}

/** 发送文本消息的请求数据传输对象 */
export interface TextMessageRequest extends BaseMessageRequest {
  content: string; // 消息内容
}

/** 发送图片消息的请求数据传输对象 */
export interface ImageMessageRequest extends FileBasedMessageRequest {
  width?: number; // 图片宽度(可选)
  height?: number; // 图片高度(可选)
}

/** 发送视频消息的请求数据传输对象 */
export interface VideoMessageRequest extends FileBasedMessageRequest {
  duration?: number; // 视频时长(秒，可选)
  width?: number; // 视频宽度(可选)
  height?: number; // 视频高度(可选)
}

/** 发送文件消息的请求数据传输对象 */
export interface FileMessageRequest extends FileBasedMessageRequest {
  fileName: string; // 文件名
  fileSize: number; // 文件大小(字节)
  fileType: string; // 文件类型(MIME类型)
}

/** 发送音频消息的请求数据传输对象 */
export interface AudioMessageRequest extends FileBasedMessageRequest {
  duration: number; // 音频时长(秒)
}

/** 发送位置消息的请求数据传输对象 */
export interface LocationMessageRequest extends BaseMessageRequest {
  latitude: number; // 纬度
  longitude: number; // 经度
  name?: string; // 位置名称(可选)
  address?: string; // 位置地址(可选)
}

/** 发送联系人消息的请求数据传输对象 */
export interface ContactMessageRequest extends BaseMessageRequest {
  contactUserId: string; // 联系人用户ID
  contactName: string; // 联系人姓名
  contactAvatar?: string; // 联系人头像URL(可选)
}

/** 发送贴纸消息的请求数据传输对象 */
export interface StickerMessageRequest extends BaseMessageRequest {
  stickerUrl: string; // 贴纸ID或URL
  stickerPackId?: string; // 贴纸包ID(可选)
}

/** 发送系统消息的请求数据传输对象 */
export interface SystemMessageRequest {
  conversationId: string; // 对话ID
  receiverId: string; // 接收者ID
  content: string; // 系统消息内容
  systemType?: string; // 系统消息子类型(可选)
  relatedId?: string; // 关联的数据ID(可选)
}

/** 媒体消息请求联合类型 */
export type MediaMessageRequest =
  | ImageMessageRequest
  | VideoMessageRequest
  | FileMessageRequest
  | AudioMessageRequest
  | LocationMessageRequest
  | ContactMessageRequest
  | StickerMessageRequest
  | SystemMessageRequest;

/** 所有消息请求联合类型 */
export type MessageRequest =
  | TextMessageRequest
  | MediaMessageRequest;

/** 类型保护函数 */

export function isImageMessageRequest(request: MediaMessageRequest): request is ImageMessageRequest {
  return 'width' in request && 'height' in request;
}

export function isVideoMessageRequest(request: MediaMessageRequest): request is VideoMessageRequest {
  return 'duration' in request && 'width' in request && 'height' in request;
}

export function isFileMessageRequest(request: MediaMessageRequest): request is FileMessageRequest {
  return 'fileName' in request && 'fileSize' in request && 'fileType' in request;
}

export function isAudioMessageRequest(request: MediaMessageRequest): request is AudioMessageRequest {
  return 'duration' in request && !('width' in request);
}

export function isLocationMessageRequest(request: MediaMessageRequest): request is LocationMessageRequest {
  return 'latitude' in request && 'longitude' in request;
}

export function isContactMessageRequest(request: MediaMessageRequest): request is ContactMessageRequest {
  return 'contactUserId' in request && 'contactName' in request;
}

export function isStickerMessageRequest(request: MediaMessageRequest): request is StickerMessageRequest {
  return 'stickerUrl' in request && !('caption' in request);
}

export function isSystemMessageRequest(request: MediaMessageRequest): request is SystemMessageRequest {
  return 'content' in request && !('fileUrl' in request) && !('stickerUrl' in request);
}