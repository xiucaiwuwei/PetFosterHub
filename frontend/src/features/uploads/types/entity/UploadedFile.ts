/*
 * 上传文件实体类型
 * 表示系统中已上传的文件信息
 */
export interface UploadedFile {
  /** 文件唯一标识 */
  id: string;
  /** 文件名称 */
  name: string;
  /** 文件URL */
  url: string;
  /** 文件类型 */
  type: string;
  /** 文件大小（字节） */
  size: number;
  /** 上传时间 */
  uploadedAt: string;
  /** 上传用户ID */
  uploadedBy: string;
  /** 文件存储路径 */
  storagePath: string;
  /** 缩略图URL（如果有） */
  thumbnailUrl?: string;
  /** 文件元数据 */
  metadata?: Record<string, unknown>;
}