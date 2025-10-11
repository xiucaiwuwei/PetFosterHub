import React from 'react';
import { Notification } from './Notification';
import { useNotifications } from '../contexts/NotificationsContext';
import { cn } from '@/lib/utils';

interface NotificationsListProps {
  className?: string;
}

export function NotificationsList({ className = '' }: NotificationsListProps) {
  const { notifications, removeNotification, markAsRead, loading } = useNotifications();

  // 处理关闭通知（异步操作）
  const handleClose = async (id: string) => {
    try {
      await removeNotification(id);
    } catch (error) {
      console.error('关闭通知失败:', error);
    }
  };

  // 处理标记为已读（异步操作）
  const handleRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('标记通知已读失败:', error);
    }
  };

  // 显示加载状态
  if (loading && notifications.length === 0) {
    return (
      <div className={cn('text-center p-8 text-gray-500', className)}>
        <i className="fa-solid fa-circle-notch fa-spin text-4xl mb-3 opacity-50"></i>
        <p className="text-sm">加载通知中...</p>
      </div>
    );
  }

  // 如果没有通知，显示空状态
  if (!loading && notifications.length === 0) {
    return (
      <div className={cn('text-center p-8 text-gray-500', className)}>
        <i className="fa-solid fa-bell-slash text-4xl mb-3 opacity-50"></i>
        <p className="text-sm">暂无通知</p>
      </div>
    );
  }

  // 将通知按时间倒序排列（最新的在前）
  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div 
      className={cn('space-y-3', className)}
      role="feed"
      aria-live="polite"
    >
      {sortedNotifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={handleClose}
          onRead={handleRead}
          className="transform transition-transform hover:-translate-y-1"
        />
      ))}
    </div>
  );
}