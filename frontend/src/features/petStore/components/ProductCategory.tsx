import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductSortOption } from '@/features/petStore/types';
import { ProductCategory as ProductCategoryEnum } from '@/features/petStore/types/enums/ProductCategory';
import { ProductTag } from '@/features/petStore/types/enums/ProductTag';
import { getTagDisplayName, getTagColor } from '@/features/petStore/types/enums/ProductTag';
import { SlidersHorizontal, CircleDollarSign, Clock, Heart, ShoppingBag, Utensils, Gamepad2, Shirt, Home, ChevronDown, ChevronRight, Filter, Star, Check } from 'lucide-react';

interface ProductCategoryProps {
  selectedCategory: ProductCategoryEnum | 'all';
  onCategoryChange: (category: ProductCategoryEnum | 'all') => void;
  selectedTags?: ProductTag[];
  onTagsChange?: (tags: ProductTag[]) => void;
  selectedPriceRange?: { min: number | null; max: number | null };
  onPriceRangeChange?: (range: { min: number | null; max: number | null }) => void;
  selectedRatings?: number[];
  onRatingsChange?: (ratings: number[]) => void;
  sortOption: ProductSortOption;
  onSortChange: (sortOption: ProductSortOption) => void;
}

const ProductCategory: React.FC<ProductCategoryProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  selectedTags = [],
  onTagsChange,
  selectedPriceRange = { min: null, max: null },
  onPriceRangeChange,
  selectedRatings = [],
  onRatingsChange,
  sortOption,
  onSortChange
}) => {
  // 状态管理
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTags, setShowTags] = useState(false);
  const [showPriceRange, setShowPriceRange] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [localPriceRange, setLocalPriceRange] = useState({
    min: selectedPriceRange.min,
    max: selectedPriceRange.max
  });
  const [localRatings, setLocalRatings] = useState<number[]>([...selectedRatings]);
  const [isMobile, setIsMobile] = useState(false);
  
  // 检测屏幕宽度，用于响应式设计
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // 初始化
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 同步外部传入的状态变化
  useEffect(() => {
    setLocalPriceRange(selectedPriceRange);
  }, [selectedPriceRange]);

  useEffect(() => {
    setLocalRatings([...selectedRatings]);
  }, [selectedRatings]);

  // 处理分类选择
  const handleChange = (value: ProductCategoryEnum | 'all') => {
    onCategoryChange(value);
  };

  // 处理标签选择
  const handleTagToggle = (tag: ProductTag) => {
    if (!onTagsChange) return;
    
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  // 处理价格范围筛选
  const handlePriceToggle = () => {
    setShowPriceRange(!showPriceRange);
  };

  const handlePriceInputChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : Number(value);
    setLocalPriceRange(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const applyPriceFilter = () => {
    if (onPriceRangeChange) {
      onPriceRangeChange(localPriceRange);
    }
  };

  const resetPriceFilter = () => {
    const resetRange = { min: null, max: null };
    setLocalPriceRange(resetRange);
    if (onPriceRangeChange) {
      onPriceRangeChange(resetRange);
    }
  };

  // 处理评分筛选
  const handleRatingsToggle = () => {
    setShowRatings(!showRatings);
  };

  const handleRatingChange = (rating: number) => {
    const updatedRatings = [...localRatings];
    const index = updatedRatings.indexOf(rating);
    
    if (index === -1) {
      updatedRatings.push(rating);
    } else {
      updatedRatings.splice(index, 1);
    }
    
    setLocalRatings(updatedRatings);
    if (onRatingsChange) {
      onRatingsChange(updatedRatings);
    }
  };

  // 商品分类数据
  const categories = [
    { value: 'all' as const, label: '全部商品', count: 28, icon: ShoppingBag },
    { value: ProductCategoryEnum.DRY_FOOD, label: '干粮', count: 8, icon: Utensils },
    { value: ProductCategoryEnum.WET_FOOD, label: '湿粮', count: 6, icon: Utensils },
    { value: ProductCategoryEnum.TREATS, label: '零食', count: 4, icon: Utensils },
    { value: ProductCategoryEnum.TOYS, label: '玩具', count: 8, icon: Gamepad2 },
    { value: ProductCategoryEnum.CARE, label: '护理用品', count: 6, icon: Home },
    { value: ProductCategoryEnum.ACCESSORIES, label: '配件', count: 4, icon: Shirt },
  ];

  // 排序选项数据
  const sortOptions = [
    { label: '价格从低到高', value: ProductSortOption.PRICE_LOW_TO_HIGH },
    { label: '价格从高到低', value: ProductSortOption.PRICE_HIGH_TO_LOW },
    { label: '最新上架', value: ProductSortOption.NEWEST },
    { label: '销量优先', value: ProductSortOption.BEST_SELLING }
  ];

  // 标签筛选选项数据
  const tags = [
    { value: ProductTag.NEW_ARRIVAL, label: '新品', color: 'blue' },
    { value: ProductTag.BEST_SELLER, label: '畅销', color: 'red' },
    { value: ProductTag.DISCOUNT, label: '促销', color: 'orange' },
    { value: ProductTag.ECO_FRIENDLY, label: '环保', color: 'green' },
    { value: ProductTag.PREMIUM, label: '高端', color: 'purple' },
  ];

  // 检查是否有活跃的筛选条件
  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedTags.length > 0 || 
    (selectedPriceRange.min !== null || selectedPriceRange.max !== null) || 
    selectedRatings.length > 0;

  return (
    <div className="product-category w-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300">
        {/* 筛选器标题和活动状态指示 */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-semibold text-gray-800">筛选条件</h2>
            </div>
            {hasActiveFilters && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full"
              >
                有筛选条件
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* 主分类筛选 */}
          <div className="mb-6">
            <div 
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
                商品分类
              </h3>
              {isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                : 
                <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
              }
            </div>
          
            {/* 分类内容 */}
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-3 space-y-1.5"
              >
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <motion.button
                      key={category.value}
                      value={category.value}
                      onClick={() => handleChange(category.value)}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center ${selectedCategory === category.value 
                        ? 'bg-orange-50 text-orange-600 border-l-2 border-orange-400 shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700'}`}
                      whileHover={{ x: 3 }} // 悬停时轻微右移
                      whileTap={{ scale: 0.98 }} // 点击时轻微缩小
                    >
                      <Icon className="w-5 h-5 mr-3 text-orange-500 flex-shrink-0" />
                      <span className="flex-1 font-medium">{category.label}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{category.count}</span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>
          
          {/* 标签筛选 */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={() => setShowTags(!showTags)}
            >
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-gray-500" />
                特色标签
                {selectedTags.length > 0 && (
                  <span className="ml-2 text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </h3>
              {showTags ? 
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                : 
                <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
              }
            </div>
          
            {/* 标签内容 */}
            {showTags && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-3"
              >
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <motion.button
                      key={tag.value}
                      onClick={() => handleTagToggle(tag.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center shadow-sm ${selectedTags.includes(tag.value) 
                        ? `bg-${tag.color}-100 text-${tag.color}-600 border-2 border-${tag.color}-300 transform scale-105` 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!onTagsChange}
                    >
                      {tag.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

            {/* 排序方式 - 与商品分类样式保持一致 */}
            <div className="mb-6">
              <div 
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={() => setShowSortMenu(!showSortMenu)}
              >
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-orange-500" />
                  排序方式
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {sortOptions.find(option => option.value === sortOption)?.label}
                  </span>
                </h3>
                {showSortMenu ? 
                  <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                  : 
                  <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                }
              </div>
            
              {/* 排序选项内容 - 与商品分类样式保持一致 */}
              {showSortMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-3 space-y-1.5"
                >
                  {sortOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      onClick={() => onSortChange(option.value)}
                      className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 flex items-center ${sortOption === option.value 
                        ? 'bg-orange-50 text-orange-600 border-l-2 border-orange-400 shadow-sm' 
                        : 'hover:bg-gray-50 text-gray-700'}`}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {sortOption === option.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex-shrink-0"
                        >
                          <Check className="w-4 h-4 text-orange-500 mr-3" />
                        </motion.div>
                      )}
                      <span className="flex-1 font-medium">{option.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          
          {/* 价格范围筛选 */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer py-2"
              onClick={handlePriceToggle}
            >
              <h3 className="text-sm font-medium text-gray-900 flex items-center">
                <CircleDollarSign className="w-4 h-4 mr-2 text-gray-500" />
                价格范围
                {selectedPriceRange.min !== null || selectedPriceRange.max !== null ? (
                  <span className="ml-2 text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                    {selectedPriceRange.min ?? '¥'} - {selectedPriceRange.max ?? '¥'}
                  </span>
                ) : null}
              </h3>
              {showPriceRange ? 
                <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                : 
                <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
              }
            </div>
          
            {/* 价格范围内容 */}
            {showPriceRange && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="mt-3 p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                    <input
                      type="number"
                      placeholder="最低价"
                      min="0"
                      value={localPriceRange.min || ''}
                      onChange={(e) => handlePriceInputChange('min', e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <span className="text-gray-400 font-medium">至</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                    <input
                      type="number"
                      placeholder="最高价"
                      min="0"
                      value={localPriceRange.max || ''}
                      onChange={(e) => handlePriceInputChange('max', e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    onClick={applyPriceFilter}
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all duration-300"
                    whileHover={{ y: -1 }} // 悬停时轻微上移
                    whileTap={{ scale: 0.98 }} // 点击时轻微缩小
                  >
                    应用筛选
                  </motion.button>
                  <motion.button
                    onClick={resetPriceFilter}
                    className="flex-1 py-2.5 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all duration-300"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    重置
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
          
            {/* 评分筛选 */}
            <div className="mb-6">
              <div
                className="flex justify-between items-center cursor-pointer py-2"
                onClick={handleRatingsToggle}
              >
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  商品评分
                  {selectedRatings.length > 0 && (
                    <span className="ml-2 text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                      {selectedRatings.length}
                    </span>
                  )}
                </h3>
                {showRatings ? 
                  <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                  : 
                  <ChevronRight className="w-4 h-4 text-gray-500 transition-transform duration-200" />
                }
              </div>
            
              {/* 评分筛选内容 */}
              {showRatings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mt-3 space-y-2"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <motion.button
                      key={rating}
                      type="button"
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-300 flex items-center justify-between ${localRatings.includes(rating)
                        ? 'bg-orange-50 text-orange-600 border-l-2 border-orange-400 shadow-sm'
                        : 'hover:bg-gray-50'}
                      `}
                      onClick={() => handleRatingChange(rating)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-medium">{rating}星及以上</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProductCategory;