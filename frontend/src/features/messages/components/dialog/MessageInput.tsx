/**
 * 消息输入组件
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('input', handleResize);
      handleResize();
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('input', handleResize);
      }
    };
  }, [content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (trimmedContent) {
      onSendMessage(trimmedContent);
      setContent('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="p-4 border-t border-gray-200 bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={cn(
              'flex items-center space-x-2 p-2 rounded-lg',
              isFocused
                ? 'border-2 border-purple-500 focus:ring-0'
                : 'border border-gray-300 focus-within:border-2 focus-within:border-purple-500'
            )}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="输入消息..."
              className="flex-1 resize-none border-none focus:ring-0 text-gray-800 placeholder-gray-400 overflow-hidden"
              rows={1}
            />
            <motion.button
              type="submit"
              className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!content.trim()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </motion.button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-right">
            {content.length} / 500
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
};