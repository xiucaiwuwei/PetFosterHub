/*
 * 文件上传Redux Slice
 * 管理文件上传相关的状态
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadedFile } from '../types/entity';
import { UploadResponseDto } from '../types/dto';
import { FileTypes } from '../types/enums';

/**
 * 单个上传任务的状态
 */
export interface UploadTask {
  /** 上传任务ID */
  id: string;
  /** 文件对象 */
  file: File;
  /** 文件类型 */
  fileType: FileTypes;
  /** 上传进度（0-100） */
  progress: number;
  /** 上传状态 */
  status: 'idle' | 'uploading' | 'success' | 'error';
  /** 上传响应数据（如果成功） */
  response?: UploadResponseDto;
  /** 错误信息（如果失败） */
  error?: string;
  /** 上传开始时间 */
  startTime: number;
  /** 上传结束时间 */
  endTime?: number;
  
  // 分块上传相关属性
  /** 是否启用分块上传 */
  useChunkUpload?: boolean;
  /** 总分块数量 */
  totalChunks?: number;
  /** 已上传的块数 */
  uploadedChunks?: number;
  /** 文件唯一标识（用于断点续传） */
  fileIdentifier?: string;
  /** 重试次数 */
  retries?: number;
  /** 分块大小 */
  chunkSize?: number;
}

/**
 * 文件上传配置选项
 */
export interface UploadConfig {
  /** 上传队列长度限制 */
  queueLimit: number;
  /** 是否启用自动上传 */
  autoUpload: boolean;
  /** 并行上传任务数 */
  concurrentUploads: number;
  /** 上传重试次数 */
  retryLimit: number;
  /** 是否启用分块上传 */
  enableChunkUpload: boolean;
  /** 启用分块上传的文件大小阈值（字节） */
  chunkUploadThreshold: number;
  /** 分块大小（字节） */
  chunkSize: number;
  /** 是否启用断点续传 */
  enableResumeUpload: boolean;
  /** 并行上传的块数 */
  concurrentChunks: number;
}

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

/**
 * 初始状态
 */
const initialState: UploadState = {
  currentTasks: [],
  uploadedFiles: [],
  config: {
    queueLimit: 10,
    autoUpload: true,
    concurrentUploads: 2,
    retryLimit: 3,
    enableChunkUpload: true,
    chunkUploadThreshold: 5 * 1024 * 1024, // 5MB
    chunkSize: 5 * 1024 * 1024, // 5MB
    enableResumeUpload: true,
    concurrentChunks: 3
  },
  activeUploads: 0
};

/**
 * 文件上传Slice
 */
