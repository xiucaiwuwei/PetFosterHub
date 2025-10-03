/**
 * 寄养服务详情页专用导航栏
 * 替代通用的Navbar组件，提供更聚焦的导航功能
 */
import React from 'react';
import { Heart, Share2, ArrowLeft, AlertCircle, Check, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import useFosterDetailHeader from '../../hooks/useFosterDetailHeader';

interface FosterDetailHeaderProps {
  serviceName?: string;
  serviceId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBack?: () => void;
  onReport?: (serviceId: string) => Promise<void>;
  onShare?: (serviceId: string) => Promise<void>;
}

/**
 * 寄养服务详情页专用导航栏
 * 替代通用的Navbar组件，提供更聚焦的导航功能
 */
export const FosterDetailHeader: React.FC<FosterDetailHeaderProps> = ({
  serviceName = '寄养服务详情',
  serviceId = '',
  isFavorite = false,
  onToggleFavorite,
  onBack,
  onReport,
  onShare
}) => {
  // 使用自定义hook处理数据逻辑
  const {
    isShareMenuOpen,
    isCopied,
    localIsFavorite,
    shareMenuRef,
    handleBack,
    handleShare,
    handleCopyLink,
    handleNativeShare,
    handleReport,
    handleToggleFavorite
  } = useFosterDetailHeader({
    serviceId,
    isFavorite,
    onToggleFavorite,
    onBack,
    onReport,
    onShare
  });

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-md">
      <div className="w-full">
        <div className="flex items-center justify-between h-16">
          {/* 左侧导航 - 只保留返回按钮，增加文字 */}
          <motion.button
            onClick={handleBack}
            className="flex items-center space-x-1 p-2 hover:bg-gray-100 text-gray-700 ml-4"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </motion.button>

          {/* 中间标题 */}
          <div className="hidden md:flex items-center justify-center flex-1">
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
              {serviceName}
            </h1>
          </div>

          {/* 右侧操作按钮 - 移除搜索图标，保留分享和收藏，并添加举报按钮 */}
          <div className="flex items-center space-x-2 mr-4">
            <div className="relative">
              <motion.button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Share2 size={20} />
              </motion.button>

              {/* 分享菜单 */}
                {isShareMenuOpen && (
                  <motion.div
                    ref={shareMenuRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-40"
                  >
                  {typeof navigator.share === 'function' && (
                    <button
                      onClick={handleNativeShare}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <ExternalLink size={16} className="text-gray-600" />
                      <span className="text-gray-800">分享到其他应用</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100"
                  >
                    {isCopied ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className="text-gray-600" />
                    )}
                    <span className="text-gray-800">{isCopied ? '已复制链接' : '复制链接'}</span>
                  </button>
                </motion.div>
              )}
            </div>

            <motion.button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full ${localIsFavorite ? 'text-red-500' : 'text-gray-700'}`}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Heart size={20} fill={localIsFavorite ? "currentColor" : "none"} />
            </motion.button>

            <motion.button
              onClick={handleReport}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-700"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <AlertCircle size={20} />
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* 移动端标题栏 */}
      <div className="md:hidden py-2 border-t border-gray-100 bg-gray-50">
        <h1 className="text-base font-medium text-gray-900 truncate ml-4">
          {serviceName}
        </h1>
      </div>
    </header>
  );
};

// 导出默认组件
export default FosterDetailHeader;