/**
 * 寄养服务图片轮播相关的自定义Hook
 * 封装图片验证、错误处理、自动轮播和图片切换逻辑
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import type { FosterService } from '@/types';

interface UseServiceImagesResult {
  validImages: string[];
  selectedImage: number;
  isTransitioning: boolean;
  imageLoadErrors: Set<number>;
  defaultImage: string;
  getValidImageUrl: (index: number) => string;
  handleImageError: (index: number) => void;
  handleNextImage: () => void;
  handlePrevImage: () => void;
  handleSelectImage: (index: number) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

/**
 * 寄养服务图片轮播的自定义Hook
 * 封装图片验证、错误处理、自动轮播和图片切换逻辑
 * @param service 寄养服务数据
 * @returns 图片轮播相关的状态和操作函数
 */
export const useServiceImages = (service: FosterService): UseServiceImagesResult => {
  // 确保service.images存在且是数组
  const validImages = Array.isArray(service.images) && service.images.length > 0 ? service.images : [];
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());
  const intervalRef = useRef<number | null>(null);
  
  // 默认图片占位符 - 使用在线服务避免本地文件依赖
  const defaultImage = 'https://picsum.photos/seed/default/800/600';
  
  // 处理图片加载错误
  const handleImageError = useCallback((index: number) => {
    console.warn(`[ServiceImages] 图片加载失败，索引: ${index}`);
    setImageLoadErrors(prev => new Set(prev).add(index));
  }, []);
  
  // 获取有效的图片URL
  const getValidImageUrl = useCallback((index: number): string => {
    // 如果图片加载失败或不存在，返回默认图片
    if (imageLoadErrors.has(index) || !validImages[index]) {
      return defaultImage;
    }
    return validImages[index];
  }, [imageLoadErrors, validImages]);

  // 开始自动轮播
  const startAutoPlay = useCallback(() => {
    console.log('[ServiceImages] 开始自动轮播');
    intervalRef.current = window.setInterval(() => {
      handleNextImage();
    }, 5000);
  }, []);

  // 停止自动轮播
  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 下一张图片
  const handleNextImage = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedImage((prev) => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
    
    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, validImages.length]);

  // 上一张图片
  const handlePrevImage = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedImage((prev) => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
    
    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, validImages.length]);

  // 手动选择图片
  const handleSelectImage = useCallback((index: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedImage(index);
    
    // 重置过渡状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
    
    // 重新开始自动轮播
    stopAutoPlay();
    startAutoPlay();
  }, [isTransitioning, stopAutoPlay, startAutoPlay]);

  // 鼠标悬停时暂停轮播
  const handleMouseEnter = useCallback(() => {
    stopAutoPlay();
  }, [stopAutoPlay]);

  // 鼠标离开时继续轮播
  const handleMouseLeave = useCallback(() => {
    if (validImages.length > 1) {
      startAutoPlay();
    }
  }, [validImages.length, startAutoPlay]);

  // 自动轮播逻辑
  useEffect(() => {
    if (validImages.length > 1) {
      startAutoPlay();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [validImages.length, startAutoPlay]);

  return {
    validImages,
    selectedImage,
    isTransitioning,
    imageLoadErrors,
    defaultImage,
    getValidImageUrl,
    handleImageError,
    handleNextImage,
    handlePrevImage,
    handleSelectImage,
    handleMouseEnter,
    handleMouseLeave
  };
};

export default useServiceImages;