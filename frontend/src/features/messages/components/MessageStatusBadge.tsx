/**
 * 消息状态徽章组件
 */
import { cn } from '@/lib/utils';

/**
 * 消息状态类型
 */
export type MessageStatus = 'unread' | 'read' | 'sending' | 'sent' | 'failed';

/**
 * 消息状态徽章组件的属性接口
 */
export interface MessageStatusBadgeProps {
  status: MessageStatus;
  className?: string;
}

/**
 * 消息状态徽章组件
 */
export const MessageStatusBadge = ({ status, className = '' }: MessageStatusBadgeProps) => {
  // 根据状态确定徽章样式和文本
  const getStatusInfo = () => {
    switch (status) {
      case 'unread':
        return {
          text: '未读',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: 'fa-circle-dot'
        };
      case 'read':
        return {
          text: '已读',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: 'fa-check-circle-dot'
        };
      case 'sending':
        return {
          text: '发送中',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: 'fa-spinner fa-spin'
        };
      case 'sent':
        return {
          text: '已发送',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'fa-paper-plane'
        };
      case 'failed':
        return {
          text: '发送失败',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: 'fa-xmark-circle'
        };
      default:
        return {
          text: '未知',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: 'fa-question-circle'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        statusInfo.color,
        className
      )}
    >
      <i className={`fa-solid ${statusInfo.icon} mr-1`}></i>
      {statusInfo.text}
    </span>
  );
};