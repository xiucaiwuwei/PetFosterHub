import React, { forwardRef, useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { Conversation } from '../../types/entity/Conversation';
import { formatDate } from '../../utils/validationUtils';
import { MessageStatusBadge } from '../dialog/message/MessageStatusBadge';
import { getUserRoleDisplay, getRoleStyleClass } from '@/features/messages/utils/conversationUtils';

interface MessageItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (conversation: Conversation) => void;
  onToggleExpand: (conversationId: string) => void;
  onMarkAsRead: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  currentUserId: string;
  currentUserStatus?: Map<string, 'online' | 'offline' | 'away'>;
}

/**
 * 消息列表中的单个消息项组件
 * 负责渲染对话列表中的每一项
 */
const MessageItemComponent = forwardRef<HTMLDivElement, MessageItemProps>(({
  conversation,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onMarkAsRead,
  onDelete,
  currentUserId,
  currentUserStatus = new Map(),
}, ref) => {
  const userName = conversation.otherUser.name;
  const userAvatar = conversation.otherUser.avatar;
  const lastMessageDate = formatDate(new Date(conversation.lastMessage.createdAt));
  const lastMessageContent = conversation.lastMessage.content;
  const isUnread = conversation.unreadCount > 0;
  const isSentByMe = conversation.lastMessage.senderId === currentUserId;

  // 处理删除对话
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这条对话吗？此操作不可撤销。')) {
      onDelete(conversation.conversationId);
    }
    setSwipeOffset(0);
  };

  // 处理标记为已读
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(conversation.conversationId);
    setSwipeOffset(0);
  };

  // 获取用户状态
  const userStatus = currentUserStatus.get(conversation.otherUser.id.toString()) || 'offline';

  // 左滑相关状态和处理
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isTouching, setIsTouching] = useState(false);
  const [startX, setStartX] = useState(0);
  const maxSwipeOffset = 240; // 最大滑动距离，设置为240px确保三个按钮完整显示

  // 处理触摸开始
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsTouching(true);
    setStartX(e.touches[0].clientX);
  };

  // 处理触摸移动
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isTouching) return;
    
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    
    // 只允许向左滑动（负值），并且有最大滑动距离限制
    if (diff < 0) {
      setSwipeOffset(Math.max(-maxSwipeOffset, diff));
    } else if (swipeOffset < 0) {
      // 如果已经滑出，可以向右滑动关闭
      setSwipeOffset(Math.min(0, swipeOffset + diff));
    }
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    setIsTouching(false);
    
    // 如果滑动距离超过一半，则完全展开；否则收起
    if (swipeOffset < -maxSwipeOffset / 2) {
      setSwipeOffset(-maxSwipeOffset);
    } else {
      setSwipeOffset(0);
    }
  };

  // 处理置顶对话
  const handlePinConversation = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 使用onToggleExpand回调来实现置顶/取消置顶功能
    // 在实际应用中，父组件需要处理这个回调并更新对话的置顶状态
    onToggleExpand(conversation.conversationId);
    setSwipeOffset(0);
    
    // 显示操作反馈
    // 注意：Conversation接口中没有isPinned属性，这里直接使用操作文本
    const actionText = '置顶成功';
    
    // 创建一个临时的提示元素 - 改进样式使提示更明显
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-6 py-3 rounded-md shadow-xl z-50 transition-all duration-300';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 4px 12px rgba(168, 85, 247, 0.4)';
    toast.style.minWidth = '120px';
    toast.style.textAlign = 'center';
    toast.textContent = actionText;
    
    // 添加进入动画
    toast.style.transform = 'translate(-50%, 20px) scale(0.9)';
    toast.style.opacity = '0';
    document.body.appendChild(toast);
    
    // 触发重排后应用动画
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 0) scale(1)';
      toast.style.opacity = '1';
    }, 10);
    
    // 2.5秒后移除提示
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 20px) scale(0.9)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2500);
  };

  // 处理标记未读
  const handleMarkAsUnread = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 显示操作反馈
    // 注意：这里我们只是模拟标记未读功能
    // 实际应用中，应该调用API来更新服务器上的状态
    // 这里我们简单地显示一个提示
    
    setSwipeOffset(0);
    
    // 创建一个临时的提示元素 - 改进样式使提示更明显
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-md shadow-xl z-50 transition-all duration-300';
    toast.style.fontWeight = 'bold';
    toast.style.fontSize = '14px';
    toast.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
    toast.style.minWidth = '120px';
    toast.style.textAlign = 'center';
    toast.textContent = '已标记为未读';
    
    // 添加进入动画
    toast.style.transform = 'translate(-50%, 20px) scale(0.9)';
    toast.style.opacity = '0';
    document.body.appendChild(toast);
    
    // 触发重排后应用动画
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 0) scale(1)';
      toast.style.opacity = '1';
    }, 10);
    
    // 2.5秒后移除提示
    setTimeout(() => {
      toast.style.transform = 'translate(-50%, 20px) scale(0.9)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2500);
  };

  // 重置滑动状态
  const resetSwipe = () => {
    if (swipeOffset !== 0) {
      setSwipeOffset(0);
    }
  };

  const userRoleDisplay = getUserRoleDisplay(conversation);
  
  // 添加调试日志
  console.log('User role display:', userRoleDisplay);
  
  return (
    <div 
      ref={ref}
      key={conversation.conversationId}
      className="relative overflow-hidden"
    >
      <div
        className={cn(
            'flex items-start p-4 border-b border-gray-100 cursor-pointer transition-all duration-300 ease-in-out relative',
            isSelected 
              ? 'bg-orange-50 border-l-4 border-orange-400 shadow-sm' 
              : '',
            isUnread 
              ? 'bg-white' 
              : 'bg-gray-50 hover:bg-gray-100'
          )}
        onClick={() => {
          resetSwipe();
          onSelect(conversation);
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
            transform: `translateX(${swipeOffset}px)`,
            transition: 'transform 0.2s ease-out, background-color 0.3s ease, border-color 0.3s ease',
            zIndex: 20 // 确保消息选项卡覆盖在操作按钮上方
          }}
      >
        {/* 用户头像 - 增强视觉效果 */}
        <div className="relative flex-shrink-0">
          {/* 用户状态指示器 */}
          <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${userStatus === 'online' ? 'bg-green-500' : userStatus === 'away' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
            <div className="h-12 w-12 rounded-full overflow-hidden">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName} 
                  className="h-full w-full object-cover transition-opacity duration-300 ease-in-out"
                  loading="lazy" // 延迟加载图片
                  style={{ opacity: 0 }} // 初始透明
                  onLoad={(e) => {
                    // 图片加载完成后显示
                    setTimeout(() => {
                      (e.target as HTMLImageElement).style.opacity = '1';
                    }, 50);
                  }}
                  // 图片加载失败时显示默认头像
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.opacity = '0';
                    // 创建临时的error事件处理，防止循环调用
                    const tempErrorHandler = () => {
                      img.removeEventListener('error', tempErrorHandler);
                    };
                    img.addEventListener('error', tempErrorHandler);
                    // 设置默认头像
                    img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23FF9500'/%3E%3Ctext x='50' y='60' font-family='Arial' font-size='36' text-anchor='middle' fill='white'%3E${userName.charAt(0).toUpperCase()}%3C/text%3E%3C/svg%3E`;
                  }}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-white bg-orange-500">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          
          {isUnread && (
            <span 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-lg"
            >
              {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
            </span>
          )}
        </div>

        {/* 对话内容 - 优化布局和空间感 */}
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {userName}
                </h4>
                  <span className={`text-xs px-1.5 py-0.5 ${getRoleStyleClass(conversation)} rounded-full whitespace-nowrap`}>
                    {userRoleDisplay || '宠物主人'}
                  </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {lastMessageDate}
                </span>
                <button 
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSwipeOffset(swipeOffset === -maxSwipeOffset ? 0 : -maxSwipeOffset);
                  }}
                  title="显示操作菜单"
                >
                  <i className="fa-solid fa-ellipsis-vertical"></i>
                </button>
              </div>
            </div>
          
          <div className="mt-1 flex items-center">
            {isSentByMe && (
              <MessageStatusBadge 
                status={conversation.lastMessage.isRead ? 'read' : 'sent'} 
                className="mr-2"
              />
            )}
            
            <p 
              className={`text-sm truncate max-w-[calc(100%-20px)] 
                ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
            >
              {isSentByMe && '我: '}{lastMessageContent}
            </p>
          </div>
        </div>
      </div>
      
      {/* 操作按钮 - 固定在右侧，由消息选项卡覆盖，点击三点图标时通过选项卡左滑显示 */}
      <div className="absolute top-0 right-0 h-full flex items-center space-x-0 w-[240px] z-10">
        <button
          className="text-xs px-4 bg-purple-500 text-white flex items-center justify-center w-20 h-full"
          onClick={handlePinConversation}
          title="置顶对话"
        >
          <i className="fa-solid fa-thumbtack mr-1"></i>
          <div>置顶</div>
        </button>
        
        <button
          className="text-xs px-4 bg-blue-500 text-white flex items-center justify-center w-20 h-full"
          onClick={handleMarkAsUnread}
          title="标记未读"
        >
          <i className="fa-solid fa-envelope mr-1"></i>
          <div>未读</div>
        </button>
        
        <button
          className="text-xs px-4 bg-red-500 text-white flex items-center justify-center w-20 h-full"
          onClick={handleDelete}
          title="删除对话"
        >
          <i className="fa-solid fa-trash mr-1"></i>
          <div>删除</div>
        </button>
      </div>
    </div>
  );
});

// 性能优化：使用memo减少不必要的渲染
export const MessageItem = memo(MessageItemComponent, (prevProps, nextProps) => {
  // 只有当以下属性发生变化时才重新渲染
  return prevProps.conversation.conversationId === nextProps.conversation.conversationId &&
         prevProps.isSelected === nextProps.isSelected &&
         // 正确比较未读状态 - 使用conversation.unreadCount而不是isUnread属性
         prevProps.conversation.unreadCount === nextProps.conversation.unreadCount &&
         prevProps.currentUserId === nextProps.currentUserId &&
         prevProps.conversation.lastMessage.content === nextProps.conversation.lastMessage.content &&
         prevProps.conversation.lastMessage.isRead === nextProps.conversation.lastMessage.isRead &&
         prevProps.conversation.otherUser.name === nextProps.conversation.otherUser.name &&
         prevProps.conversation.otherUser.avatar === nextProps.conversation.otherUser.avatar;
});

// 显式定义displayName，便于调试
MessageItem.displayName = 'MessageItem';