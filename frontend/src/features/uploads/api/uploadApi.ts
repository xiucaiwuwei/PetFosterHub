/*
 * 文件上传API调用函数
 * 提供通用的文件上传功能
 */
import { post } from '@/lib/api/axios';
import type { AxiosProgressEvent } from 'axios';
import { FileTypes } from '@/features/uploads/types/enums/A_index';
import { UploadFileDto, ImageUploadDto, VideoUploadDto, AudioUploadDto, DocumentUploadDto, UploadProgressOptionsDto } from '@/features/uploads/types/dto/A_index';
import { ImageUploadResponse, VideoUploadResponse, AudioUploadResponse, DocumentUploadResponse, UploadResponse } from '@/features/uploads/types/dto/UploadResponse';

/** 上传图片文件 */
export const uploadImage = async (
  dto: ImageUploadDto,
  progressOptions?: UploadProgressOptionsDto,
  signal?: AbortSignal
): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('file', dto.file);
  
  // 添加可选参数
  if (dto.title) formData.append('title', dto.title);
  if (dto.description) formData.append('description', dto.description);
  if (dto.generateThumbnail !== undefined) formData.append('generateThumbnail', dto.generateThumbnail.toString());
  if (dto.thumbnailWidth) formData.append('thumbnailWidth', dto.thumbnailWidth.toString());
  if (dto.thumbnailHeight) formData.append('thumbnailHeight', dto.thumbnailHeight.toString());
  if (dto.context) {
    formData.append('context', JSON.stringify(dto.context));
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
  
  // 上传文件并返回文件响应
  return post<ImageUploadResponse>('/api/upload/image', formData, config);
};

/** 上传视频文件 */
export const uploadVideo = async (
  dto: VideoUploadDto,
  progressOptions?: UploadProgressOptionsDto,
  signal?: AbortSignal
): Promise<VideoUploadResponse> => {
  const formData = new FormData();
  formData.append('file', dto.file);
  
  // 添加可选参数
  if (dto.title) formData.append('title', dto.title);
  if (dto.description) formData.append('description', dto.description);
  if (dto.generateThumbnail !== undefined) formData.append('generateThumbnail', dto.generateThumbnail.toString());
  if (dto.transcode !== undefined) formData.append('transcode', dto.transcode.toString());
  if (dto.targetResolution) formData.append('targetResolution', dto.targetResolution);
  if (dto.context) {
    formData.append('context', JSON.stringify(dto.context));
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
  
  // 上传文件并返回文件响应
  return post<VideoUploadResponse>('/api/upload/video', formData, config);
};

/** 上传音频文件 */
export const uploadAudio = async (
  dto: AudioUploadDto,
  progressOptions?: UploadProgressOptionsDto,
  signal?: AbortSignal
): Promise<AudioUploadResponse> => {
  const formData = new FormData();
  formData.append('file', dto.file);
  
  // 添加可选参数
  if (dto.title) formData.append('title', dto.title);
  if (dto.description) formData.append('description', dto.description);
  if (dto.extractMetadata !== undefined) formData.append('extractMetadata', dto.extractMetadata.toString());
  if (dto.transcode !== undefined) formData.append('transcode', dto.transcode.toString());
  if (dto.targetFormat) formData.append('targetFormat', dto.targetFormat);
  if (dto.context) {
    formData.append('context', JSON.stringify(dto.context));
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
  
  // 上传文件并返回文件响应
  return post<AudioUploadResponse>('/api/upload/audio', formData, config);
};

/** 上传文档文件 */
export const uploadDocument = async (
  dto: DocumentUploadDto,
  progressOptions?: UploadProgressOptionsDto,
  signal?: AbortSignal
): Promise<DocumentUploadResponse> => {
  const formData = new FormData();
  formData.append('file', dto.file);
  
  // 添加可选参数
  if (dto.title) formData.append('title', dto.title);
  if (dto.description) formData.append('description', dto.description);
  if (dto.generatePreview !== undefined) formData.append('generatePreview', dto.generatePreview.toString());
  if (dto.enableOcr !== undefined) formData.append('enableOcr', dto.enableOcr.toString());
  if (dto.context) {
    formData.append('context', JSON.stringify(dto.context));
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
  
  // 上传文件并返回文件响应
  return post<DocumentUploadResponse>('/api/upload/document', formData, config);
};

/** 上传任意文件（通用接口） */
export const uploadFile = async (
  fileDto: UploadFileDto,
  progressOptions?: UploadProgressOptionsDto,
  signal?: AbortSignal
): Promise<UploadResponse> => {
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
  
  // 上传文件并返回文件响应
  return post<UploadResponse>(endpoint, formData, config);
};

/** 通用文件上传函数 */
export const uploadAnyFile = async (
  file: File,
  fileType: FileTypes,
  progressOptions?: UploadProgressOptionsDto,
  signal?: AbortSignal
): Promise<UploadResponse> => {
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
export const getUploadProgressOptions = (onProgress?: (progressEvent: AxiosProgressEvent) => void): UploadProgressOptionsDto => {
  if (!onProgress) {
    return {};
  }

  const progressConfig: UploadProgressOptionsDto = {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress
  };
  
  return progressConfig;
};