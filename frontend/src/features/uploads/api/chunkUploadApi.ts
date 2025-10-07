/*
 * 分块上传API调用函数
 * 提供大文件分块上传和断点续传功能
 */
import {get, post} from '@/lib/api/axios';
import type {AxiosProgressEvent} from 'axios';
import {FileTypes} from '../types/enums/A_index';
import type {ChunkUploadConfig} from '../types/entity/A_index';
import {ChunkUploadStatusResponse, UploadResponse} from '../types/dto/UploadResponse';

/** 分块大小（5MB） */
export const CHUNK_SIZE = 5 * 1024 * 1024;

/**
 * 检查文件是否已上传部分块（断点续传）
 * @param fileId 文件唯一标识
 * @returns 分块上传状态响应
 */
export const checkFileUploadStatus = async (fileId: string): Promise<ChunkUploadStatusResponse> => {
  try {
    const response = await get<ChunkUploadStatusResponse>(`/api/upload/chunk/${fileId}/status`);
    return response;
  } catch (error) {
    console.error('检查文件上传状态失败:', error);
    // 返回默认的上传状态
    return {
      success: false,
      message: '检查上传状态失败',
      fileId,
      uploadedChunks: [],
      totalChunks: 0,
      uploadProgress: 0,
      isUploadComplete: false
    };
  }
};

/**
 * 上传单个文件块
 * @param chunk 文件块数据
 * @param config 分块上传配置
 * @param onProgress 上传进度回调
 * @returns 上传响应
 */
export const uploadChunk = async (
  chunk: Blob,
  config: ChunkUploadConfig,
  onProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<{ success: boolean; message?: string }> => {
  const formData = new FormData();
  formData.append('file', chunk);
  formData.append('fileId', config.fileId);
  formData.append('chunkIndex', config.chunkIndex.toString());
  formData.append('totalChunks', config.totalChunks.toString());
  formData.append('fileName', config.fileName);
  formData.append('fileSize', config.fileSize.toString());
  formData.append('fileType', config.fileType);

  try {
    const axiosConfig: any = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    
    if (onProgress) {
      axiosConfig.onUploadProgress = onProgress;
    }
    
    return await post<{ success: boolean; message?: string }>(
      '/api/upload/chunk',
      formData,
      axiosConfig
    );
  } catch (error) {
    console.error(`上传分块 ${config.chunkIndex + 1}/${config.totalChunks} 失败:`, error);
    throw error;
  }
};

/**
 * 合并文件块
 * @param fileId 文件唯一标识
 * @param fileName 文件名
 * @param fileType 文件类型
 * @returns 合并后的文件响应
 */
export const mergeChunks = async (
  fileId: string,
  fileName: string,
  fileType: FileTypes
): Promise<UploadResponse> => {
  try {
      return await post<UploadResponse>('/api/upload/chunk/merge', {
        fileId,
        fileName,
        fileType
    });
  } catch (error) {
    console.error('合并文件块失败:', error);
    throw error;
  }
};

/**
 * 生成文件唯一标识
 * @param file 文件对象
 * @returns 文件唯一标识
 */
export const generateFileIdentifier = (file: File): string => {
  // 简单实现：使用文件名和大小生成唯一标识
  // 实际项目中可以考虑使用文件内容的哈希值
  return `chunk_${file.name}_${file.size}_${file.lastModified}`;
};

/**
 * 计算文件的总分块数量
 * @param fileSize 文件大小
 * @param chunkSize 分块大小
 * @returns 总分块数量
 */
export const calculateTotalChunks = (fileSize: number, chunkSize: number = CHUNK_SIZE): number => {
  return Math.ceil(fileSize / chunkSize);
};

/**
 * 获取文件的指定块数据
 * @param file 文件对象
 * @param chunkIndex 块索引
 * @param chunkSize 块大小
 * @returns 文件块数据
 */
export const getFileChunk = (
    file: File,
    chunkIndex: number,
    chunkSize: number = CHUNK_SIZE
): Blob => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    return file.slice(start, end);
};

// 重新导出实体类型以保持向后兼容性
export type { ChunkUploadConfig } from '../types/entity/A_index';