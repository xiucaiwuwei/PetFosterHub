/**
 * 消息列表组件
 */
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types/entity';
import { formatDate } from '../utils/validationUtils';
import { cn } from '@/lib/utils';

/**
 * 消息列表组件的属性接口
 */
export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  otherUserAvatar: string;
  otherUserName: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
}

/**
 * 消息列表组件
 */
export const MessageList = ({ 
  messages, 
  currentUserId, 
  otherUserAvatar, 
  otherUserName, 
  messagesEndRef, 
  isLoading = false 
}: MessageListProps) => {
  if (isLoading) {
    // 加载状态显示
    return (
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-500">加载消息中...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    // 空状态显示
    return (
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <i className="fa-solid fa-comments text-3xl text-orange-500"></i>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">开始与{otherUserName}聊天</h2>
        <p className="text-gray-500 max-w-md">
          发送第一条消息，与对方建立联系
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
      <div className="max-w-md mx-auto">
        {messages.map((message) => (
          <AnimatePresence key={message.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "mb-4 flex",
                message.senderId === currentUserId ? "justify-end" : "justify-start"
              )}
            >
              {message.senderId !== currentUserId && (
                <img
                  src={otherUserAvatar}
                  alt={otherUserName}
                  className="w-8 h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0"
                />
              )}
              <div className={cn(
                "max-w-[75%] px-4 py-2 rounded-lg shadow-sm",
                message.senderId === currentUserId
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 rounded-bl-none border border-gray-200"
              )}>
                <p>{message.content}</p>
                <span className={cn(
                  "text-xs mt-1 block text-right",
                  message.senderId === currentUserId ? "text-orange-100" : "text-gray-400"
                )}>
                  {formatDate(new Date(message.createdAt))}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};