/**
 * 对话框输入组件 - 包含消息输入框、发送按钮等
 */
import React from 'react';
import { motion } from 'framer-motion';

interface ToolbarProps {
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  onImageUpload: () => void;
  onVideoUpload: () => void;
  disabled: boolean;
  hasImageUpload: boolean;
  hasVideoUpload: boolean;
  contentLength: number;
}

/**
 * 消息输入组件的工具栏部分
 * 包含表情、图片、文件、字体等功能按钮
 */
export const Toolbar: React.FC<ToolbarProps> = ({
  showEmojiPicker,
  onToggleEmojiPicker,
  onImageUpload,
  onVideoUpload,
  disabled,
  hasImageUpload,
  hasVideoUpload = true,
  contentLength
}) => {
  // 工具栏按钮共用动画配置
  const toolButtonVariants = {
    hover: {
      scale: 1.05,
      backgroundColor: 'rgba(239, 246, 255, 1)',
      boxShadow: '0 2px 5px rgba(59, 130, 246, 0.1)'
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="px-3 py-2 flex items-center bg-white border-b border-gray-200">
      <motion.button
        type="button"
        disabled={disabled}
        onClick={onToggleEmojiPicker}
        className={`p-2 rounded-md transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-blue-600'}`}
        aria-label="表情"
        variants={toolButtonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm3 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </motion.button>
      
      <motion.button
        type="button"
        disabled={disabled || !hasImageUpload}
        onClick={onImageUpload}
        className={`p-2 rounded-md transition-all duration-200 ${(disabled || !hasImageUpload) ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-green-600 hover:bg-green-50'}`}
        aria-label="图片"
        variants={toolButtonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </motion.button>
      
      <motion.button
        type="button"
        disabled={disabled || !hasVideoUpload}
        onClick={onVideoUpload}
        className={`p-2 rounded-md transition-all duration-200 ${(disabled || !hasVideoUpload) ? 'opacity-50 cursor-not-allowed' : 'text-red-600'}`}
        aria-label="视频"
        variants={toolButtonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      </motion.button>
      
      <motion.button
        type="button"
        disabled={disabled}
        className={`p-2 rounded-md transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'text-indigo-600'}`}
        aria-label="截图"
        variants={toolButtonVariants}
        whileHover="hover"
        whileTap="tap"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          <path d="M8 10h.01M12 10h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.button>
      
      <div className="flex-grow"></div>
    </div>
  );
};