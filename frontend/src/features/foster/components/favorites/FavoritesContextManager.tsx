/**
 * 收藏夹上下文管理器
 * 提供收藏夹相关的状态和操作方法
 */
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { FosterService } from '@/features/foster/types/entity/FosterService';
import type { FosterServiceItem } from '@/features/foster/types/dto';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { FosterFavoritesPanel } from './FavoritesDisplayComponents';
import { useFosterFavoritesState, type FosterFavoritesContextType } from '../../hooks/useFosterFavoritesState';

// 创建上下文
const FosterFavoritesContext = createContext<FosterFavoritesContextType | undefined>(undefined);

// 收藏夹提供者组件
export const FosterFavoritesProvider = ({ children }: { children: ReactNode }) => {
  const {
    items,
    itemCount,
    isOpen,
    addItem,
    removeItem,
    clearFavorites,
    toggleFavorites,
    isFavorited
  } = useFosterFavoritesState();
  
  return (
    <FosterFavoritesContext.Provider value={{
      items,
      itemCount,
      favoritesCount: itemCount, // 别名，方便在其他地方使用
      addItem,
      removeItem,
      clearFavorites,
      isOpen,
      toggleFavorites,
      isFavorited
    }}>
      {children}
    </FosterFavoritesContext.Provider>
  );
};

// 自定义钩子，方便组件使用收藏夹功能
export const useFosterFavorites = (): FosterFavoritesContextType => {
  const context = useContext(FosterFavoritesContext);
  if (context === undefined) {
    throw new Error('useFosterFavorites must be used within a FosterFavoritesProvider');
  }
  return context;
};

// 收藏夹管理器组件
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
  service: FosterServiceItem;
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
      className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${className}`}
      aria-label={isFavorite ? "取消收藏" : "收藏"}
    >
      <motion.div
        animate={{ scale: isFavorite ? 1.1 : 1 }}
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart
          className={`${sizeClasses[size]} ${isFavorite ? 'fill-orange-500 text-orange-500' : 'text-gray-400 hover:text-orange-500'}`}
        />
      </motion.div>
    </button>
  );
};

// 导出包裹组件，包含Provider和内部管理器
export const FosterFavoritesManager: React.FC<FosterFavoritesManagerProps> = ({ children }) => {
  return (
    <FosterFavoritesProvider>
      <FosterFavoritesManagerInternal>
        {children}
      </FosterFavoritesManagerInternal>
    </FosterFavoritesProvider>
  );
};