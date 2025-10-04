/**
 * 对话框输入组件 - 包含消息输入框等
 */
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MessageTextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  disabled: boolean;
  controlledHeight?: string; // 从父组件接收的受控高度
}

/**
 * 消息输入框组件
 * 支持自动调整高度和拖拽调整大小功能
 */
export const MessageTextArea: React.FC<MessageTextAreaProps> = ({
  value,
  onChange,
  onKeyDown,
  disabled,
  controlledHeight
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [maxHeight, setMaxHeight] = useState(120); // 默认值，将在useEffect中更新

  // 计算并设置最大高度为屏幕高度的一半（仅在未受控时使用）
  useEffect(() => {
    if (!controlledHeight) {
      const calculateMaxHeight = () => {
        const halfScreenHeight = window.innerHeight / 2;
        setMaxHeight(halfScreenHeight);
      };
      
      calculateMaxHeight();
      window.addEventListener('resize', calculateMaxHeight);
      
      return () => {
        window.removeEventListener('resize', calculateMaxHeight);
      };
    }
  }, [controlledHeight]);

  // 自动调整高度（仅在未受控时使用）
  useEffect(() => {
    if (!controlledHeight) {
      const handleResize = () => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          const scrollHeight = textareaRef.current.scrollHeight;
          textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
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
    }
  }, [value, maxHeight, controlledHeight]);



  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder=""
        rows={1}
        maxLength={500}
        disabled={disabled}
        className={cn(
          "w-full px-2 py-1 rounded-lg resize-none transition-all duration-300",
          "bg-transparent border-0 outline-none focus:outline-none focus:border-0 focus:ring-0 focus:ring-offset-0 text-gray-800 font-medium placeholder-gray-400 hover:border-0 hover:outline-none", // 全面禁用边框和轮廓
          disabled 
            ? "opacity-70 cursor-not-allowed bg-transparent"
            : ""
        )}
        style={controlledHeight ? { height: controlledHeight, minHeight: '45px' } : { minHeight: '45px', maxHeight: `${maxHeight}px` }}
      />
    </motion.div>
  );
};