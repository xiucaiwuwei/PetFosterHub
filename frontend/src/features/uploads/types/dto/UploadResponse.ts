/**
 * 基础文件上传响应DTO
 */

/** 基础文件上传响应DTO */
export interface UploadResponse {
  fileId: string; // 文件唯一标识
  url: string; // 文件访问URL
  fileName: string; // 文件名
  fileSize: number; // 文件大小(字节)
  fileType: string; // 文件类型
  uploadTime: number; // 上传时间戳
  thumbnailUrl?: string; // 缩略图URL(如果有)
}

/** 图片上传响应DTO */
export interface ImageUploadResponse extends UploadResponse {
  width?: number; // 图片宽度
  height?: number; // 图片高度
  aspectRatio?: number; // 宽高比
  thumbnailDetails?: {
    url: string; // 缩略图URL
    width: number; // 缩略图宽度
    height: number; // 缩略图高度
    fileSize: number; // 缩略图文件大小(字节)
  }; // 缩略图详情
}

/** 视频上传响应DTO */
export interface VideoUploadResponse extends UploadResponse {
  duration?: number; // 视频时长(秒)
  width?: number; // 视频宽度
  height?: number; // 视频高度
  aspectRatio?: number; // 宽高比
  thumbnailDetails?: {
    url: string; // 封面图URL
    width: number; // 封面图宽度
    height: number; // 封面图高度
    fileSize: number; // 封面图文件大小(字节)
  }; // 封面图详情
  videoCodec?: string; // 视频编码格式
  audioCodec?: string; // 音频编码格式
  resolution?: string; // 视频分辨率
}

/** 音频上传响应DTO */
export interface AudioUploadResponse extends UploadResponse {
  duration?: number; // 音频时长(秒)
  bitrate?: number; // 比特率
  sampleRate?: number; // 采样率
  format?: string; // 音频格式
  artist?: string; // 艺术家(如果有元数据)
  album?: string; // 专辑(如果有元数据)
  title?: string; // 标题(如果有元数据)
}

/** 文档上传响应DTO */
export interface DocumentUploadResponse extends UploadResponse {
  pageCount?: number; // 页数(如果适用)
  documentType?: string; // 文档具体类型
  previewUrl?: string; // 预览图URL(如果有)
  ocrTextUrl?: string; // OCR文本结果URL(如果启用了OCR)
}

/** 分块上传状态响应DTO */
export interface ChunkUploadStatusResponse {
  fileId: string; // 文件唯一标识
  uploadedChunks: number[]; // 已上传的块索引
  totalChunks: number; // 总分块数
  uploadProgress: number; // 上传进度(0-100)
  isUploadComplete: boolean; // 是否上传完成
  lastUploadTime?: number; // 最后上传时间戳
}