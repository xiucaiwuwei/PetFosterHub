import React from 'react';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FavoriteItemProps {
  item: {
    id: string;
    name: string;
    mainImage: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category: string;
  };
  onRemove: (productId: string) => void;
}

// 格式化价格显示
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function FavoriteItem({ item, onRemove }: FavoriteItemProps) {
  const discountedPrice = item.discount && item.discount > 0 
    ? item.price * (1 - item.discount / 100) 
    : item.price;

  return (
    <li className="py-4 flex">
      <div className="flex-shrink-0 w-20 h-20 border border-gray-200 rounded-lg overflow-hidden">
        <img
          src={item.mainImage || "https://via.placeholder.com/300x300?text=No+Image"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
            <Link to={`/pet-store/${item.id}`} className="hover:text-red-500 transition-colors">
              {item.name}
            </Link>
          </h3>
          <button
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500"
              aria-label="取消收藏"
            >
              <Trash2 className="w-4 h-4" />
            </button>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">{item.category}</p>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            {item.discount && item.discount > 0 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mr-2">
                {item.discount}折
              </span>
            )}
          </div>
          
          <div className="text-sm font-medium text-gray-900">
            {formatPrice(discountedPrice)}
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-gray-400 line-through ml-2 text-xs">
                ¥{item.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}