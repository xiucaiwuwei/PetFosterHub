/*
 * 收藏夹管理器组件
 * 包裹整个寄养服务页面，提供收藏功能的上下文和面板管理
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFosterFavorites } from './FosterFavoritesContext';
import { FosterFavoritesProvider } from './FosterFavoritesContext';
import { FosterFavoritesPanel } from './FosterFavoritesPanel';
import type { FosterService } from '@/features/foster/types/entity';

interface FosterFavoritesManagerProps {
  children: React.ReactNode;
}

// 内部组件，用于管理收藏面板的显示状态
const FosterFavoritesManagerInternal: React.FC<FosterFavoritesManagerProps> = ({ children }) => {
  const { isOpen, toggleFavorites } = useFosterFavorites();
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  // 监听收藏夹打开状态变化
  useEffect(() => {
    setIsPanelVisible(isOpen);
  }, [isOpen]);

  // 关闭收藏面板
  const handleClose = () => {
    toggleFavorites();
  };

  // 点击遮罩层关闭面板
  const handleOverlayClick = () => {
    handleClose();
  };

  // 遮罩层动画变体
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      {children}
      
      <AnimatePresence>
        {isPanelVisible && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={overlayVariants}
              onClick={handleOverlayClick}
              aria-hidden="true"
            />
            <FosterFavoritesPanel onClose={handleClose} />
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// 收藏按钮组件
interface FavoriteButtonProps {
  service: FosterService;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  service, 
  size = 'medium', 
  className = '' 
}) => {
  const { isFavorited, addItem, removeItem } = useFosterFavorites();
  const isFavorite = isFavorited(service.id);

  // 根据尺寸设置不同的样式
  const sizeClasses = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeItem(service.id);
    } else {
      addItem(service);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${className}`}
      aria-label={isFavorite ? '取消收藏' : '添加到收藏'}
      title={isFavorite ? '取消收藏' : '添加到收藏'}
    >
      <motion.div
        animate={{
          scale: isFavorite ? [1, 1.2, 1] : 1
        }}
        transition={{
          duration: 0.3
        }}
      >
        <Heart
          className={`${sizeClasses[size]} ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-500'}`}
        />
      </motion.div>
    </button>
  );
};

// 主导出组件，使用Provider包装内部组件
export const FosterFavoritesManager: React.FC<FosterFavoritesManagerProps> = ({ children }) => {
  return (
    <FosterFavoritesProvider>
      <FosterFavoritesManagerInternal>
        {children}
      </FosterFavoritesManagerInternal>
    </FosterFavoritesProvider>
  );
};