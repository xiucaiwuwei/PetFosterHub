/**
 * 对话框消息列表组件 - 在对话面板中显示具体的消息交流内容
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Message } from '../../../types/entity';
import { MessageType } from '../../../types/enums';
import DateUtils from "@/lib/utils/DateUtils";
import { MessageStatusBadge } from './MessageStatusBadge';
import { ConversationOptionsDrawer } from '../header/ConversationOptionsDrawer';

/**
 * 对话框消息列表组件 - 在对话面板中显示具体的消息交流内容
 * 负责展示与特定联系人的完整聊天记录
 */
interface DialogMessageListProps {
  messages: Message[];
  isLoading: boolean;
  isOptionsDrawerOpen?: boolean;
  onToggleOptionsDrawer?: () => void;
  isBlocked?: boolean;
  onToggleBlock?: (blocked: boolean) => void;
}

export const DialogMessageList: React.FC<DialogMessageListProps> = ({ messages, isLoading, isOptionsDrawerOpen = false, onToggleOptionsDrawer, isBlocked = false, onToggleBlock }) => {
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
  const renderDateSeparator = (message: Message) => {
    const messageDate = new Date(message.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
    
    // 检查是否是今天
    const isToday = messageDate.toDateString() === today.toDateString();
    // 检查是否是昨天
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
    // 检查是否是前天
    const isDayBeforeYesterday = messageDate.toDateString() === dayBeforeYesterday.toDateString();
    
    let dateText = '';
    if (isToday) {
      dateText = '今天';
    } else if (isYesterday) {
      dateText = '昨天';
    } else if (isDayBeforeYesterday) {
      dateText = '前天';
    } else {
      // 格式化其他日期为'月/日 星期几'
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const month = messageDate.getMonth() + 1;
      const day = messageDate.getDate();
      const weekDay = weekDays[messageDate.getDay()];
      dateText = `${month}月${day}日 ${weekDay}`;
    }
    
    return (
      <div className="flex justify-center my-6">
        <div className="bg-gray-100 text-gray-600 text-xs px-4 py-1.5 rounded-full shadow-sm">
          {dateText}
        </div>
      </div>
    );
  };

  // 渲染单个消息
  const renderMessage = (message: Message) => {
    const messageTime = new Date(message.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // 根据消息类型渲染不同内容
    const renderMessageContent = () => {
      switch (message.type) {
        case MessageType.IMAGE:
          return message.fileUrl ? (
            <div className="relative">
              <img 
                src={message.fileUrl} 
                alt={message.content || '图片消息'} 
                className="max-w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: '300px' }}
              />
              {message.content && (
                <p className="mt-2 text-sm break-words whitespace-pre-line">
                  {message.content}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic">图片加载失败</p>
          );
        case MessageType.VIDEO:
          return message.fileUrl ? (
            <div className="relative">
              <video 
                src={message.fileUrl} 
                controls 
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '300px' }}
              >
                您的浏览器不支持视频播放
              </video>
              {message.content && (
                <p className="mt-2 text-sm break-words whitespace-pre-line">
                  {message.content}
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-400 italic">视频加载失败</p>
          );
        default:
          return (
            <p className="break-words whitespace-pre-line">
              {message.content}
            </p>
          );
      }
    };

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
          {renderMessageContent()}
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

  // 处理抽屉状态
  const handleToggleOptionsDrawer = () => {
    if (onToggleOptionsDrawer) {
      onToggleOptionsDrawer();
    }
  };

  if (isLoading) return renderLoadingState();
  if (messages.length === 0) return renderEmptyMessageState();

  return (
    <div className="flex-grow flex-1 h-full max-h-full overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white relative">
      <AnimatePresence>
        {messages.map((message, index) => {
          // 检查是否是同一天的消息
          const isSameDay = index > 0 &&
            new Date(message.createdAt).toDateString() ===
            new Date(messages[index - 1].createdAt).toDateString();

          return (
            <React.Fragment key={message.messageId}>
              {!isSameDay && renderDateSeparator(message)}
              {renderMessage(message)}
            </React.Fragment>
          );
        })}
      </AnimatePresence>
      
      {/* 对话选项抽屉 - 集成在DialogMessageList内部 */}
      {onToggleOptionsDrawer && (
        <ConversationOptionsDrawer
          isOpen={isOptionsDrawerOpen}
          onClose={handleToggleOptionsDrawer}
          isBlocked={isBlocked}
          {...(onToggleBlock && { onToggleBlock })}
        />
      )}
    </div>
  );
};