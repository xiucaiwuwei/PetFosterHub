/*
 * 文件工具函数
 * 提供文件处理相关的辅助函数
 */
import { FileTypes } from '../types/enums/A_index';

/**
 * 获取文件类型
 * @param file 文件对象或文件名
 * @returns 文件类型枚举值
 */
export const getFileType = (file: File | string): FileTypes => {
  const fileName = typeof file === 'string' ? file : file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  // 图片文件类型
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  if (imageExtensions.includes(extension)) {
    return FileTypes.Image;
  }

  // 视频文件类型
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
  if (videoExtensions.includes(extension)) {
    return FileTypes.Video;
  }

  // 音频文件类型
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'wma'];
  if (audioExtensions.includes(extension)) {
    return FileTypes.Audio;
  }

  // 文档文件类型
  const documentExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt', 'csv'];
  if (documentExtensions.includes(extension)) {
    return FileTypes.Document;
  }

  // 压缩包文件类型
  const archiveExtensions = ['zip', 'rar', '7z', 'tar', 'gz'];
  if (archiveExtensions.includes(extension)) {
    return FileTypes.Archive;
  }

  // 代码文件类型
  const codeExtensions = ['js', 'ts', 'jsx', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'py', 'java', 'c', 'cpp'];
  if (codeExtensions.includes(extension)) {
    return FileTypes.Code;
  }

  // 医学影像文件类型
  const medicalImageExtensions = ['dcm', 'dicom', 'nii', 'nii.gz', 'nrrd', 'mha', 'mhd'];
  if (medicalImageExtensions.includes(extension)) {
    return FileTypes.MedicalImage;
  }

  // CAD设计文件类型
  const cadExtensions = ['dwg', 'dxf', 'step', 'stp', 'iges', 'igs', 'prt', 'sldprt', 'asm', 'sldasm'];
  if (cadExtensions.includes(extension)) {
    return FileTypes.CAD;
  }

  // 地理信息系统文件类型
  const gisExtensions = ['shp', 'shx', 'dbf', 'geojson', 'kml', 'kmz', 'tif', 'tiff', 'gpkg'];
  if (gisExtensions.includes(extension)) {
    return FileTypes.GIS;
  }

  // 3D模型文件类型
  const threeDModelExtensions = ['obj', 'fbx', 'stl', 'blend', 'dae', '3ds', 'ply', 'glb', 'gltf'];
  if (threeDModelExtensions.includes(extension)) {
    return FileTypes.ThreeDModel;
  }

  // 数据库文件类型
  const databaseExtensions = ['sql', 'sqlite', 'db', 'mdb', 'accdb', 'odb', 'csv'];
  if (databaseExtensions.includes(extension)) {
    return FileTypes.Database;
  }

  // 可执行文件类型
  const executableExtensions = ['exe', 'bat', 'cmd', 'sh', 'bin', 'app', 'dmg'];
  if (executableExtensions.includes(extension)) {
    return FileTypes.Executable;
  }

  // 字体文件类型
  const fontExtensions = ['ttf', 'otf', 'woff', 'woff2', 'eot', 'svg'];
  if (fontExtensions.includes(extension)) {
    // 检查是否为SVG字体文件
    if (extension === 'svg' && typeof file !== 'string' && file.type.includes('font')) {
      return FileTypes.Font;
    }
    return FileTypes.Font;
  }

  // 矢量图形文件类型
  const vectorExtensions = ['svg', 'ai', 'eps', 'cdr'];
  if (vectorExtensions.includes(extension)) {
    // SVG可能是图片也可能是字体，已经在前面的检查中处理
    if (extension !== 'svg' || (typeof file === 'string' || !file.type.includes('font'))) {
      return FileTypes.Vector;
    }
  }

  // 其他文件类型
  return FileTypes.Other;
};

/**
 * 格式化文件大小
 * @param bytes 文件大小（字节）
 * @returns 格式化后的文件大小字符串
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 验证文件大小
 * @param file 文件对象
 * @param maxSize 最大文件大小（字节）
 * @returns 是否通过验证
 */
export const validateFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * 验证文件类型
 * @param file 文件对象
 * @param allowedTypes 允许的文件类型数组
 * @returns 是否通过验证
 */
export const validateFileType = (file: File, allowedTypes: FileTypes[]): boolean => {
  const fileType = getFileType(file);
  return allowedTypes.includes(fileType);
};

/**
 * 生成文件唯一标识
 * @returns 唯一标识字符串
 */
export const generateFileId = (): string => {
  return 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
};

/**
 * 获取文件图标
 * @param fileType 文件类型
 * @returns 图标名称或URL
 */
export const getFileIcon = (fileType: FileTypes): string => {
  const iconMap: Record<FileTypes, string> = {
    [FileTypes.Image]: 'image',
    [FileTypes.Video]: 'video',
    [FileTypes.Audio]: 'audio',
    [FileTypes.Document]: 'document',
    [FileTypes.Archive]: 'archive',
    [FileTypes.Code]: 'code',
    [FileTypes.Other]: 'file',
    [FileTypes.MedicalImage]: 'medical-image',
    [FileTypes.CAD]: 'cad',
    [FileTypes.GIS]: 'gis',
    [FileTypes.ThreeDModel]: '3d-model',
    [FileTypes.Database]: 'database',
    [FileTypes.Executable]: 'executable',
    [FileTypes.Font]: 'font',
    [FileTypes.Vector]: 'vector'
  };
  
  return iconMap[fileType] || 'file';
};

/**
 * 读取文件内容为DataURL
 * @param file 文件对象
 * @returns Promise<DataURL字符串>
 */
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 读取文件内容为文本
 * @param file 文件对象
 * @param encoding 文件编码，默认为'utf-8'
 * @returns Promise<文本内容>
 */
export const readFileAsText = (file: File, encoding: string = 'utf-8'): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file, encoding);
  });
};

/**
 * 从URL创建文件对象
 * @param url 文件URL
 * @param fileName 文件名
 * @returns Promise<File对象>
 */
export const createFileFromUrl = async (url: string, fileName: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

/**
 * 过滤文件列表
 * @param files 文件列表
 * @param allowedTypes 允许的文件类型数组
 * @param maxSize 最大文件大小（字节）
 * @returns 过滤后的文件列表
 */
export const filterFiles = (
  files: FileList | File[],
  allowedTypes?: FileTypes[],
  maxSize?: number
): File[] => {
  const fileArray = Array.from(files);
  
  return fileArray.filter(file => {
    const typeValid = !allowedTypes || validateFileType(file, allowedTypes);
    const sizeValid = !maxSize || validateFileSize(file, maxSize);
    return typeValid && sizeValid;
  });
};