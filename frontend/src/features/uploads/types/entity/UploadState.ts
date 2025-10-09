/*
 * 上传状态实体类型
 * 表示上传模块的整体状态
 */
import { UploadTask } from './UploadTask';
import { UploadConfig } from './UploadConfig';
import { UploadedFile } from './UploadedFile';

/**
 * 文件上传模块的状态
 */
export interface UploadState {
  /** 当前上传任务 */
  currentTasks: UploadTask[];
  /** 已完成的上传文件列表 */
  uploadedFiles: UploadedFile[];
  /** 上传配置 */
  config: UploadConfig;
  /** 正在处理的上传任务数量 */
  activeUploads: number;
}