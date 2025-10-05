/**
 * 消息发送相关的API调用函数
 */
// 导入axios库，用于发送HTTP请求
import { post } from '@/lib/api';
// 导入基础响应数据传输对象（DTO）
import { BaseResponse } from '@/types';

// 导入文本消息相关的数据传输对象（DTO）
import { TextMessageRequest, TextMessageResponse } from '../types/dto';
// 导入图片消息相关的数据传输对象（DTO）
import { ImageMessageRequest, ImageMessageResponse } from '../types/dto';
// 导入视频消息相关的数据传输对象（DTO）
import { VideoMessageRequest, VideoMessageResponse } from '../types/dto';
// 导入文件消息相关的数据传输对象（DTO）
import { FileMessageRequest, FileMessageResponse } from '../types/dto';
// 导入音频消息相关的数据传输对象（DTO）
import { AudioMessageRequest, AudioMessageResponse } from '../types/dto';
// 导入位置消息相关的数据传输对象（DTO）
import { LocationMessageRequest, LocationMessageResponse } from '../types/dto';
// 导入联系人消息相关的数据传输对象（DTO）
import { ContactMessageRequest, ContactMessageResponse } from '../types/dto';
// 导入贴纸消息相关的数据传输对象（DTO）
import { StickerMessageRequest, StickerMessageResponse } from '../types/dto';
// 导入系统消息相关的数据传输对象（DTO）
import { SystemMessageRequest, SystemMessageResponse } from '../types/dto';

/**
 * 发送文本消息
 */
export const sendTextMessage = async (dto: TextMessageRequest): Promise<BaseResponse<TextMessageResponse>> => {
  return post<BaseResponse<TextMessageResponse>>('/api/messages/send', dto);
};

/**
 * 发送图片消息
 */
export const sendImageMessage = async (dto: ImageMessageRequest): Promise<BaseResponse<ImageMessageResponse>> => {
  return post<BaseResponse<ImageMessageResponse>>('/api/messages/send-image', dto);
};

/**
 * 发送视频消息
 */
export const sendVideoMessage = async (dto: VideoMessageRequest): Promise<BaseResponse<VideoMessageResponse>> => {
  return post<BaseResponse<VideoMessageResponse>>('/api/messages/send-video', dto);
};

/**
 * 发送文件消息
 */
export const sendFileMessage = async (dto: FileMessageRequest): Promise<BaseResponse<FileMessageResponse>> => {
  return post<BaseResponse<FileMessageResponse>>('/api/messages/send-file', dto);
};

/**
 * 发送音频消息
 */
export const sendAudioMessage = async (dto: AudioMessageRequest): Promise<BaseResponse<AudioMessageResponse>> => {
  return post<BaseResponse<AudioMessageResponse>>('/api/messages/send-audio', dto);
};

/**
 * 发送位置消息
 */
export const sendLocationMessage = async (dto: LocationMessageRequest): Promise<BaseResponse<LocationMessageResponse>> => {
  return post<BaseResponse<LocationMessageResponse>>('/api/messages/send-location', dto);
};

/**
 * 发送联系人消息
 */
export const sendContactMessage = async (dto: ContactMessageRequest): Promise<BaseResponse<ContactMessageResponse>> => {
  return post<BaseResponse<ContactMessageResponse>>('/api/messages/send-contact', dto);
};

/**
 * 发送贴纸消息
 */
export const sendStickerMessage = async (dto: StickerMessageRequest): Promise<BaseResponse<StickerMessageResponse>> => {
  return post<BaseResponse<StickerMessageResponse>>('/api/messages/send-sticker', dto);
};

/**
 * 发送系统消息
 */
export const sendSystemMessage = async (dto: SystemMessageRequest): Promise<BaseResponse<SystemMessageResponse>> => {
  return post<BaseResponse<SystemMessageResponse>>('/api/messages/send-system', dto);
};