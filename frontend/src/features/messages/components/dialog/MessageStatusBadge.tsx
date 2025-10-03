/**
 * 消息状态徽章组件
 */
import React from 'react';
import { cn } from '@/lib/utils';

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

interface MessageStatusBadgeProps {
  status?: MessageStatus;
  className?: string;
}

export const MessageStatusBadge: React.FC<MessageStatusBadgeProps> = ({ status = 'sent', className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'read':
        return {
          icon: (
            <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          ),
          color: 'text-green-500',
        };
      case 'sending':
        return {
          icon: (
            <div className="w-3 h-3 border-2 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
          ),
          color: 'text-gray-400',
        };
      case 'sent':
        return {
          icon: (
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          ),
          color: 'text-gray-400',
        };
      case 'delivered':
        return {
          icon: (
            <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          ),
          color: 'text-blue-500',
        };
      default:
        return {
          icon: null,
          color: '',
        };
    }
  };

  const { icon, color } = getStatusConfig();

  if (!icon) return null;

  return (
    <span className={cn('flex items-center justify-center ml-1', color, className)}>
      {icon}
    </span>
  );
};