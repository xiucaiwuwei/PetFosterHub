/**
 * 消息列表选项卡组件
 */
import React from 'react';
import { motion } from 'framer-motion';

interface MessageTabsProps {
  activeTab: 'all' | 'unread' | 'important';
  onTabChange: (tab: 'all' | 'unread' | 'important') => void;
}

export const MessageTabs: React.FC<MessageTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex border-b border-gray-200 bg-white shadow-sm">
      <motion.button
        className={`px-4 py-3 font-medium text-sm flex-1 text-center transition-all duration-300 ${activeTab === 'all' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
        onClick={() => onTabChange('all')}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        全部消息
      </motion.button>
      <motion.button
        className={`px-4 py-3 font-medium text-sm flex-1 text-center transition-all duration-300 ${activeTab === 'unread' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
        onClick={() => onTabChange('unread')}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        未读消息
      </motion.button>
      <motion.button
        className={`px-4 py-3 font-medium text-sm flex-1 text-center transition-all duration-300 ${activeTab === 'important' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
        onClick={() => onTabChange('important')}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        重要消息
      </motion.button>
    </div>
  );
};