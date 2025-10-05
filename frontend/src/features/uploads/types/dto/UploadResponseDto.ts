/*
 * 文件上传响应DTO
 * 用于定义文件上传的响应数据结构
 */
export interface UploadResponseDto {
  /** 文件ID */
  fileId: string;
  /** 文件URL */
  url: string;
  /** 文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** 文件类型 */
  fileType: string;
  /** 上传时间戳 */
  uploadTime: number;
  /** 缩略图URL（如果有） */
  thumbnailUrl?: string;
}