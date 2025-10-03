import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Conversation } from '../../types/entity/Conversation';
import { MessageItem } from './MessageItem';
import { MessageStatusBadge } from '../dialog/MessageStatusBadge';

/**
 * 增强版消息列表组件 - 显示对话列表概览
 * 与dialog/MessageList.tsx的区别：
 * - 本组件用于展示对话列表的概览视图
 * - 支持更丰富的筛选和排序功能
 * - 提供快捷操作按钮
 */
interface MessageListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  isLoading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onMarkAsRead: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  currentUserId: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  conversations,
  selectedConversation,
  isLoading,
  onSelectConversation,
  onMarkAsRead,
  onDeleteConversation,
  currentUserId,
}) => {
  const [expandedConversationId, setExpandedConversationId] = useState<string | null>(null);

  // 动画配置
  const ITEM_ANIMATIONS = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 }
  };

  // 渲染加载状态
  const renderLoadingState = () => (
    <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mb-3"></div>
        <p className="text-gray-500 text-sm">加载对话列表中...</p>
      </div>
    </div>
  );

  // 渲染空状态
  const renderEmptyState = () => (
    <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="text-6xl mb-4 text-gray-200">💬</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">暂无对话</h3>
        <p className="text-gray-500 max-w-md">
          开始新的对话，与宠物主人或寄养家庭建立联系
        </p>
      </div>
    </div>
  );

  // 切换对话展开/收起状态
  const toggleConversationExpand = (conversationId: string) => {
    setExpandedConversationId(expandedConversationId === conversationId ? null : conversationId);
  };

  // 处理删除对话
  const handleDeleteConversation = (conversationId: string) => {
    if (window.confirm('确定要删除这条对话吗？此操作不可撤销。')) {
      onDeleteConversation(conversationId);
    }
  };

  // 处理标记为已读
  const handleMarkAsRead = (conversationId: string) => {
    onMarkAsRead(conversationId);
  };

  // 按未读状态和时间排序对话，确保conversations是一个数组
  const sortedConversations = [...(Array.isArray(conversations) ? conversations : [])].sort((a, b) => {
    // 先按未读状态排序
    if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
    if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
    // 再按最新消息时间排序
    const aTime = typeof a.lastMessage?.createdAt === 'string' 
      ? new Date(a.lastMessage.createdAt).getTime() 
      : (a.lastMessage?.createdAt as Date)?.getTime() || 0;
    const bTime = typeof b.lastMessage?.createdAt === 'string' 
      ? new Date(b.lastMessage.createdAt).getTime() 
      : (b.lastMessage?.createdAt as Date)?.getTime() || 0;
    return bTime - aTime;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      {isLoading ? (
        renderLoadingState()
      ) : !Array.isArray(conversations) || conversations.length === 0 ? (
        renderEmptyState()
      ) : (
        <AnimatePresence mode="popLayout">
          {sortedConversations.map((conversation) => (
            <MessageItem
              key={conversation.conversationId}
              conversation={conversation}
              isSelected={selectedConversation?.conversationId === conversation.conversationId}
              isExpanded={expandedConversationId === conversation.conversationId}
              onSelect={onSelectConversation}
              onToggleExpand={toggleConversationExpand}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteConversation}
              currentUserId={currentUserId}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};