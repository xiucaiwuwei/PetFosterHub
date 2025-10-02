/**
 * 寄养服务筛选面板组件
 * 提供宠物类型、服务类型和价格范围的筛选功能，以及收藏管理功能
 */
import React from 'react';
import { X, Heart, Home } from 'lucide-react';
import { useFosterFavorites } from '../favorites/FosterFavoritesContext';
import { FosterFavoriteItem } from '../favorites/FosterFavoriteItem';
import { FosterEmptyFavorites } from '../favorites/FosterEmptyFavorites';

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
  const [localPriceRange, setLocalPriceRange] = React.useState(priceRanges);

  React.useEffect(() => {
    setLocalPriceRange(priceRanges);
  }, [priceRanges]);

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseInt(value, 10);
    const newRange = { ...localPriceRange, [field]: numValue };
    setLocalPriceRange(newRange);
    onPriceRangeChange(newRange);
  };

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
        {/* 筛选内容 */}
        {activeTab === 'filters' && (
          <div className="p-4">
            {/* 宠物类型筛选 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">宠物类型</h3>
              <div className="space-y-2">
                {petTypes.map((petType) => (
                  <div key={petType.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`pet-type-${petType.value}`}
                      name="petType"
                      value={petType.value}
                      checked={selectedPetType === petType.value}
                      onChange={(e) => onPetTypeChange(e.target.value)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                    />
                    <label
                      htmlFor={`pet-type-${petType.value}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {petType.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 服务类型筛选 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">服务类型</h3>
              <div className="space-y-2">
                {serviceTypes.map((serviceType) => (
                  <div key={serviceType.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`service-type-${serviceType.value}`}
                      name="serviceType"
                      value={serviceType.value}
                      checked={selectedServiceType === serviceType.value}
                      onChange={(e) => onServiceTypeChange(e.target.value)}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                    />
                    <label
                      htmlFor={`service-type-${serviceType.value}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {serviceType.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 价格范围筛选 */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">价格范围</h3>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label
                    htmlFor="price-min"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    最低价格
                  </label>
                  <input
                    type="number"
                    id="price-min"
                    value={localPriceRange.min || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    placeholder="¥"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500">-</span>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="price-max"
                    className="block text-xs text-gray-500 mb-1"
                  >
                    最高价格
                  </label>
                  <input
                    type="number"
                    id="price-max"
                    value={localPriceRange.max || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    placeholder="¥"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
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

      {/* 底部操作按钮 */}
      {activeTab === 'filters' ? (
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onResetFilters}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              重置
            </button>
            <button
              type="button"
              onClick={onApplyFilters}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
            >
              应用筛选
            </button>
          </div>
        </div>
      ) : items.length > 0 ? (
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
      ) : null}
    </div>
  );
};

export default FosterFilterPanel;