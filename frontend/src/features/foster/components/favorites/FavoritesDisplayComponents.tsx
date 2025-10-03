/**
 * 收藏夹空状态组件
 * 当收藏夹为空时显示的界面，提供继续浏览和清空收藏夹的功能
 */
import React from 'react';
import { X, Heart, Home, Trash2, MapPin, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFosterFavorites } from './FavoritesContextManager';
import type { FosterServiceItem } from '@/features/foster/types/dto';

// 空收藏夹组件
interface FosterEmptyFavoritesProps {
  onContinueBrowsing: () => void;
}

export const FosterEmptyFavorites: React.FC<FosterEmptyFavoritesProps> = ({ onContinueBrowsing }) => {
  // 动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[400px] text-center p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center mb-6"
        variants={itemVariants}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 2
            }
          }}
        >
          <Heart className="w-16 h-16 text-orange-400 opacity-70" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="text-xl font-semibold text-gray-900 mb-2"
        variants={itemVariants}
      >
        收藏夹还是空的
      </motion.h3>
      
      <motion.p 
        className="text-gray-500 mb-8 max-w-xs"
        variants={itemVariants}
      >
        浏览寄养服务，点击心形图标将喜欢的服务添加到收藏夹
      </motion.p>
      
      <motion.button
        onClick={onContinueBrowsing}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-4 h-4 mr-2" />
        继续浏览
      </motion.button>
    </motion.div>
  );
};

// 收藏项组件
interface FosterFavoriteItemProps {
  item: FosterServiceItem;
  onRemove: (serviceId: string) => void;
}

// 格式化价格显示
function formatPrice(price?: number | null): string {
  // 处理undefined或null值，默认显示为0
  const validPrice = typeof price === 'number' && !isNaN(price) ? price : 0;
  return `¥${validPrice.toFixed(2)}`;
}

export const FosterFavoriteItem: React.FC<FosterFavoriteItemProps> = ({ item, onRemove }) => {
  const { id, title, description, price, discountPrice, images, location, rating, reviewCount, tags } = item;

  return (
    <li className="py-4 flex group">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-lg overflow-hidden">
        {images && images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">
              <i className="fa-solid fa-home"></i>
            </span>
          </div>
        )}
      </div>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
              <Link to={`/fosters/${id}`} className="hover:text-orange-500 transition-colors">
                {title}
              </Link>
            </h3>
          <button
            onClick={() => onRemove(id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="取消收藏"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {location}
          </div>
          
          <div className="flex items-center text-sm text-amber-500">
            <Star className="w-3.5 h-3.5 mr-0.5 fill-current" />
            <span>{rating || 0}</span>
            {reviewCount && (
              <span className="text-gray-400 ml-1">({reviewCount})</span>
            )}
          </div>
        </div>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="bg-orange-50 text-orange-700 text-xs px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          {discountPrice ? (
            <>
              <span className="text-red-500 font-bold">{formatPrice(discountPrice)}</span>
              <span className="text-gray-400 text-sm line-through ml-2">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-gray-800 font-bold">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </li>
  );
};

// 收藏夹面板组件
interface FosterFavoritesPanelProps {
  onClose: () => void;
}

export const FosterFavoritesPanel: React.FC<FosterFavoritesPanelProps> = ({ onClose }) => {
  const { items, removeItem, clearFavorites } = useFosterFavorites();
  // items类型已通过useFosterFavorites钩子内部转换为FosterServiceItem[]

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