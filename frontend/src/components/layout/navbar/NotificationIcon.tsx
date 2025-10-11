import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '@/notifications';
import type { Notification } from '@/notifications/types';
import { NotificationType } from '@/notifications/types/enums';

interface NotificationIconProps {
  isAuthenticated: boolean;
}

export function NotificationIcon({ isAuthenticated }: NotificationIconProps) {
  const { notifications, getUnreadCount, markAsRead, loadNotifications, loading } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 加载通知数据和更新未读数量
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated, loadNotifications]);

  // 更新未读数量
  useEffect(() => {
    setUnreadCount(getUnreadCount());
  }, [notifications, getUnreadCount]);

  // 添加点击外部区域关闭通知下拉菜单的功能
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 检查点击的元素是否在通知组件内部
      const notificationElement = document.querySelector('.notification-dropdown');
      const notificationIcon = document.querySelector('.notification-icon');

      if (notificationElement &&
        notificationIcon &&
        !notificationElement.contains(event.target as Node) &&
        !notificationIcon.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    // 添加全局点击事件监听器
    document.addEventListener('click', handleClickOutside);

    // 组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showNotifications]);

  // 添加全局样式定义
  useEffect(() => {
    // 创建或获取样式元素
    let styleElement = document.getElementById('navbar-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'navbar-styles';
      document.head.appendChild(styleElement);
    }

    // 定义slideDown动画
    styleElement.textContent = `
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .animate-slideDown {
        animation: slideDown 0.2s ease-out forwards;
      }
    `;

    // 组件卸载时移除样式元素
    return () => {
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="relative ml-4 notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
      <div className="flex items-center cursor-pointer hover:text-orange-500 transition-all duration-300 px-3 py-2 bg-white rounded-full shadow-sm hover:shadow-md border border-gray-100 hover:border-orange-300 transform hover:scale-105 relative group">
        <span className="relative inline-flex items-center">
          <i className="fa-solid fa-bell text-gray-500 hover:text-orange-500 transition-colors duration-300 group-hover:scale-110 transform origin-center"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-3 -right-5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse hover:scale-110 transition-transform duration-300">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </span>
        {/* 添加轻微的背景渐变效果 */}
        <span className="absolute inset-0 bg-gradient-to-r from-orange-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
      </div>

      {/* 通知下拉列表 */}
      {showNotifications && (
        <div className="notification-dropdown absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-slideDown transform origin-top-right">
          <div className="px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white flex justify-between items-center shadow-sm">
            <h3 className="font-semibold">通知消息</h3>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">{unreadCount} 条未读</span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              // 加载状态
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500 mb-2"></div>
                <p>加载通知中...</p>
              </div>
            ) : notifications.length === 0 ? (
              // 空状态
              <div className="px-4 py-12 text-center text-gray-500">
                <i className="fa-solid fa-bell-slash text-4xl mb-3 text-gray-300"></i>
                <p>暂无通知消息</p>
              </div>
            ) : (
              // 通知列表
              notifications.map((notification: Notification) => {
                // 根据通知类型选择图标
                const getIconByType = () => {
                  switch (notification.type) {
                    case NotificationType.SUCCESS:
                      return { icon: 'fa-check-circle', color: 'text-green-600', bgColor: 'bg-green-200' };
                    case NotificationType.ERROR:
                      return { icon: 'fa-circle-xmark', color: 'text-red-600', bgColor: 'bg-red-200' };
                    case NotificationType.WARNING:
                      return { icon: 'fa-triangle-exclamation', color: 'text-yellow-600', bgColor: 'bg-yellow-200' };
                    case NotificationType.INFO:
                    default:
                      return { icon: 'fa-circle-info', color: 'text-blue-600', bgColor: 'bg-blue-200' };
                  }
                };

                const iconInfo = getIconByType();
                
                // 格式化时间
                const formatTime = (timestamp: number) => {
                  const now = Date.now();
                  const diff = now - timestamp;
                  const minutes = Math.floor(diff / (1000 * 60));
                  const hours = Math.floor(diff / (1000 * 60 * 60));
                  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

                  if (minutes < 60) return `${minutes}分钟前`;
                  if (hours < 24) return `${hours}小时前`;
                  if (days < 7) return `${days}天前`;
                  
                  const date = new Date(timestamp);
                  return `${date.getMonth() + 1}月${date.getDate()}日`;
                };

                return (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-orange-100 ${notification.isRead ? '' : 'bg-orange-50'}`}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification.id);
                      }
                      if (notification.onClick) {
                        notification.onClick();
                      }
                    }}
                  >
                    <div className="flex items-start">
                      <div className={`w-8 h-8 rounded-full ${iconInfo.bgColor} flex items-center justify-center mr-3 mt-1`}>
                        <i className={`fa-solid ${iconInfo.icon} ${iconInfo.color}`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-gray-800">{notification.title || '通知'}</h4>
                          <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <Link
              to="/messages"
              className="text-sm text-orange-600 hover:text-orange-700 font-medium flex justify-center w-full py-1 rounded hover:bg-orange-50 transition-colors duration-200"
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifications(false);
              }}
            >
              查看全部消息
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}