/**
 * 服务图片轮播组件
 * 展示寄养服务的图片集，支持自动轮播和手动切换
 */
import { useState, useEffect, useRef } from 'react';
import type { FosterService } from '@/types';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useServiceImages from '../../hooks/useServiceImages';

interface ServiceImagesProps {
  service: FosterService;
}

export const ServiceImages = ({ service }: ServiceImagesProps) => {
  // 添加调试日志
  console.log('[ServiceImages] 组件已加载，图片数量:', service.images?.length);
  
  // 使用自定义hook处理数据逻辑
  const {
    validImages,
    selectedImage,
    isTransitioning,
    defaultImage,
    getValidImageUrl,
    handleImageError,
    handleNextImage,
    handlePrevImage,
    handleSelectImage,
    handleMouseEnter,
    handleMouseLeave
  } = useServiceImages(service);

  return (
    <div className="relative bg-gray-900">
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="aspect-w-16 aspect-h-9">
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
            {/* 主图片 */}
            {validImages.length > 0 ? (
              <img
                src={getValidImageUrl(selectedImage)}
                alt={`${service.title} 图片 ${selectedImage + 1}`}
                className={`w-full h-full object-cover opacity-90 transition-opacity duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-90'}`}
                onError={() => handleImageError(selectedImage)}
              />
            ) : (
              // 当没有图片时显示默认占位图
              <div className="w-full h-full flex items-center justify-center bg-gray-800">
                <img
                  src={defaultImage}
                  alt="服务图片占位符"
                  className="w-full h-full object-contain opacity-50"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* 图片缩略图导航 */}
        {validImages.length > 1 && (
          <div className="flex justify-center mt-4 pb-4 space-x-2">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleSelectImage(index)}
                className={cn(
                  "w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200",
                  selectedImage === index
                    ? "border-orange-500 ring-2 ring-orange-500 ring-offset-2 ring-offset-gray-900"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-orange-300"
                )}
                aria-label={`查看图片 ${index + 1}`}
              >
                <img
                  src={getValidImageUrl(index)}
                  alt={`服务图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                />
              </button>
            ))}
          </div>
        )}
      </div>
     
      {/* 轮播控制按钮 */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={handlePrevImage}
            disabled={isTransitioning}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            aria-label="上一张图片"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={handleNextImage}
            disabled={isTransitioning}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            aria-label="下一张图片"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          {/* 图片计数器 */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full">
            {selectedImage + 1} / {service.images.length}
          </div>
        </>
      )}
    </div>
  );
};