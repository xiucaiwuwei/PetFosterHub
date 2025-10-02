/*
 * 空收藏夹组件
 * 当用户的收藏夹为空时显示的提示界面
 */
import React from 'react';
import { Heart, Home } from 'lucide-react';
import { motion } from 'framer-motion';

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
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <Heart className="w-16 h-16 text-orange-300" />
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="text-2xl font-bold text-gray-900 mb-3"
        variants={itemVariants}
      >
        收藏夹还是空的
      </motion.h3>
      
      <motion.p 
        className="text-gray-500 mb-8 max-w-md text-base"
        variants={itemVariants}
      >
        在浏览寄养服务时，点击心形图标将喜欢的服务添加到收藏夹，方便以后查看和预约
      </motion.p>
      
      <motion.button
        onClick={onContinueBrowsing}
        className="px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Home className="w-5 h-5 mr-2 inline" />
        去浏览寄养服务
      </motion.button>
    </motion.div>
  );
};