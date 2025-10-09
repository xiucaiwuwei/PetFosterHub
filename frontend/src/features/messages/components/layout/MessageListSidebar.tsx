import React, { useState } from 'react';
import { MessageListHeader, MessageTabs, MessageList } from '../';
import type { Conversation } from '../../types/entity/Conversation';

interface MessageListSidebarProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  isLoadingConversations: boolean;
  totalUnreadCount: number;
  onSelectConversation: (conversation: Conversation) => void;
  onRefreshConversations: () => void;
  currentUserId: string;
  currentUserStatus?: Map<string, 'online' | 'offline' | 'away'>;
  onMarkAsRead?: (conversationId: string) => void;
  onDeleteConversation?: (conversationId: string) => void;
}

export const MessageListSidebar: React.FC<MessageListSidebarProps> = ({
  conversations,
  selectedConversationId,
  isLoadingConversations,
  totalUnreadCount,
  onSelectConversation,
  onRefreshConversations,
  currentUserId,
  currentUserStatus = new Map(),
  onMarkAsRead = () => console.warn('onMarkAsRead not implemented'),
  onDeleteConversation = () => console.warn('onDeleteConversation not implemented'),
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'important'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 根据选项卡过滤对话
  const filteredConversations = conversations
    .filter(conversation => {
      // 先根据搜索查询过滤
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          conversation.otherUser.name.toLowerCase().includes(searchLower) ||
          (conversation.lastMessage &&
            conversation.lastMessage.content.toLowerCase().includes(searchLower))
        );
      }
      return true;
    })
    .filter(conversation => {
      // 然后根据选项卡过滤
      if (activeTab === 'unread') return conversation.unreadCount > 0;
      if (activeTab === 'important') return conversation.unreadCount > 3;
      return true;
    })
    .sort((a, b) => {
      // 按最新消息时间排序
      const aTime = typeof a.lastMessage?.createdAt === 'string'
        ? new Date(a.lastMessage.createdAt).getTime()
        : (a.lastMessage?.createdAt as Date)?.getTime() || 0;
      const bTime = typeof b.lastMessage?.createdAt === 'string'
        ? new Date(b.lastMessage.createdAt).getTime()
        : (b.lastMessage?.createdAt as Date)?.getTime() || 0;
      return bTime - aTime;
    });

  const handleTabChange = (tab: 'all' | 'unread' | 'important') => {
    setActiveTab(tab);
  };

  // 获取当前选中的对话对象
  const selectedConversation = conversations.find(conversation =>
    conversation.conversationId === selectedConversationId
  ) || null;

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <MessageListHeader
        unreadCount={totalUnreadCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={onRefreshConversations}
      />

      <MessageTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <MessageList
        conversations={filteredConversations}
        selectedConversation={selectedConversation}
        isLoading={isLoadingConversations}
        onSelectConversation={onSelectConversation}
        onMarkAsRead={onMarkAsRead}
        onDeleteConversation={onDeleteConversation}
        currentUserId={currentUserId}
        currentUserStatus={currentUserStatus}
      />
    </div>
  );
};