export const uploadSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    /**
     * 添加上传任务到队列
     */
    addUploadTask: (state, action: PayloadAction<{ file: File; fileType: FileTypes; useChunkUpload?: boolean }>) => {
      const { file, fileType, useChunkUpload: forceChunkUpload } = action.payload;
      
      // 检查队列长度限制
      if (state.currentTasks.length >= state.config.queueLimit) {
        throw new Error(`上传队列已达上限（${state.config.queueLimit}个文件）`);
      }

      // 决定是否使用分块上传
      const shouldUseChunkUpload = forceChunkUpload !== undefined 
        ? forceChunkUpload 
        : state.config.enableChunkUpload && file.size >= state.config.chunkUploadThreshold;

      const newTask: UploadTask = {
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        file,
        fileType,
        progress: 0,
        status: state.config.autoUpload ? 'uploading' : 'idle',
        startTime: Date.now(),
        useChunkUpload: shouldUseChunkUpload,
        retries: 0
      };

      state.currentTasks.push(newTask);
      
      if (state.config.autoUpload) {
        state.activeUploads += 1;
      }
    },

    /**
     * 更新上传配置
     */
    updateUploadConfig: (state, action: PayloadAction<Partial<UploadConfig>>) => {
      state.config = { ...state.config, ...action.payload };
    },

    /**
     * 更新上传进度
     */
    updateUploadProgress: (state, action: PayloadAction<{ taskId: string; progress: number }>) => {
      const { taskId, progress } = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task) {
        task.progress = Math.min(Math.max(progress, 0), 100);
      }
    },

    /**
     * 上传成功
     */
    uploadSuccess: (state, action: PayloadAction<{ taskId: string; response: UploadResponseDto }>) => {
      const { taskId, response } = action.payload;
      const taskIndex = state.currentTasks.findIndex(t => t.id === taskId);
      
      if (taskIndex !== -1) {
        const task = state.currentTasks[taskIndex];
        task.status = 'success';
        task.response = response;
        task.endTime = Date.now();
        
        // 从活动上传数中减去
        state.activeUploads = Math.max(0, state.activeUploads - 1);
      }
    },

    /**
     * 上传失败
     */
    uploadFailure: (state, action: PayloadAction<{ taskId: string; error: string }>) => {
      const { taskId, error } = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task) {
        task.status = 'error';
        task.error = error;
        task.endTime = Date.now();
        
        // 从活动上传数中减去
        state.activeUploads = Math.max(0, state.activeUploads - 1);
      }
    },

    /**
     * 移除上传任务
     */
    removeUploadTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task && task.status === 'uploading') {
        // 如果任务正在上传中，从活动上传数中减去
        state.activeUploads = Math.max(0, state.activeUploads - 1);
      }
      
      state.currentTasks = state.currentTasks.filter(t => t.id !== taskId);
    },

    /**
     * 清空上传队列
     */
    clearUploadQueue: (state) => {
      // 从活动上传数中减去所有正在上传的任务
      const uploadingTasks = state.currentTasks.filter(t => t.status === 'uploading');
      state.activeUploads = Math.max(0, state.activeUploads - uploadingTasks.length);
      
      state.currentTasks = [];
    },

    /**
     * 添加已上传文件到列表
     */
    addUploadedFile: (state, action: PayloadAction<UploadedFile>) => {
      state.uploadedFiles.push(action.payload);
    },

    /**
     * 移除已上传文件
     */
    removeUploadedFile: (state, action: PayloadAction<string>) => {
      state.uploadedFiles = state.uploadedFiles.filter(file => file.id !== action.payload);
    },

    /**
     * 清空已上传文件列表
     */
    clearUploadedFiles: (state) => {
      state.uploadedFiles = [];
    },

    /**
     * 更新分块上传进度
     */
    handleChunkProgress: (state, action: PayloadAction<{
      taskId: string;
      chunkIndex: number;
      totalChunks: number;
      uploadedChunks: number;
    }>) => {
      const { taskId, totalChunks, uploadedChunks } = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task) {
        task.totalChunks = totalChunks;
        task.uploadedChunks = uploadedChunks;
        task.progress = Math.round((uploadedChunks / totalChunks) * 100);
      }
    },

    /**
     * 设置文件唯一标识（用于断点续传）
     */
    setFileIdentifier: (state, action: PayloadAction<{ taskId: string; identifier: string }>) => {
      const { taskId, identifier } = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task) {
        task.fileIdentifier = identifier;
      }
    },

    /**
     * 增加重试次数
     */
    incrementRetries: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task) {
        task.retries = (task.retries || 0) + 1;
      }
    },

    /**
     * 开始上传任务
     */
    startUploadTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task && task.status === 'idle') {
        task.status = 'uploading';
        state.activeUploads += 1;
      }
    },

    /**
     * 暂停上传任务
     */
    pauseUploadTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      const task = state.currentTasks.find(t => t.id === taskId);
      
      if (task && task.status === 'uploading') {
        task.status = 'idle';
        state.activeUploads = Math.max(0, state.activeUploads - 1);
      }
    }
  }
});

// 导出action creators
export const { 
  addUploadTask,
  updateUploadConfig,
  updateUploadProgress,
  uploadSuccess,
  uploadFailure,
  removeUploadTask,
  clearUploadQueue,
  addUploadedFile,
  removeUploadedFile,
  clearUploadedFiles,
  startUploadTask,
  pauseUploadTask,
  handleChunkProgress,
  setFileIdentifier,
  incrementRetries
} = uploadSlice.actions;

export default uploadSlice.reducer;