/**
 * 分块上传任务配置
 */
import { FileTypes } from '../enums/A_index';

export interface ChunkUploadConfig {
  /** 文件ID */
  fileId: string;
  /** 当前分块索引 */
  chunkIndex: number;
  /** 总分块数量 */
  totalChunks: number;
  /** 文件类型 */
  fileType: FileTypes;
  /** 文件名称 */
  fileName: string;
  /** 文件大小 */
  fileSize: number;
}