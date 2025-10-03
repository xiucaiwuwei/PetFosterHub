/**
 * 消息列表面板头部组件
 */
import React from 'react';
import { motion } from 'framer-motion';

interface MessageListHeaderProps {
  unreadCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onRefresh: () => void;
}

export const MessageListHeader: React.FC<MessageListHeaderProps> = ({
  unreadCount,
  searchQuery,
  onSearchChange,
  onRefresh,
}) => {
  return (
    <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <motion.h2 
          className="text-xl font-bold text-gray-800 flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          消息
        </motion.h2>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <motion.button
              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
              whileHover={{ scale: 1.05, backgroundColor: '#FFF7ED' }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="flex items-center">
                <span className="w-5 h-5 flex items-center justify-center bg-orange-500 text-white rounded-full text-xs mr-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
                条未读
              </span>
            </motion.button>
          )}
          <motion.button
            className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-gray-100 transition-colors shadow-sm hover:shadow"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRefresh}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </motion.button>
        </div>
      </div>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <motion.svg 
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={searchQuery ? { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </motion.svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all shadow-sm hover:shadow"
          placeholder="搜索对话或消息..."
        />
        {searchQuery && (
          <motion.button
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
            onClick={() => onSearchChange('')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};