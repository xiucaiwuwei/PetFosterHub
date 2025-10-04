/**
 * 对话框输入组件 - 包含消息输入框、发送按钮等
 */
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SendButtonProps {
  isDisabled: boolean;
  onClick: () => void;
  hasContent: boolean;
}

/**
 * 发送按钮组件
 * 美化版 - 包含现代UI设计和流畅动画效果
 */
export const SendButton: React.FC<SendButtonProps> = ({
  isDisabled,
  onClick,
  hasContent
}) => {
  const isSendable = hasContent && !isDisabled;

  // 按钮变体配置
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: isSendable ? '0 5px 15px rgba(66, 153, 225, 0.4)' : 'none',
      backgroundColor: isSendable ? '#4299e1' : '#e2e8f0'
    },
    tap: { scale: 0.98 }
  };

  // 脉冲动画配置 - 修复TypeScript类型错误
  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };

  return (
    <motion.button
      type="button"
      disabled={isDisabled || !hasContent}
      onClick={onClick}
      className={cn(
        "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 whitespace-nowrap relative",
        isSendable 
          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-blue-700"
          : "bg-gray-100 text-gray-400 cursor-not-allowed"
      )}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      layout
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label="发送消息"
    >
      <span className="relative z-10">发送</span>
      
      {isSendable && (
        <motion.div
          className="relative z-10"
          animate={pulseAnimation}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4.5 w-4.5"
            viewBox="0 0 24 24" 
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 2 11 13" />
            <path d="m22 2-7 20-4-9-9-4 20-7Z" />
          </svg>
          
          {/* 微粒子效果 */}
          <motion.div
            className="absolute -right-4 -top-4 w-2 h-2 bg-white rounded-full opacity-70"
            animate={{ 
              x: [0, -5, -10], 
              y: [0, -5, 5],
              opacity: [0.7, 0.3, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeOut"
            }}
          />
        </motion.div>
      )}
      
      {/* 背景光效 */}
      {isSendable && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-300 opacity-30 blur-sm -z-10"
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.button>
  );
};