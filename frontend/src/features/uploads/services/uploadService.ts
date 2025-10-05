/*
 * 文件上传服务
 * 提供文件上传的业务逻辑处理
 */
import { uploadImage, uploadVideo, uploadAudio, uploadDocument, uploadAnyFile } from '../api/uploadApi';
import { FileTypes } from '../types/enums';
import { UploadFileDto, UploadResponseDto } from '../types/dto';
import { UploadedFile } from '../types/entity';

/**
 * 上传文件并处理业务逻辑
 * @param fileDto 文件上传请求数据
 * @param onProgress 上传进度回调函数
 * @param signal AbortSignal对象，用于取消上传
 * @returns 上传响应数据
 */
export const handleFileUpload = async (
  fileDto: UploadFileDto,
  onProgress?: (progressEvent: ProgressEvent) => void,
  signal?: AbortSignal
): Promise<UploadResponseDto> => {
  try {
    // 验证文件大小和类型
    await validateFile(fileDto.file, fileDto.fileType);

    // 设置进度配置
    const progressOptions = onProgress ? { onUploadProgress: onProgress } : {};
    
    // 根据文件类型选择上传方法
    let fileUrl: string;
    switch (fileDto.fileType) {
      case FileTypes.Image:
        fileUrl = await uploadImage(fileDto.file, progressOptions, signal);
        break;
      case FileTypes.Video:
        fileUrl = await uploadVideo(fileDto.file, progressOptions, signal);
        break;
      case FileTypes.Audio:
        fileUrl = await uploadAudio(fileDto.file, progressOptions, signal);
        break;
      case FileTypes.Document:
        fileUrl = await uploadDocument(fileDto.file, progressOptions, signal);
        break;
      default:
        fileUrl = await uploadAnyFile(fileDto.file, fileDto.fileType as FileTypes, progressOptions, signal);
    }

    // 构建响应数据
    return buildUploadResponse(fileDto, fileUrl);
  } catch (error) {
    console.error('文件上传失败:', error);
    throw error;
  }
};

/**
 * 验证文件大小和类型
 * @param file 待验证的文件
 * @param fileType 文件类型
 */
export const validateFile = async (file: File, fileType: string): Promise<void> => {
  // 根据文件类型设置大小限制（字节）
  const sizeLimits: Record<string, number> = {
    [FileTypes.Image]: 10 * 1024 * 1024, // 10MB
    [FileTypes.Video]: 100 * 1024 * 1024, // 100MB
    [FileTypes.Audio]: 20 * 1024 * 1024, // 20MB
    [FileTypes.Document]: 50 * 1024 * 1024, // 50MB
    [FileTypes.Archive]: 100 * 1024 * 1024, // 100MB
    [FileTypes.Code]: 10 * 1024 * 1024, // 10MB
    [FileTypes.Other]: 50 * 1024 * 1024 // 50MB
  };

  // 检查文件大小
  const sizeLimit = sizeLimits[fileType] || sizeLimits[FileTypes.Other];
  if (file.size > sizeLimit) {
    throw new Error(`文件大小超过限制（最大${formatFileSize(sizeLimit)}）`);
  }

  // 这里可以添加更多文件类型验证逻辑
};

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 构建上传响应数据
 * @param fileDto 文件上传请求数据
 * @param fileUrl 上传后的文件URL
 * @returns 上传响应数据
 */
export const buildUploadResponse = (fileDto: UploadFileDto, fileUrl: string): UploadResponseDto => {
  // 从URL中提取文件ID（示例逻辑，实际需根据后端返回格式调整）
  const fileId = generateFileId();

  const response: UploadResponseDto = {
    fileId,
    url: fileUrl,
    fileName: fileDto.file.name,
    fileSize: fileDto.file.size,
    fileType: fileDto.fileType,
    uploadTime: Date.now()
  };
  
  // 只有图片类型才设置缩略图URL
  if (fileDto.fileType === FileTypes.Image) {
    response.thumbnailUrl = generateThumbnailUrl(fileUrl);
  }
  
  return response;
};

/**
 * 生成文件ID（示例函数）
 * 实际项目中可能由后端返回
 */
const generateFileId = (): string => {
  return 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
};

/**
 * 生成缩略图URL（示例函数）
 * 实际项目中可能由后端返回
 */
const generateThumbnailUrl = (fileUrl: string): string => {
  // 示例：在URL后添加缩略图参数
  return fileUrl.includes('?') ? `${fileUrl}&thumbnail=1` : `${fileUrl}?thumbnail=1`;
};

/**
 * 批量上传文件
 * @param filesDto 文件上传请求数据数组
 * @param onProgress 上传进度回调函数
 * @returns 上传响应数据数组
 */
export const batchUploadFiles = async (
  filesDto: UploadFileDto[],
  onProgress?: (taskIndex: number, progressEvent: ProgressEvent) => void
): Promise<UploadResponseDto[]> => {
  const uploadPromises = filesDto.map((fileDto, index) => {
    // 如果提供了进度回调，为每个文件创建单独的进度回调
    const fileProgressCallback = onProgress 
      ? (event: ProgressEvent) => onProgress(index, event)
      : undefined;
    
    return handleFileUpload(fileDto, fileProgressCallback);
  });
  return Promise.all(uploadPromises);
};

/**
 * 将上传响应转换为文件实体
 * @param response 上传响应数据
 * @param userId 上传用户ID
 * @returns 文件实体
 */
export const responseToEntity = (response: UploadResponseDto, userId: string): UploadedFile => {
  const entity: UploadedFile = {
    id: response.fileId,
    name: response.fileName,
    url: response.url,
    type: response.fileType,
    size: response.fileSize,
    uploadedAt: new Date(response.uploadTime).toISOString(),
    uploadedBy: userId,
    storagePath: generateStoragePath(response)
  };
  
  // 只有当缩略图URL存在时才添加到实体中
  if (response.thumbnailUrl) {
    entity.thumbnailUrl = response.thumbnailUrl;
  }
  
  return entity;
};

/**
 * 生成存储路径（示例函数）
 * 实际项目中可能由后端管理
 */
const generateStoragePath = (response: UploadResponseDto): string => {
  const timestamp = new Date(response.uploadTime).toISOString().split('T')[0];
  return `${timestamp}/${response.fileId}_${response.fileName}`;
};