/**
 * 寄养列表展示组件集合
 * 包含寄养服务卡片和轮播展示组件
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from '@/components/display/Carousel';
import type { FosterServiceItem } from '@/features/foster/types/dto';
import { FosterServiceStatus } from '@/features/foster/types/enums';
import { useFosterFavorites } from '../favorites';

interface FosterCardProps {
  service: FosterServiceItem;
}

interface FosterCarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

/**
 * 寄养列表卡片组件
 * 用于在寄养列表页面展示单个寄养服务的概要信息
 */
export default function FosterCard({ service }: FosterCardProps) {
  const { id, title, description, price, discountPrice, images, location, rating, reviewCount, tags, status, createdAt } = service;
  const { isFavorited, addItem, removeItem } = useFosterFavorites();
  const isServiceFavorite = isFavorited(id);

  // 切换收藏状态
  const handleToggleFavorite = () => {
    if (isServiceFavorite) {
      removeItem(id);
    } else {
      addItem(service);
    }
  };

  // 格式化日期为相对时间
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
    return `${Math.floor(diffDays / 365)}年前`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 group">
      {/* 图片区域 - 添加渐变叠加层和悬停效果 */}
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {images && images.length > 0 ? (
          <img 
            src={images[0]} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-gray-400 text-lg font-medium">
              <i className="fa-solid fa-home mr-2"></i>寄养服务
            </span>
          </div>
        )}
        {/* 渐变叠加层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* 标签和状态 */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {status === FosterServiceStatus.ACTIVE && (
            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <i className="fa-solid fa-circle-check mr-1"></i> 可预约
            </div>
          )}
          {status === FosterServiceStatus.INACTIVE && (
            <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <i className="fa-solid fa-circle-xmark mr-1"></i> 已关闭
            </div>
          )}
          {discountPrice && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
              <i className="fa-solid fa-tag mr-1"></i> 优惠
            </div>
          )}
        </div>
        
        {/* 位置信息 */}
        <div className="absolute bottom-3 left-3 text-white text-sm bg-black/50 backdrop-blur-sm px-2 py-1 rounded flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <i className="fa-solid fa-map-marker-alt mr-1"></i> {location}
        </div>
      </div>
      
      <div className="p-5">
        {/* 评分和评价数量 */}
        <div className="flex items-center mb-3">
          <div className="flex items-center text-amber-500 mr-2">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-amber-500' : 'text-gray-300'} transition-colors duration-300`} 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">{reviewCount} 条评价</span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-xs text-gray-500">{formatRelativeTime(createdAt)}</span>
        </div>
        
        {/* 标题和描述 */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-1 group-hover:text-orange-500 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-orange-100"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{tags.length - 3} 更多
              </span>
            )}
          </div>
        )}
        
        {/* 价格和操作按钮 */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex items-center">
            {discountPrice ? (
              <>
                <span className="text-red-500 font-bold text-xl">¥{discountPrice}</span>
                <span className="text-gray-400 text-sm line-through ml-2">¥{price}</span>
              </>
            ) : (
              <span className="text-gray-800 font-bold text-xl">¥{price}</span>
            )}
            <span className="text-gray-500 text-xs ml-1">/天</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleToggleFavorite}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none ${isServiceFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              aria-label={isServiceFavorite ? "取消收藏" : "添加收藏"}
            >
              <i className={`${isServiceFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}`}></i>
            </button>
            
            <Link 
              to={`/fosters/${id}`} 
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
            >
              查看详情 <i className="fa-solid fa-arrow-right ml-1 text-xs"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 寄养服务轮播图组件
 * 在寄养服务列表页顶部展示宣传横幅
 */
export const FosterCarousel: React.FC<FosterCarouselProps> = ({
  autoPlay = true,
  autoPlayInterval = 5000
}) => {
  // 寄养服务专用轮播图数据
  const fosterSlides = [
    {
      id: 1,
      title: '为您的爱宠找到温暖的临时家园',
      description: '精选优质寄养服务，专业照顾，让您外出无忧，爱宠舒适安心',
      backgroundColor: 'bg-orange-500',
      backgroundGradient: 'from-orange-500 to-orange-600',
      stats: [
        { label: '优质服务', value: '200+' },
        { label: '专业寄养师', value: '50+' },
        { label: '满意评价', value: '98%' },
        { label: '覆盖城市', value: '10+' }
      ]
    },
    {
      id: 2,
      title: '专业寄养师团队',
      description: '所有寄养师均经过严格筛选和培训，确保您的爱宠得到最专业的照顾',
      backgroundColor: 'bg-amber-500',
      backgroundGradient: 'from-amber-500 to-amber-600',
      stats: [
        { label: '专业资质', value: '100%' },
        { label: '平均经验', value: '3年+' },
        { label: '培训认证', value: '100%' },
        { label: '应急处理', value: '24h' }
      ]
    },
    {
      id: 3,
      title: '个性化寄养方案',
      description: '根据宠物的品种、年龄、健康状况和特殊需求，量身定制专属寄养方案',
      backgroundColor: 'bg-yellow-500',
      backgroundGradient: 'from-yellow-500 to-yellow-600',
      stats: [
        { label: '定制方案', value: '1v1' },
        { label: '特殊需求', value: '可满足' },
        { label: '健康监测', value: '每日' },
        { label: '互动时间', value: '充足' }
      ]
    }
  ];

  return (
    <Carousel
      slides={fosterSlides}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
      minHeight="240px"
      maxHeight="360px"
      paddingClass="py-12"
      controlButtonsBottomPosition="bottom-[-30px]"
    />
  );
};