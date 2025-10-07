/*
 * 上传配置实体类型
 * 定义文件上传的配置选项
 */
export interface UploadConfig {
  /** 上传队列长度限制 */
  queueLimit: number;
  /** 是否启用自动上传 */
  autoUpload: boolean;
  /** 并行上传任务数 */
  concurrentUploads: number;
  /** 上传重试次数 */
  retryLimit: number;
  /** 是否启用分块上传 */
  enableChunkUpload: boolean;
  /** 启用分块上传的文件大小阈值（字节） */
  chunkUploadThreshold: number;
  /** 分块大小（字节） */
  chunkSize: number;
  /** 是否启用断点续传 */
  enableResumeUpload: boolean;
  /** 并行上传的块数 */
  concurrentChunks: number;
}