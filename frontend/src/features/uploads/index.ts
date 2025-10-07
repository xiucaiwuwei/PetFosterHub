/*
 * 文件上传模块主入口
 * 导出所有公共API和组件
 */

// 组件
export { FileUploader } from './components/FileUploader';

export type { FileUploaderProps } from './components/FileUploader';

// 钩子
export { useFileUpload } from './hooks/useFileUpload';
export type { UseFileUploadReturn } from './hooks/useFileUpload';

// 服务
export { handleFileUpload, batchUploadFiles } from './services/uploadService';
export { handleChunkUpload } from './services/chunkUploadService';

export type { ChunkUploadOptions } from './services/chunkUploadService';

// API
export { uploadImage, uploadVideo, uploadAudio, uploadDocument, uploadFile, uploadAnyFile } from './api/uploadApi';
export { checkFileUploadStatus, uploadChunk, mergeChunks } from './api/chunkUploadApi';

export type { ChunkUploadConfig } from './api/chunkUploadApi';

// 类型定义
export * from './types/dto/A_index';
export * from './types/entity/A_index';
export * from './types/enums/A_index';

export { getFileType, formatFileSize, validateFileSize } from './utils/fileUtils';