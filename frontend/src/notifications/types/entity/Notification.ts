import { NotificationType } from '../enums';

// 通知接口定义
export interface Notification {
  id: string;
  title?: string;
  message: string;
  type: NotificationType;
  timestamp: number;
  duration?: number; // 显示时长(ms)，默认为5000ms
  isRead: boolean;
  onClick?: () => void;
  onClose?: () => void;
}