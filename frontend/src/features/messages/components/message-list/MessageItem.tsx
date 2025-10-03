import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Conversation } from '../../types/entity/Conversation';
import { formatDate } from '../../utils/validationUtils';
import { MessageStatusBadge } from '../dialog/MessageStatusBadge';

interface MessageItemProps {
  conversation: Conversation;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (conversation: Conversation) => void;
  onToggleExpand: (conversationId: string) => void;
  onMarkAsRead: (conversationId: string) => void;
  onDelete: (conversationId: string) => void;
  currentUserId: string;
}

/**
 * 消息列表中的单个消息项组件
 * 负责渲染对话列表中的每一项
 */
export const MessageItem = forwardRef<HTMLDivElement, MessageItemProps>(({
  conversation,
  isSelected,
  isExpanded,
  onSelect,
  onToggleExpand,
  onMarkAsRead,
  onDelete,
  currentUserId,
}, ref) => {
  const userName = conversation.otherUser.name;
  const userAvatar = conversation.otherUser.avatar;
  const lastMessageDate = formatDate(new Date(conversation.lastMessage.createdAt));
  const lastMessageContent = conversation.lastMessage.content;
  const isUnread = conversation.unreadCount > 0;

  // 处理删除对话
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('确定要删除这条对话吗？此操作不可撤销。')) {
      onDelete(conversation.conversationId);
    }
  };

  // 处理标记为已读
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(conversation.conversationId);
  };

  // 动画配置
  const ITEM_ANIMATIONS = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 }
  };

  return (
    <motion.div
      ref={ref}
      key={conversation.conversationId}
      className={cn(
        'flex items-start p-3 border-b border-gray-100 cursor-pointer transition-all',
        isSelected ? 'bg-orange-50' : 'hover:bg-gray-50',
        isUnread ? 'bg-white shadow-sm' : ''
      )}
      onClick={() => onSelect(conversation)}
      {...ITEM_ANIMATIONS}
    >
      {/* 用户头像 */}
      <div className="relative flex-shrink-0">
        <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-200">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {isUnread && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </span>
        )}
      </div>

      {/* 对话内容 */}
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-semibold text-gray-800 truncate">
            {userName}
          </h4>
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
              {lastMessageDate}
            </span>
            <button
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(conversation.conversationId);
              }}
            >
              <i className={`fa-solid ${isExpanded ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
            </button>
          </div>
        </div>
        <div className="mt-1 flex items-center">
          {conversation.lastMessage.senderId === currentUserId && (
            <MessageStatusBadge 
              status={conversation.lastMessage.isRead ? 'read' : 'sent'} 
              className="mr-1" 
            />
          )}
          <p className={`text-sm truncate max-w-[calc(100%-20px)] ${isUnread ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
            {lastMessageContent}
          </p>
        </div>

        {/* 展开的操作菜单 */}
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-2 pt-2 border-t border-gray-100 flex space-x-2 overflow-hidden"
          >
            <button
              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              onClick={handleMarkAsRead}
            >
              <i className="fa-solid fa-check-double mr-1"></i>标记为已读
            </button>
            <button
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
              onClick={handleDelete}
            >
              <i className="fa-solid fa-trash mr-1"></i>删除对话
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});