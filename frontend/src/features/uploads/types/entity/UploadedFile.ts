/*
 * 上传文件实体类型
 * 表示已上传的文件信息
 */

/**
 * 已上传文件的实体类型
 */
export interface UploadedFile {
  /** 文件ID */
  id: string;
  /** 文件名 */
  name: string;
  /** 文件URL */
  url: string;
  /** 文件类型 */
  type: string;
  /** 文件大小（字节） */
  size: number;
  /** 上传时间（ISO格式字符串） */
  uploadedAt: string;
  /** 上传用户ID */
  uploadedBy: string;
  /** 存储路径 */
  storagePath: string;
  /** 缩略图URL（可选） */
  thumbnailUrl?: string;
}