/*
 * 收藏夹面板组件
 * 显示用户收藏的寄养服务列表
 */
import React from 'react';
import { X, Heart, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFosterFavorites } from './FosterFavoritesContext';
import { FosterEmptyFavorites } from './FosterEmptyFavorites';
import { FosterFavoriteItem } from './FosterFavoriteItem';

interface FosterFavoritesPanelProps {
  onClose: () => void;
}

export const FosterFavoritesPanel: React.FC<FosterFavoritesPanelProps> = ({ onClose }) => {
  const { items, removeItem, clearFavorites } = useFosterFavorites();

  // 面板动画变体
  const panelVariants = {
    hidden: { x: '100%' },
    visible: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: {
      x: '100%',
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl flex flex-col overflow-hidden"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* 收藏夹头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <Heart className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">我的收藏</h2>
            {items.length > 0 && (
              <span className="ml-2 text-sm text-gray-500">({items.length}项)</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 收藏列表内容 */}
        <div className="flex-grow overflow-y-auto">
          {items.length === 0 ? (
            <FosterEmptyFavorites onContinueBrowsing={onClose} />
          ) : (
            <div className="p-6 space-y-6">
              <ul className="divide-y divide-gray-200 space-y-4">
                {items.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FosterFavoriteItem
                      item={item}
                      onRemove={removeItem}
                    />
                  </motion.li>
                ))}
              </ul>
              
              {/* 清空收藏夹按钮 */}
              <motion.button
                onClick={clearFavorites}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Heart className="w-4 h-4 mr-2" />
                清空收藏
              </motion.button>
            </div>
          )}
        </div>

        {/* 底部操作按钮（仅在有收藏项时显示） */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <motion.button
              onClick={onClose}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="w-5 h-5 mr-2 inline" />
              继续浏览
            </motion.button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};