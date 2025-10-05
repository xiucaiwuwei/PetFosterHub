/*
 * 上传进度组件
 * 显示文件上传的进度和状态
 */
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { formatFileSize } from '../utils';
import { UploadTask } from '../slice/uploadSlice';

/**
 * 上传进度组件属性
 */
export interface UploadProgressProps {
  /** 组件样式类名 */
  className?: string;
  /** 是否显示文件大小 */
  showFileSize?: boolean;
  /** 是否显示上传速度 */
  showUploadSpeed?: boolean;
  /** 是否显示剩余时间 */
  showRemainingTime?: boolean;
  /** 是否显示状态文本 */
  showStatusText?: boolean;
}

/**
 * 上传进度组件
 * 显示当前所有上传任务的进度和状态
 */
export const UploadProgress: React.FC<UploadProgressProps> = ({
  className = '',
  showFileSize = true,
  showUploadSpeed = false,
  showRemainingTime = false,
  showStatusText = true
}) => {
  const { currentTasks } = useSelector((state: RootState) => state.uploads);

  /**
   * 获取上传状态的文本表示
   */
  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      idle: '等待上传',
      uploading: '上传中',
      success: '上传成功',
      error: '上传失败'
    };
    return statusMap[status] || status;
  };

  /**
   * 获取上传状态的样式类名
   */
  const getStatusClassName = (status: string): string => {
    const statusMap: Record<string, string> = {
      idle: 'text-gray-500',
      uploading: 'text-blue-500',
      success: 'text-green-500',
      error: 'text-red-500'
    };
    return statusMap[status] || 'text-gray-500';
  };

  /**
   * 计算上传速度
   */
  const calculateUploadSpeed = (task: UploadTask): string => {
    if (task.status !== 'uploading' || !task.progress || task.progress === 0) {
      return '--';
    }
    
    const elapsedTime = (Date.now() - task.startTime) / 1000; // 秒
    const uploadedBytes = (task.file.size * task.progress) / 100;
    const bytesPerSecond = uploadedBytes / elapsedTime;
    
    return formatFileSize(bytesPerSecond) + '/s';
  };

  /**
   * 计算剩余时间
   */
  const calculateRemainingTime = (task: UploadTask): string => {
    if (task.status !== 'uploading' || !task.progress || task.progress === 0 || task.progress === 100) {
      return '--';
    }
    
    const elapsedTime = (Date.now() - task.startTime) / 1000; // 秒
    const remainingTime = (elapsedTime / task.progress) * (100 - task.progress);
    
    if (remainingTime < 60) {
      return `${Math.ceil(remainingTime)}秒`;
    } else if (remainingTime < 3600) {
      return `${Math.ceil(remainingTime / 60)}分钟`;
    } else {
      return `${Math.ceil(remainingTime / 3600)}小时`;
    }
  };

  // 如果没有上传任务，不显示组件
  if (currentTasks.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-800 mb-3">上传队列</h3>
      
      <div className="space-y-3">
        {currentTasks.map((task: UploadTask) => (
          <div key={task.id} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-medium text-gray-700 truncate max-w-[50%]">
                  {task.file.name}
                </span>
                {showFileSize && (
                  <span className="ml-2 text-sm text-gray-500">
                    ({formatFileSize(task.file.size)})
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                {showUploadSpeed && (
                  <span className="text-sm text-gray-500">
                    {calculateUploadSpeed(task)}
                  </span>
                )}
                
                {showRemainingTime && (
                  <span className="text-sm text-gray-500">
                    剩余: {calculateRemainingTime(task)}
                  </span>
                )}
                
                {showStatusText && (
                  <span className={`text-sm font-medium ${getStatusClassName(task.status)}`}>
                    {getStatusText(task.status)}
                    {task.error && `: ${task.error}`}
                  </span>
                )}
              </div>
            </div>
            
            {/* 进度条 */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300
                  ${task.status === 'uploading' ? 'bg-blue-500' : ''}
                  ${task.status === 'success' ? 'bg-green-500' : ''}
                  ${task.status === 'error' ? 'bg-red-500' : ''}
                `}
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};