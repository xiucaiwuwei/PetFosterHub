/**
 * 对话面板组件
 */
import React from 'react';
import { motion } from 'framer-motion';
import { DialogMessageList, MessageInput } from '../';
import type { Message } from '../../types/entity/Message';
import type { UserInfo } from '../../types/entity/Conversation';

interface ConversationPanelProps {
  selectedConversation: {
    conversationId: string;
    otherUser: UserInfo;
  } | undefined;
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  error: string;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  selectedConversation,
  messages,
  isLoading,
  onSendMessage,
  error,
}) => {
  if (!selectedConversation) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-6xl mb-4 text-gray-200">💬</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">选择一个对话开始聊天</h2>
        <p className="text-gray-500 max-w-md">
          从左侧列表中选择一个对话，或者开始一个新的对话与宠物主人交流
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="h-full flex flex-col bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white">
                  {selectedConversation.otherUser && selectedConversation.otherUser.name 
                    ? selectedConversation.otherUser.name.charAt(0).toUpperCase()
                    : '?'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedConversation.otherUser && selectedConversation.otherUser.name 
                      ? selectedConversation.otherUser.name
                      : '未知用户'}
                  </h3>
            <p className="text-xs text-green-500">在线</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-gray-500">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
              ></path>
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

      <DialogMessageList messages={messages} isLoading={isLoading} />
      <MessageInput onSendMessage={onSendMessage} />
    </motion.div>
  );
};