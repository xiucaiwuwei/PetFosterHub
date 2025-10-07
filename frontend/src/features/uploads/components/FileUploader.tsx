/*
 * 文件上传组件
 * 提供文件选择和上传的用户界面
 */
import React, { useRef, useState } from 'react';
import { useFileUpload } from '../hooks';
import { FileTypes } from '../types/enums/A_index';
import { getFileType, formatFileSize } from '../utils';

/**
 * 文件上传组件属性
 */
export interface FileUploaderProps {
  /** 允许的文件类型数组 */
  allowedTypes?: FileTypes[];
  /** 最大文件大小（字节） */
  maxSize?: number;
  /** 是否允许多文件上传 */
  multiple?: boolean;
  /** 上传按钮文本 */
  buttonText?: string;
  /** 上传按钮样式类名 */
  buttonClassName?: string;
  /** 上传区域样式类名 */
  uploadAreaClassName?: string;
  /** 提示文本 */
  hintText?: string;
  /** 文件选择回调 */
  onFileSelect?: (files: File[]) => void;
  /** 文件上传成功回调 */
  onUploadSuccess?: (fileUrl: string) => void;
  /** 文件上传失败回调 */
  onUploadError?: (error: string) => void;
  /** 是否使用分块上传 */
  useChunkUpload?: boolean;
  /** 是否显示上传进度 */
  showProgress?: boolean;
  /** 是否自动上传文件 */
  autoUpload?: boolean;
}

/**
 * 文件上传组件
 * 提供拖拽上传和点击上传两种方式
 */
export const FileUploader: React.FC<FileUploaderProps> = ({
  allowedTypes,
  maxSize,
  multiple = false,
  buttonText = '选择文件',
  buttonClassName = '',
  uploadAreaClassName = '',
  hintText,
  onFileSelect,
  onUploadSuccess,
  onUploadError,
  useChunkUpload = false,
  showProgress = true,
  autoUpload = true
}) => {
  const { addFile, uploadTasks, updateConfig } = useFileUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // 初始化自动上传配置
  React.useEffect(() => {
    updateConfig({ autoUpload });
  }, [autoUpload, updateConfig]);
  
  // 监听上传任务状态变化
  React.useEffect(() => {
    uploadTasks.forEach(task => {
      if (task.status === 'success' && task.response && onUploadSuccess) {
        onUploadSuccess(task.response.url);
      } else if (task.status === 'error' && task.error && onUploadError) {
        onUploadError(task.error);
      }
    });
  }, [uploadTasks, onUploadSuccess, onUploadError]);

  /**
   * 处理文件选择
   */
  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files);
    
    // 过滤文件
    const validFiles = selectedFiles.filter(file => {
      const fileType = getFileType(file);
      const typeValid = !allowedTypes || allowedTypes.includes(fileType);
      const sizeValid = !maxSize || file.size <= maxSize;
      return typeValid && sizeValid;
    });

    // 调用回调
    if (onFileSelect) {
      onFileSelect(validFiles);
    }

    // 添加上传任务
    validFiles.forEach(file => {
      const fileType = getFileType(file);
      addFile(file, fileType, useChunkUpload);
    });
  };

  /**
   * 处理文件输入变化
   */
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files);
    // 重置文件输入，以便相同文件可以再次触发change事件
    if (event.target) {
      event.target.value = '';
    }
  };

  /**
   * 处理拖拽事件
   */
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    handleFileSelect(event.dataTransfer.files);
  };

  /**
   * 触发文件选择对话框
   */
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // 构建提示文本
  const buildHintText = () => {
    if (hintText) return hintText;
    
    let text = '点击或拖拽文件到此处上传';
    
    if (allowedTypes?.length) {
      const typeNames = allowedTypes.map(type => type.toLowerCase());
      text += ` (支持: ${typeNames.join(', ')})`;
    }
    
    if (maxSize) {
      text += `，最大 ${formatFileSize(maxSize)}`;
    }
    
    return text;
  };

  /**
   * 渲染上传任务进度条
   */
  const renderUploadTasks = () => {
    if (!showProgress || uploadTasks.length === 0) return null;
    
    return (
      <div className="mt-6 space-y-4">
        {uploadTasks.map(task => (
          <div key={task.id} className="rounded-lg overflow-hidden">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="truncate max-w-[70%]">{task.file.name}</span>
              <span className="text-gray-500">
                {task.status === 'uploading' ? `${task.progress}%` : 
                 task.status === 'success' ? '成功' : 
                 task.status === 'error' ? '失败' : '等待'}
              </span>
            </div>
            
            {/* 进度条 */}
            {task.status === 'uploading' && (
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 ease-out" 
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            )}
            
            {/* 错误信息 */}
            {task.status === 'error' && task.error && (
              <p className="mt-1 text-xs text-red-500">{task.error}</p>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="relative">
      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />
      
      {/* 拖拽上传区域 */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
          ${uploadAreaClassName}`}
        onClick={triggerFileSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          {/* 上传图标 */}
          <div className="text-gray-500 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          
          {/* 上传按钮 */}
          <button
            type="button"
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors
              ${buttonClassName}`}
            onClick={(e) => {
              e.stopPropagation();
              triggerFileSelect();
            }}
          >
            {buttonText}
          </button>
          
          {/* 提示文本 */}
          <p className="mt-2 text-sm text-gray-500">
            {buildHintText()}
          </p>
        </div>
      </div>
      
      {/* 上传任务进度 */}
      {renderUploadTasks()}
    </div>
  );
};