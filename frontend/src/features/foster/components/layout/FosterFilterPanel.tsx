/**
 * 寄养服务筛选面板组件
 * 提供宠物类型、服务类型和价格范围的筛选功能，以及收藏管理功能
 */
import React from 'react';
import { X, Heart, Home } from 'lucide-react';
import { useFosterFavorites } from '../favorites';
import { FosterFavoriteItem, FosterEmptyFavorites } from '../favorites/FavoritesDisplayComponents';
import { FosterFilterPanelContent } from '../filters';

interface FilterOption {
  value: string;
  label: string;
}

interface FosterFilterPanelProps {
  onClose: () => void;
  petTypes: FilterOption[];
  serviceTypes: FilterOption[];
  priceRanges: { min: number | null; max: number | null };
  selectedPetType: string;
  selectedServiceType: string;
  onPetTypeChange: (value: string) => void;
  onServiceTypeChange: (value: string) => void;
  onPriceRangeChange: (range: { min: number | null; max: number | null }) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  activeTab?: 'filters' | 'favorites';
  onTabChange?: (tab: 'filters' | 'favorites') => void;
}

const FosterFilterPanel: React.FC<FosterFilterPanelProps> = ({
  onClose,
  petTypes,
  serviceTypes,
  priceRanges,
  selectedPetType,
  selectedServiceType,
  onPetTypeChange,
  onServiceTypeChange,
  onPriceRangeChange,
  onApplyFilters,
  onResetFilters,
  activeTab = 'filters',
  onTabChange
}) => {
  // 获取收藏夹功能
  const { items, removeItem, clearFavorites } = useFosterFavorites();

  return (
    <div className="h-full flex flex-col">
      {/* 面板头部 */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* 标签切换 */}
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              className={`px-3 py-1 text-sm font-medium ${activeTab === 'filters' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}
              transition-colors duration-200`}
              onClick={() => onTabChange?.('filters')}
            >
              筛选
            </button>
            <button
              className={`px-3 py-1 text-sm font-medium ${activeTab === 'favorites' 
                ? 'bg-orange-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'}
              transition-colors duration-200`}
              onClick={() => onTabChange?.('favorites')}
            >
              我的收藏
            </button>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 面板内容 */}
      <div className="flex-1 overflow-y-auto">
        {/* 筛选内容 - 引用外部组件 */}
        {activeTab === 'filters' && (
          <FosterFilterPanelContent
            petTypes={petTypes}
            serviceTypes={serviceTypes}
            priceRanges={priceRanges}
            selectedPetType={selectedPetType}
            selectedServiceType={selectedServiceType}
            onPetTypeChange={onPetTypeChange}
            onServiceTypeChange={onServiceTypeChange}
            onPriceRangeChange={onPriceRangeChange}
            onApplyFilters={onApplyFilters}
            onResetFilters={onResetFilters}
          />
        )}

        {/* 收藏夹内容 */}
        {activeTab === 'favorites' && (
          <div className="flex-grow overflow-y-auto">
            {items.length === 0 ? (
              <FosterEmptyFavorites onContinueBrowsing={onClose} />
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-orange-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">我的收藏 ({items.length}项)</h3>
                  </div>
                  <button
                    onClick={clearFavorites}
                    className="text-xs text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    清空
                  </button>
                </div>
                <ul className="divide-y divide-gray-200 space-y-3">
                  {items.map((item) => (
                    <FosterFavoriteItem
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部操作按钮 - 收藏夹的继续浏览按钮 */}
      {activeTab === 'favorites' && items.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2 inline" />
            继续浏览
          </button>
        </div>
      )}
    </div>
  );
};

export default FosterFilterPanel;