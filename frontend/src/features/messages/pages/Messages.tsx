/**
 * 消息页面
 */
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar.tsx';
import { Footer } from '@/features/home/components/Footer.tsx';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';

// 导入自定义Hooks
import { useConversationList, useMessageList, useMessageForm } from '../hooks';

// 导入组件
import { ConversationList, MessageList, MessageInput } from '../components';

/**
 * 消息页面组件
 */
export default function Messages() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 当前用户ID (模拟登录用户为赵强，ID为u4)
  const currentUserId = 'u4';

  // 使用自定义Hooks
  const {
    conversations,
    selectedConversation,
    isLoading: isLoadingConversations,
    handleSelectConversation,
    refreshConversations
  } = useConversationList(currentUserId);

  const {
    messages,
    isLoading: isLoadingMessages,
    messagesEndRef
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
    resetForm
  } = useMessageForm(
    selectedConversation?.conversationId || null,
    selectedConversation?.otherUser.id || null
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

  // 如果未登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-envelope text-2xl text-orange-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">请先登录</h2>
            <p className="text-gray-500 mb-6">登录后即可查看和发送消息</p>
            <a
              href="/src/features/auth/pages/Login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out"
            >
              前往登录
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-grow flex flex-col md:flex-row pt-16">
        {/* 对话列表 - 桌面版 */}
        <div className="hidden md:block w-80 border-r border-gray-200 bg-white h-[calc(100vh-112px)] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">消息</h2>
          </div>
          
          <ConversationList
            conversations={conversations}
            selectedConversationId={selectedConversation?.conversationId || null}
            onSelectConversation={handleSelectConversation}
            currentUserId={currentUserId}
          />
        </div>
        
        {/* 消息内容区域 */}
        <div className="flex-grow flex flex-col bg-white h-[calc(100vh-112px)]">
          {/* 移动端顶部栏 */}
          <div className="md:hidden border-b border-gray-200 p-4 flex items-center justify-between">
            {selectedConversation ? (
              <>
                <button onClick={toggleMobileMenu} className="text-gray-500">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="flex items-center">
                  <img
                    src={selectedConversation.otherUser.avatar}
                    alt={selectedConversation.otherUser.name}
                    className="w-8 h-8 rounded-full object-cover mr-2"
                  />
                  <span className="font-medium">{selectedConversation.otherUser.name}</span>
                </div>
                <button className="text-gray-500">
                  <i className="fa-solid fa-ellipsis-v"></i>
                </button>
              </>
            ) : (
              <h2 className="text-lg font-semibold text-gray-900">消息</h2>
            )}
          </div>
          
          {/* 移动端对话列表 */}
          {isMobileMenuOpen && selectedConversation && (
            <div className="md:hidden absolute top-16 left-0 right-0 bottom-0 bg-white z-10 overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <button onClick={toggleMobileMenu} className="text-gray-500">
                  <i className="fa-solid fa-arrow-left mr-2"></i>返回
                </button>
                <h2 className="text-lg font-semibold text-gray-900">选择对话</h2>
              </div>
              
              <ConversationList
                conversations={conversations}
                selectedConversationId={selectedConversation.conversationId}
                onSelectConversation={(conversation) => {
                  handleSelectConversation(conversation);
                  toggleMobileMenu();
                }}
                currentUserId={currentUserId}
              />
            </div>
          )}
          
          {/* 消息列表 */}
          {selectedConversation ? (
            <>
              <MessageList
                messages={messages}
                currentUserId={currentUserId}
                otherUserAvatar={selectedConversation.otherUser.avatar}
                otherUserName={selectedConversation.otherUser.name}
                messagesEndRef={messagesEndRef}
                isLoading={isLoadingMessages}
              />
              
              {/* 消息输入区域 */}
              <MessageInput
                messageContent={messageContent}
                error={error}
                isSubmitting={isSubmitting}
                onContentChange={handleContentChange}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
              />
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-comments text-3xl text-orange-500"></i>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">选择一个对话开始聊天</h2>
              <p className="text-gray-500 max-w-md">
                查看和回复来自寄养提供者或宠物主人的消息，保持沟通畅通
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
