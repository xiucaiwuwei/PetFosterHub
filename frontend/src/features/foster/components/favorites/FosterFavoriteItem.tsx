/*
 * 收藏项组件
 * 用于显示单个收藏的寄养服务项
 */
import React from 'react';

import { Trash2, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { FosterService } from '@/features/foster/types/entity';

interface FosterFavoriteItemProps {
  item: FosterService;
  onRemove: (serviceId: string) => void;
}

// 格式化价格显示
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
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
            <Link to={`/foster/detail/${id}`} className="hover:text-orange-500 transition-colors">
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
          <span className="text-xs text-gray-500">/天</span>
        </div>
      </div>
    </li>
  );
};