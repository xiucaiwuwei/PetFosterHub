/**
 * 文件上传API调用函数
 * 提供与消息系统相关的文件上传功能
 */
import { post } from '@/lib/api/axios';

/**
 * 上传图片文件
 * @param file 图片文件
 * @returns 上传后的图片URL Promise
 */
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

/**
 * 上传视频文件
 * @param file 视频文件
 * @returns 上传后的视频URL Promise
 */
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

/**
 * 上传音频文件
 * @param file 音频文件
 * @returns 上传后的音频URL Promise
 */
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

/**
 * 上传普通文件
 * @param file 普通文件
 * @returns 上传后的文件URL Promise
 */
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // 上传文件并返回文件URL
  return post<string>('/api/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 通用文件上传函数
 * @param file 文件对象
 * @param fileType 文件类型（image, video, audio, file）
 * @returns 上传后的文件URL Promise
 */
export const uploadAnyFile = async (file: File, fileType: 'image' | 'video' | 'audio' | 'file'): Promise<string> => {
  switch (fileType) {
    case 'image':
      return uploadImage(file);
    case 'video':
      return uploadVideo(file);
    case 'audio':
      return uploadAudio(file);
    case 'file':
      return uploadFile(file);
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