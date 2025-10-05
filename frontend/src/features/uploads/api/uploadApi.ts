/*
 * 文件上传API调用函数
 * 提供通用的文件上传功能
 */
import { post } from '@/lib/api/axios';
import type { AxiosProgressEvent } from 'axios';
import { FileTypes } from '@/features/uploads/types/enums';
import { UploadFileDto } from '@/features/uploads/types/dto';

/** 上传图片文件 */
export const uploadImage = async (
  file: File,
  progressOptions?: Record<string, any>,
  signal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const config: any = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...progressOptions
  };
  
  if (signal) {
    config.signal = signal;
  }
  
  // 上传文件并返回文件URL
  return post<string>('/api/upload/image', formData, config);
};

/** 上传视频文件 */
export const uploadVideo = async (
  file: File,
  progressOptions?: Record<string, any>,
  signal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const config: any = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...progressOptions
  };
  
  if (signal) {
    config.signal = signal;
  }
  
  // 上传文件并返回文件URL
  return post<string>('/api/upload/video', formData, config);
};

/** 上传音频文件 */
export const uploadAudio = async (
  file: File,
  progressOptions?: Record<string, any>,
  signal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const config: any = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...progressOptions
  };
  
  if (signal) {
    config.signal = signal;
  }
  
  // 上传文件并返回文件URL
  return post<string>('/api/upload/audio', formData, config);
};

/** 上传文档文件 */
export const uploadDocument = async (
  file: File,
  progressOptions?: Record<string, any>,
  signal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const config: any = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...progressOptions
  };
  
  if (signal) {
    config.signal = signal;
  }
  
  // 上传文件并返回文件URL
  return post<string>('/api/upload/document', formData, config);
};

/** 上传任意文件（通用接口） */
export const uploadFile = async (
  fileDto: UploadFileDto,
  progressOptions?: Record<string, any>,
  signal?: AbortSignal
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', fileDto.file);
  
  // 添加可选参数
  if (fileDto.title) formData.append('title', fileDto.title);
  if (fileDto.description) formData.append('description', fileDto.description);
  if (fileDto.context) {
    // 将context对象转换为字符串
    formData.append('context', JSON.stringify(fileDto.context));
  }
  
  // 根据文件类型选择上传接口
  let endpoint: string;
  switch (fileDto.fileType) {
    case FileTypes.Image:
      endpoint = '/api/upload/image';
      break;
    case FileTypes.Video:
      endpoint = '/api/upload/video';
      break;
    case FileTypes.Audio:
      endpoint = '/api/upload/audio';
      break;
    case FileTypes.Document:
      endpoint = '/api/upload/document';
      break;
    default:
      endpoint = '/api/upload/file'; // 通用文件上传接口
  }
  
  const config: any = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...progressOptions
  };
  
  if (signal) {
    config.signal = signal;
  }
  
  // 上传文件并返回文件URL
  return post<string>(endpoint, formData, config);
};

/** 通用文件上传函数 */
export const uploadAnyFile = async (
  file: File,
  fileType: FileTypes,
  progressOptions?: Record<string, any>,
  signal?: AbortSignal
): Promise<string> => {
  const fileDto: UploadFileDto = {
    file,
    fileType,
    title: file.name
  };
  return uploadFile(fileDto, progressOptions, signal);
};

/**
 * 获取文件上传进度的辅助函数
 * @param onProgress 进度回调函数
 * @returns 包含进度配置的选项对象
 */
export const getUploadProgressOptions = (onProgress?: (progressEvent: AxiosProgressEvent) => void) => {
  if (!onProgress) {
    return {};
  }

  const progressConfig: any = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  
  progressConfig.onUploadProgress = onProgress;
  
  return progressConfig;
};