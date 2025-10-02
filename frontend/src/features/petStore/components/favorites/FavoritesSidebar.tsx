import React from 'react';
import { X, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/lib/contexts/favoritesContext';

import { EmptyFavorites } from './EmptyFavorites';
import { FavoriteItem } from './FavoriteItem';

interface FavoritesSidebarProps {
  onClose: () => void;
}

// 格式化价格显示
function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

export function FavoritesSidebar({ onClose }: FavoritesSidebarProps) {
  const { items, removeItem, clearFavorites } = useFavorites();

  return (
    <div className="w-full">
      {/* 收藏夹头部 */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">我的收藏</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 收藏商品列表 */}
      <div className="flex-grow overflow-y-auto p-6">
        {items.length === 0 ? (
          <EmptyFavorites onContinueShopping={onClose} />
        ) : (
          <div className="space-y-6">
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <FavoriteItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                />
              ))}
            </ul>
            
            {/* 清空收藏夹按钮 */}
            <button
              onClick={clearFavorites}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Heart className="w-4 h-4 mr-2" />
              清空收藏
            </button>
          </div>
        )}
      </div>
    </div>
  );
}