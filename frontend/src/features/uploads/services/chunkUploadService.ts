/*
 * 分块上传服务
 * 提供大文件分块上传和断点续传的业务逻辑处理
 */
import type {AxiosProgressEvent} from 'axios';
import {UploadFileRequest, UploadResponse ,ChunkUploadConfig} from '../types';
import {FileTypes} from '../types/enums/A_index';
import {
    calculateTotalChunks,
    checkFileUploadStatus,
    CHUNK_SIZE,
    generateFileIdentifier,
    getFileChunk,
    mergeChunks,
    uploadChunk
} from '../api/chunkUploadApi';
import {validateFile} from './uploadService';

/**
 * 分块上传配置选项
 */
export interface ChunkUploadOptions {
  /** 分块大小（字节） */
  chunkSize?: number;
  /** 上传重试次数 */
  retryCount?: number;
  /** 是否启用断点续传 */
  enableResume?: boolean;
  /** 并行上传的块数 */
  concurrentChunks?: number;
  /** 上传进度回调 */
  onProgress?: (chunkIndex: number, progress: number) => void;
  /** 分块上传完成回调 */
  onChunkComplete?: (chunkIndex: number) => void;
}

/**
 * 执行分块上传
 * @param fileDto 文件上传数据
 * @param options 分块上传选项
 * @returns 上传响应数据
 */
export const handleChunkUpload = async (
  fileDto: UploadFileRequest,
  options: ChunkUploadOptions = {}
): Promise<UploadResponse> => {
  // 默认选项
  const defaultOptions: ChunkUploadOptions = {
    chunkSize: CHUNK_SIZE,
    retryCount: 3,
    enableResume: true,
    concurrentChunks: 3,
    onProgress: () => {},
    onChunkComplete: () => {}
  };

  const mergedOptions = { ...defaultOptions, ...options };
  // 确保所有参数始终是number类型
  const { retryCount = 3, enableResume, onProgress, onChunkComplete } = mergedOptions;
  const concurrentChunks = mergedOptions.concurrentChunks || 3; // 确保concurrentChunks是number类型
  const chunkSize = mergedOptions.chunkSize || CHUNK_SIZE; // 确保chunkSize是number类型

  // 验证文件
  await validateFile(fileDto.file, fileDto.fileType);

  // 生成文件唯一标识
  const fileId = generateFileIdentifier(fileDto.file);
  const totalChunks = calculateTotalChunks(fileDto.file.size, chunkSize);

  let uploadedChunks: number[] = [];

  // 检查已上传的块（断点续传）
  if (enableResume) {
    const uploadStatus = await checkFileUploadStatus(fileId);
    uploadedChunks = uploadStatus.uploadedChunks;
  }

  // 计算需要上传的块
  const chunksToUpload = Array.from({ length: totalChunks }, (_, i) => i)
    .filter(index => !uploadedChunks.includes(index));

  if (chunksToUpload.length === 0) {
    // 所有块都已上传，直接合并
  // 将string类型的fileType转换为FileTypes类型
  const fileType = fileDto.fileType as FileTypes;
  const uploadResponse = await mergeChunks(fileId, fileDto.file.name, fileType);
  const fileUrl = uploadResponse.url;
  return buildChunkUploadResponse(fileDto, fileUrl);
  }

  // 使用并行上传策略，确保concurrentChunks是number类型
  await uploadChunksInParallel(
    fileDto.file,
    fileId,
    fileDto.fileType as FileTypes,
    chunksToUpload,
    totalChunks,
    chunkSize,
    concurrentChunks, // 确保concurrentChunks是number类型
    retryCount,
    onProgress || (() => {}),
    onChunkComplete || (() => {})
  );

  // 合并文件块
  const uploadResponse = await mergeChunks(fileId, fileDto.file.name, fileDto.fileType as FileTypes);
  const fileUrl = uploadResponse.url;

  // 构建响应数据
  return buildChunkUploadResponse(fileDto, fileUrl);
};

/**
 * 并行上传多个文件块
 */
async function uploadChunksInParallel(
  file: File,
  fileId: string,
  fileType: FileTypes,
  chunksToUpload: number[],
  totalChunks: number,
  chunkSize: number,
  concurrentChunks: number,
  retryCount: number,
  onProgress: (chunkIndex: number, progress: number) => void,
  onChunkComplete: (chunkIndex: number) => void
): Promise<void> {
  const activeUploads: Promise<void>[] = [];
  const chunkQueue = [...chunksToUpload];

  const uploadNextChunk = async () => {
    if (chunkQueue.length === 0) return;

    const chunkIndex = chunkQueue.shift()!;
    
    try {
      await uploadChunkWithRetry(
        file,
        fileId,
        fileType,
        chunkIndex,
        totalChunks,
        chunkSize,
        retryCount,
        (progress) => onProgress(chunkIndex, progress)
      );
      
      onChunkComplete(chunkIndex);
      await uploadNextChunk(); // 递归上传下一个块
    } catch (error) {
      console.error(`文件块 ${chunkIndex} 上传失败，已达到最大重试次数`, error);
      throw error;
    }
  };

  // 启动初始并发上传任务
  const numInitialUploads = Math.min(concurrentChunks, chunkQueue.length);
  for (let i = 0; i < numInitialUploads; i++) {
    activeUploads.push(uploadNextChunk());
  }

  // 等待所有上传任务完成
  await Promise.all(activeUploads);
}

/**
 * 上传单个文件块并处理重试逻辑
 */
async function uploadChunkWithRetry(
  file: File,
  fileId: string,
  fileType: FileTypes,
  chunkIndex: number,
  totalChunks: number,
  chunkSize: number,
  retryCount: number,
  onProgress: (progress: number) => void
): Promise<void> {
  const chunk = getFileChunk(file, chunkIndex, chunkSize);
  
  const config: ChunkUploadConfig = {
    fileId,
    chunkIndex,
    totalChunks,
    fileType,
    fileName: file.name,
    fileSize: file.size
  };

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
    // 适配onProgress回调函数，从AxiosProgressEvent中提取进度值
    const adaptedProgressCallback = (progressEvent: AxiosProgressEvent) => {
      if (progressEvent.total && progressEvent.loaded) {
        const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(progress);
      }
    };
    await uploadChunk(chunk, config, adaptedProgressCallback);
      return; // 上传成功，退出重试循环
    } catch (error) {
      if (attempt === retryCount) {
        throw error; // 达到最大重试次数，抛出错误
      }
      
      console.warn(`文件块 ${chunkIndex} 上传失败，尝试第 ${attempt + 1} 次重试`);
      // 可以在这里添加指数退避策略
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
}

/**
 * 构建分块上传响应数据
 */
export const buildChunkUploadResponse = (fileDto: UploadFileRequest, fileUrl: string): UploadResponse => {
  // 从URL中提取文件ID（示例逻辑，实际需根据后端返回格式调整）
  const fileId = generateFileIdentifier(fileDto.file);

  // 不设置thumbnailUrl属性，让它保持为可选
  return {
      fileId,
      url: fileUrl,
      fileName: fileDto.file.name,
      fileSize: fileDto.file.size,
      fileType: fileDto.fileType,
      uploadTime: Date.now() // 使用时间戳而不是ISO字符串
  };
};