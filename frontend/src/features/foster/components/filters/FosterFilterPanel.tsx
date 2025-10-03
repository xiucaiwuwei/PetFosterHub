/**
 * 寄养服务筛选面板内容组件
 * 包含宠物类型、服务类型和价格范围的筛选功能
 */
import React from 'react';

interface FilterOption {
  value: string;
  label: string;
}

interface FosterFilterPanelContentProps {
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
}

const FosterFilterPanelContent: React.FC<FosterFilterPanelContentProps> = ({
  petTypes,
  serviceTypes,
  priceRanges,
  selectedPetType,
  selectedServiceType,
  onPetTypeChange,
  onServiceTypeChange,
  onPriceRangeChange,
  onApplyFilters,
  onResetFilters
}) => {
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
    <>
      {/* 筛选内容 */}
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

      {/* 底部操作按钮 */}
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
    </>
  );
};

export default FosterFilterPanelContent;