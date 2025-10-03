import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Message } from '../../types/entity/Message';
import { formatDate } from "../../utils/validationUtils";
import { MessageStatusBadge } from './MessageStatusBadge';

/**
 * 对话框消息列表组件 - 在对话面板中显示具体的消息交流内容
 * 负责展示与特定联系人的完整聊天记录
 */
interface DialogMessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export const DialogMessageList: React.FC<DialogMessageListProps> = ({ messages, isLoading }) => {
  // 消息动画配置
  const MESSAGE_ANIMATIONS = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2 }
  };

  // 渲染加载状态
  const renderLoadingState = () => (
    <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    </div>
  );

  // 渲染空消息状态
  const renderEmptyMessageState = () => (
    <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-6xl mb-4 text-gray-200">📝</div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">暂无消息</h3>
        <p className="text-gray-500 max-w-md">
          开始发送第一条消息，与对方建立沟通吧
        </p>
      </div>
    </div>
  );

  // 渲染日期分隔符
  const renderDateSeparator = (message: Message) => (
    <div className="flex justify-center mb-6">
      <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
        {formatDate(new Date(message.createdAt))}
      </div>
    </div>
  );

  // 渲染单个消息
  const renderMessage = (message: Message) => {
    const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <motion.div
        className={cn(
          'flex mb-4',
          message.isSentByMe ? 'justify-end' : 'justify-start'
        )}
        {...MESSAGE_ANIMATIONS}
      >
        <div
          className={cn(
            'max-w-[75%] p-3 rounded-2xl shadow-sm',
            message.isSentByMe
                ? 'bg-orange-500 text-white rounded-tr-none'
              : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
          )}
        >
          <p className="break-words whitespace-pre-line">
            {message.content}
          </p>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className={cn('opacity-70', message.isSentByMe ? 'text-white' : 'text-gray-500')}>
              {messageTime}
            </span>
            {message.isSentByMe && message.status && (
              <MessageStatusBadge status={message.status} />
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) return renderLoadingState();
  if (messages.length === 0) return renderEmptyMessageState();

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
      <AnimatePresence>
        {messages.map((message, index) => {
          // 检查是否是同一天的消息
          const isSameDay = index > 0 &&
            formatDate(new Date(message.createdAt)) ===
            formatDate(new Date(messages[index - 1].createdAt));

          return (
            <React.Fragment key={message.messageId}>
              {!isSameDay && renderDateSeparator(message)}
              {renderMessage(message)}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
};