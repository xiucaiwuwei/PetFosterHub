/** 
 * 文件上传请求DTO集合 
 */
import { BaseRequest } from '@/types';

/** 基础文件上传请求DTO，其他媒体类型请求DTO继承自此类 */
export interface UploadFileRequest extends BaseRequest {
  file: File; // 文件对象
  fileType: string; // 文件类型
  title?: string; // 可选标题
  description?: string; // 可选描述
  context?: Record<string, string>; // 可选上下文信息
}

/** 图片上传请求DTO */
export interface ImageUploadRequest extends UploadFileRequest {
  generateThumbnail?: boolean; // 是否生成缩略图
  thumbnailWidth?: number; // 缩略图宽度
  thumbnailHeight?: number; // 缩略图高度
}

/** 视频上传请求DTO */
export interface VideoUploadRequest extends UploadFileRequest {
  generateThumbnail?: boolean; // 是否生成封面图
  transcode?: boolean; // 是否转码
  targetResolution?: '360p' | '480p' | '720p' | '1080p' | '2160p'; // 目标分辨率
}

/** 音频上传请求DTO */
export interface AudioUploadRequest extends UploadFileRequest {
  extractMetadata?: boolean; // 是否提取音频信息
  transcode?: boolean; // 是否转码
  targetFormat?: 'mp3' | 'wav' | 'ogg' | 'flac' | 'aac'; // 目标格式
}

/** 文档上传请求DTO */
export interface DocumentUploadRequest extends UploadFileRequest {
  generatePreview?: boolean; // 是否生成预览
  enableOcr?: boolean; // 是否启用OCR处理
}


import type { AxiosProgressEvent } from 'axios';
/** 
 * 上传进度配置DTO 
 */
export interface UploadProgressOptionsRequest extends BaseRequest {
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void; // 上传进度回调
  detailedProgress?: boolean; // 是否需要详细进度
  progressInterval?: number; // 进度报告间隔(毫秒)
  axiosConfig?: Record<string, any>; // 额外Axios配置
}