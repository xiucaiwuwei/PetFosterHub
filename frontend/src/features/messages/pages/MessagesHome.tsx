/**
 * 消息页面 - 优化版
 */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { motion, AnimatePresence } from 'framer-motion';

// 导入自定义Hooks
import { useConversationList, useMessageList, useMessageForm } from '../hooks';

// 导入组件
import { MessageListSidebar, ConversationPanel, MessageList } from '../components';
import type { Conversation } from '../types/entity/Conversation';

/**
 * 消息页面组件
 */
export default function MessagesHome() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 控制对话屏蔽状态
  const [blockedConversations, setBlockedConversations] = useState<Record<string, boolean>>({});
  
  // 处理屏蔽状态切换
  const handleToggleBlock = (conversationId: string, blocked: boolean) => {
    setBlockedConversations(prev => ({
      ...prev,
      [conversationId]: blocked
    }));
    
    // 这里可以添加实际的API调用逻辑，保存屏蔽状态到服务器
  };
  
  // 当前用户ID (模拟登录用户为赵强，ID为u4)
  const currentUserId = 'u4';

  // 使用自定义Hooks
  const {
    conversations,
    selectedConversation,
    isLoading: isLoadingConversations,
    totalUnreadCount,
    handleSelectConversation,
    refreshConversations
  } = useConversationList(currentUserId);

  const {
    messages,
    isLoading: isLoadingMessages,
    messagesEndRef,
    refreshMessages
  } = useMessageList(
    selectedConversation?.conversationId || null,
    currentUserId
  );

  const {
    messageContent,
    error,
    isSubmitting,
    handleContentChange,
    handleSubmit,
    handleSendImage,
    resetForm
  } = useMessageForm(
    selectedConversation?.conversationId || null,
    selectedConversation?.otherUser.id || null,
    currentUserId
  );

  // 处理移动端菜单切换
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // 处理键盘事件 - 按Enter发送消息，按Shift+Enter换行
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // 处理窗口大小变化，在桌面端自动关闭移动端菜单
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // 如果未登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-grow flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md w-full transform hover:shadow-xl transition-all duration-300"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-envelope text-3xl text-orange-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">请先登录</h2>
            <p className="text-gray-600 mb-6">登录后即可查看和发送消息，与寄养提供者或宠物主人保持联系</p>
            <a
              href="/src/features/auth/pages/Login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out transform hover:scale-105"
            >
              前往登录
            </a>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden">
      {/* 为顶部导航栏留出空间 */}
      <main className="flex-grow flex flex-col md:flex-row pt-16">
        {/* 桌面端左右结构布局 */}
        <div className="hidden md:block w-96 border-r border-gray-200 bg-white h-full overflow-y-auto">
          <MessageListSidebar
            conversations={conversations}
            selectedConversationId={selectedConversation?.conversationId || null}
            isLoadingConversations={isLoadingConversations}
            totalUnreadCount={totalUnreadCount}
            onSelectConversation={handleSelectConversation}
            onRefreshConversations={refreshConversations}
            currentUserId={currentUserId}
          />
        </div>
        
        {/* 右侧对话面板 */}
        <div className="flex-grow flex flex-col bg-white h-full overflow-y-auto">
          <ConversationPanel
            selectedConversation={selectedConversation ? { conversationId: selectedConversation.conversationId, otherUser: selectedConversation.otherUser } : undefined}
            messages={messages}
            isLoading={isLoadingMessages}
            onSendMessage={handleSubmit}
            onSendImage={handleSendImage}
            error={error || ''}
            isBlocked={selectedConversation ? blockedConversations[selectedConversation.conversationId] || false : false}
            onToggleBlock={(blocked) => {
              if (selectedConversation) {
                handleToggleBlock(selectedConversation.conversationId, blocked);
              }
            }}
          />
        </div>
        
        {/* 移动端对话列表覆盖层 */}
        <AnimatePresence>
          {isMobileMenuOpen && selectedConversation && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden absolute inset-0 bg-white z-30 overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <button 
                  onClick={toggleMobileMenu} 
                  className="text-gray-500 hover:text-orange-500 transition-colors"
                >
                  <i className="fa-solid fa-arrow-left mr-2"></i>返回
                </button>
                <h2 className="text-lg font-semibold text-gray-900">选择对话</h2>
              </div>
              
              <MessageList
                conversations={conversations}
                selectedConversation={selectedConversation}
                isLoading={isLoadingConversations}
                onSelectConversation={(conversation: Conversation) => {
                  handleSelectConversation(conversation);
                  toggleMobileMenu();
                }}
                onMarkAsRead={() => {}}
                onDeleteConversation={() => {}}
                currentUserId={currentUserId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
