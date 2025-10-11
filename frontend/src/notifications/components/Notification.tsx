import React, { useEffect, useRef } from 'react';
import { Notification as NotificationType, NotificationType as Type } from '../types';
import { cn } from '@/lib/utils';

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => Promise<void>;
  onRead: (id: string) => Promise<void>;
  className?: string;
}

export function Notification({
  notification,
  onClose,
  onRead,
  className = ''
}: NotificationProps) {
  const { id, title, message, type, onClick, duration = 5000, isRead } = notification;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());

  // 处理通知点击事件
  const handleClick = () => {
    onRead(id);
    if (onClick) {
      onClick();
    }
  };

  // 处理关闭按钮点击事件
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose(id);
  };

  // 设置自动关闭定时器和进度条
  useEffect(() => {
    startTimeRef.current = Date.now();
    
    if (duration > 0) {
      timerRef.current = setTimeout(() => {
        onClose(id);
      }, duration);
    }

    // 更新进度条
    const updateProgress = () => {
      if (progressRef.current && duration > 0) {
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.max(0, 1 - (elapsed / duration));
        progressRef.current.style.width = `${progress * 100}%`;
      }
    };

    const interval = setInterval(updateProgress, 50);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      clearInterval(interval);
    };
  }, [id, onClose, duration]);

  // 根据通知类型获取对应的样式和图标
  const getNotificationStyles = () => {
    switch (type) {
      case Type.SUCCESS:
        return {
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          icon: 'fa-check-circle',
          iconColor: 'text-green-500'
        };
      case Type.ERROR:
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          icon: 'fa-exclamation-circle',
          iconColor: 'text-red-500'
        };
      case Type.WARNING:
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          icon: 'fa-exclamation-triangle',
          iconColor: 'text-yellow-500'
        };
      case Type.INFO:
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          icon: 'fa-info-circle',
          iconColor: 'text-blue-500'
        };
      case Type.DEFAULT:
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          icon: 'fa-bell',
          iconColor: 'text-gray-500'
        };
    }
  };

  const { bgColor, textColor, icon, iconColor } = getNotificationStyles();

  return (
    <div
      className={cn(
        'flex items-start p-4 rounded-lg border shadow-md transition-all duration-300 animate-fade-in',
        'hover:shadow-lg cursor-pointer relative overflow-hidden',
        bgColor,
        textColor,
        className
      )}
      onClick={handleClick}
      role="alert"
      aria-live="assertive"
    >
      {/* 未读指示器 */}
      {!isRead && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></div>
      )}
      
      {/* 通知图标 */}
      <div className="mr-3 mt-0.5 flex-shrink-0">
        <i className={cn('fa-solid', icon, iconColor, 'text-xl')}></i>
      </div>
      
      {/* 通知内容 */}
      <div className="flex-grow min-w-0">
        {title && (
          <h3 className="font-medium text-sm mb-1 truncate">{title}</h3>
        )}
        <p className="text-sm leading-relaxed truncate">{message}</p>
      </div>
      
      {/* 关闭按钮 */}
      <button
        className="ml-2 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
        onClick={handleClose}
        aria-label="关闭通知"
      >
        <i className="fa-solid fa-times"></i>
      </button>
      
      {/* 自动关闭进度条 */}
      {duration > 0 && (
        <div 
          ref={progressRef}
          className="absolute bottom-0 left-0 h-0.5 bg-opacity-50 transition-all"
          style={{
            backgroundColor: iconColor.replace('text-', ''),
            transitionProperty: 'width',
            transitionTimingFunction: 'linear'
          }}
        ></div>
      )}
    </div>
  );
}