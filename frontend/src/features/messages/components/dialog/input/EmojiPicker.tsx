import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
}

interface EmojiCategory {
  name: string;
  emojis: string[];
}

/**
 * 表情选择器组件
 * 提供分类表情选择，优化显示效果和用户体验
 */
export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onClose,
  onEmojiSelect
}) => {
  // 按类别组织表情
  const emojiCategories: EmojiCategory[] = [
    {
      name: '常用',
      emojis: ['😊', '😂', '😍', '🤔', '😢', '👍', '🎉', '❤️', '🔥', '🙏', '🤗', '😎']
    },
    {
      name: '表情',
      emojis: ['😴', '🥳', '😇', '😜', '😡', '😱', '🥰', '😅', '😋', '😝', '🤦', '😓']
    },
    {
      name: '符号',
      emojis: ['✨', '🌟', '💯', '👏', '🙌', '👋', '🤣', '😘', '🤞', '🤝', '🙄', '😬']
    }
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>(emojiCategories[0].name);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');

  // 获取当前选中分类的表情
  const currentEmojis = emojiCategories.find(cat => cat.name === selectedCategory)?.emojis || [];
  
  // 搜索过滤
  const filteredEmojis = searchTerm.trim() 
    ? currentEmojis.filter(emoji => emoji.includes(searchTerm)) 
    : currentEmojis;

  // 处理表情选择
  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    // 短暂延迟以便用户看到选中效果
    setTimeout(() => {
      onEmojiSelect(emoji);
      onClose();
    }, 200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            // 使用fixed定位确保组件在所有元素上方显示
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            className="fixed bottom-[240px] right-[1180px] p-1 bg-white rounded-lg shadow-2xl border border-gray-200 z-5000 overflow-hidden min-w-[320px] pointer-events-auto"
        >
          {/* 表情选择器标题栏 */}
          <div className="px-3 py-2 border-b border-gray-200 bg-white flex items-center justify-between">
            <motion.span 
              className="text-sm font-medium text-gray-700"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              选择表情
            </motion.span>
            <motion.button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="关闭表情选择器"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </div>
          
          {/* 搜索框 */}
          <div className="p-2">
            <input
              type="text"
              placeholder="搜索表情..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pointer-events-auto"
            />
          </div>
          
          {/* 分类标签栏 */}
          <div className="px-2 overflow-x-auto whitespace-nowrap border-b border-gray-100">
            {emojiCategories.map((category, index) => (
              <motion.button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`px-3 py-1.5 mx-0.5 text-sm rounded-full transition-all cursor-pointer ${selectedCategory === category.name ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
          
          {/* 表情网格 */}
          <div className="grid grid-cols-6 gap-1 p-2 max-h-80 overflow-y-auto">
            {filteredEmojis.length > 0 ? (
              filteredEmojis.map((emoji, index) => (
                <motion.button
                  key={`${selectedCategory}-${emoji}-${index}`}
                  type="button"
                  onClick={() => handleEmojiSelect(emoji)}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all ${selectedEmoji === emoji ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-blue-50'}`}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(219, 234, 254, 0.7)' }} cursor-pointer
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01, type: "spring", stiffness: 300 }}
                  aria-label={`选择表情 ${emoji}`}
                >
                  <span className="text-2xl">{emoji}</span>
                </motion.button>
              ))
            ) : (
              <motion.div
                className="col-span-6 py-8 text-center text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                没有找到匹配的表情
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};