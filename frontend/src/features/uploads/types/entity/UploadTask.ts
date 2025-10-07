/*
 * 上传任务实体类型
 * 表示单个文件上传任务的状态信息
 */
import { FileTypes, UploadStatus } from '../enums/A_index';
import { UploadResponse } from '../dto/A_index';

/**
 * 单个上传任务的状态
 */
export interface UploadTask {
  /** 上传任务ID */
  id: string;
  /** 文件对象 */
  file: File;
  /** 文件类型 */
  fileType: FileTypes;
  /** 上传进度（0-100） */
  progress: number;
  /** 上传状态 */
  status: UploadStatus;
  /** 上传响应数据（如果成功） */
  response?: UploadResponse;
  /** 错误信息（如果失败） */
  error?: string;
  /** 上传开始时间 */
  startTime: number;
  /** 上传结束时间 */
  endTime?: number;
  
  // 分块上传相关属性
  /** 是否启用分块上传 */
  useChunkUpload?: boolean;
  /** 总分块数量 */
  totalChunks?: number;
  /** 已上传的块数 */
  uploadedChunks?: number;
  /** 文件唯一标识（用于断点续传） */
  fileIdentifier?: string;
  /** 重试次数 */
  retries?: number;
  /** 分块大小 */
  chunkSize?: number;
}