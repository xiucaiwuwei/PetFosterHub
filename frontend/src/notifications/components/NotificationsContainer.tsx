import React from 'react';
import { NotificationsList } from './NotificationsList';
import { cn } from '@/lib/utils';

interface NotificationsContainerProps {
  className?: string;
}

export function NotificationsContainer({ className = '' }: NotificationsContainerProps) {
  // 通知容器默认位置是页面右上角，固定定位
  return (
    <div
      className={cn(
        'fixed top-4 right-4 w-80 max-w-[90vw] z-50 p-2',
        className
      )}
      aria-label="通知中心"
    >
      <NotificationsList />
    </div>
  );
}