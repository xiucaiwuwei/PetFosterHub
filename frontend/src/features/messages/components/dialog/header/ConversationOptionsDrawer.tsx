/**
 * 对话选项抽屉组件
 * 提供聊天中的额外操作选项，优化了视觉效果和用户体验
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationOptionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isBlocked?: boolean;
  onToggleBlock?: (blocked: boolean) => void;
}

/**
 * 对话选项抽屉组件
 * 提供聊天中的额外操作选项，优化了视觉效果和用户体验
 */
export const ConversationOptionsDrawer: React.FC<ConversationOptionsDrawerProps> = ({
  isOpen,
  onClose,
  isBlocked = false,
  onToggleBlock
}) => {
  // 阻止事件冒泡，避免点击抽屉内容时关闭抽屉
  const handleDrawerContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // 处理屏蔽消息开关切换
  const handleBlockToggle = () => {
    if (onToggleBlock) {
      onToggleBlock(!isBlocked);
    }
  };

  // 选项按钮配置
  interface OptionButton {
    id: string;
    iconPath: string;
    label: string;
    iconBgColor: string;
    iconColor: string;
  }

  const optionButtons: OptionButton[] = [
    {
      id: 'search-chat',
      iconPath: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      label: "搜索聊天记录",
      iconBgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'clear-chat',
      iconPath: "M6 18L18 6M6 6l12 12",
      label: "清空聊天记录",
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      id: 'report',
      iconPath: "M12 9v4m0 0l-4-2m4 2l4-2m-6 8h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z",
      label: "举报用户",
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <>
      {isOpen && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-30 z-10 flex justify-end pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute top-0 right-0 h-full w-full max-w-xs bg-white shadow-2xl overflow-hidden z-11 flex flex-col rounded-l-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300
            }}
            onClick={handleDrawerContentClick}
          >
            {/* 顶部区域 */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">更多选项</h3>
            </div>
            
            {/* 选项按钮列表 */}
            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {optionButtons.map((option) => (
                  <motion.button
                    key={option.id}
                    className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 flex items-center space-x-4 group"
                    onClick={() => {
                        if (option.id === 'clear-chat') {
                          if (window.confirm('确定要清空所有聊天记录吗？此操作无法撤销。')) {
                            onClose();
                            // 这里可以添加清空聊天记录的逻辑
                          }
                        } else {
                          onClose();
                          // 这里可以添加其他选项的逻辑
                        }
                      }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* 图标背景 */}
                    <div className={`p-3 ${option.iconBgColor} rounded-lg group-hover:shadow-md transition-all duration-200`}>
                      <svg className={`w-5 h-5 ${option.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d={option.iconPath}
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors duration-200">
                      {option.label}
                    </span>
                    {/* 右箭头 */}
                    <motion.svg
                      className="ml-auto w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ x: -5 }}
                      animate={{ x: 0 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </motion.svg>
                  </motion.button>
                ))}
                
                {/* 屏蔽消息开关 */}
                <div className="p-4 hover:bg-gray-50 rounded-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">屏蔽消息</p>
                        <p className="text-xs text-gray-500 mt-0.5">屏蔽后将不会收到该用户的消息</p>
                      </div>
                    </div>
                    <div
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${isBlocked ? 'bg-blue-600' : 'bg-gray-200'}`}
                      onClick={handleBlockToggle}
                    >
                      <motion.div
                        className="inline-block h-5 w-5 transform rounded-full bg-white shadow"
                        layout
                        style={{ x: isBlocked ? '100%' : '0%', translateX: isBlocked ? '-100%' : '0%' }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};