/**
 * 文件上传API调用函数
 * 提供与消息系统相关的文件上传功能
 */
import { post } from '@/lib/api/axios';
import { FileTypes } from '../types/enums';

/** 上传图片文件 */
export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  // 上传文件并返回文件URL
  return post<string>('/api/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/** 上传视频文件 */
export const uploadVideo = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  // 上传文件并返回文件URL
  return post<string>('/api/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/** 上传音频文件 */
export const uploadAudio = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  // 上传文件并返回文件URL
  return post<string>('/api/upload/audio', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/** 通用文件上传函数 */
export const uploadAnyFile = async (file: File, fileType: FileTypes): Promise<string> => {
  switch (fileType) {
    case FileTypes.Image:
      return uploadImage(file);
    case FileTypes.Video:
      return uploadVideo(file);
    case FileTypes.Audio:
      return uploadAudio(file);
    default:
      throw new Error(`不支持的文件类型: ${fileType}`);
  }
};

/**
 * 获取文件上传进度的辅助函数
 * 注意：实际项目中可能需要通过axios拦截器或自定义配置来实现上传进度监听
 * @param onProgress 进度回调函数
 * @returns 包含进度配置的选项对象
 */
export const getUploadProgressOptions = (onProgress?: (progressEvent: ProgressEvent) => void) => {
  if (!onProgress) {
    return {};
  }

  return {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: onProgress
  };
};