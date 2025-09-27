import React, { useState } from 'react';
import { useProductList } from '../hooks/useProductList';
import PetStoreSecondaryNav from '../components/PetStoreSecondaryNav';
import PetStoreHeader from '../components/PetStoreHeader';
import ProductCategory from '../components/ProductCategory';
import ProductListSection from '../components/ProductListSection';
import { ProductSortOption } from '@/features/petStore/types';
import { ProductCategory as ProductCategoryEnum } from '@/features/petStore/types/enums/ProductCategory';
import { ProductTag } from '@/features/petStore/types/enums/ProductTag';

const PetStore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryEnum | 'all'>('all');
  const [sortOption, setSortOption] = useState<ProductSortOption>(ProductSortOption.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const [selectedNavItem, setSelectedNavItem] = useState('all'); // 二级导航选中项
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]); // 标签筛选状态
  const [selectedPriceRange, setSelectedPriceRange] = useState({ min: null, max: null }); // 价格范围筛选
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]); // 评分筛选
  const [sidebarWidth, setSidebarWidth] = useState(384); // 初始宽度96*4=384px
  const [isResizing, setIsResizing] = useState(false);
  const maxWidth = '50%'; // 最大宽度为界面的一半
  const { products, loading, error, total } = useProductList({
    page,
    pageSize: 12,
    searchTerm,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sortBy: sortOption
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1); // 重置到第一页
  };

  const handleCategoryChange = (value: ProductCategoryEnum | 'all') => {
    setSelectedCategory(value);
    setPage(1); // 重置到第一页
  };

  const handleSortChange = (value: ProductSortOption) => {
    setSortOption(value);
  };

  // 处理标签变化
  const handleTagsChange = (tags: ProductTag[]) => {
    setSelectedTags(tags);
    setPage(1); // 重置到第一页
  };

  // 处理价格范围变化
  const handlePriceRangeChange = (range: { min: number | null; max: number | null }) => {
    setSelectedPriceRange(range);
    setPage(1); // 重置到第一页
  };

  // 处理评分变化
  const handleRatingsChange = (ratings: number[]) => {
    setSelectedRatings(ratings);
    setPage(1); // 重置到第一页
  };

  // 处理二级导航项切换
  const handleNavItemChange = (id: string) => {
    setSelectedNavItem(id);
    setPage(1); // 切换导航项时重置到第一页
    
    // 根据导航项ID设置相应的筛选条件
    switch (id) {
      case 'popular':
        setSortOption(ProductSortOption.BEST_SELLING);
        setSearchTerm('');
        setSelectedCategory('all');
        break;
      case 'new':
        setSortOption(ProductSortOption.NEWEST);
        setSearchTerm('');
        setSelectedCategory('all');
        break;
      case 'dry-food':
        setSelectedCategory(ProductCategoryEnum.DRY_FOOD);
        setSearchTerm('');
        break;
      case 'toys':
        setSelectedCategory(ProductCategoryEnum.TOYS);
        setSearchTerm('');
        break;
      case 'care':
        setSelectedCategory(ProductCategoryEnum.CARE);
        setSearchTerm('');
        break;
      case 'accessories':
        setSelectedCategory(ProductCategoryEnum.ACCESSORIES);
        setSearchTerm('');
        break;
      case 'discount':
        // 这里可以添加折扣商品的筛选逻辑
        setSearchTerm('');
        setSelectedCategory('all');
        break;
      default:
        setSearchTerm('');
        setSelectedCategory('all');
        break;
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
    setPage(1);
  };

  // 处理侧边栏拖拽调整宽度
  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResize = (e: MouseEvent) => {
    if (isResizing) {
      // 获取屏幕宽度的一半作为最大限制
      const screenWidth = window.innerWidth;
      const maxSidebarWidth = screenWidth * 0.5;
      
      // 计算新的宽度（从左侧边缘到鼠标位置的距离）
      const newWidth = e.clientX;
      
      // 限制最小宽度为256px（w-64），最大宽度为屏幕的一半
      if (newWidth >= 256 && newWidth <= maxSidebarWidth) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  return (
    <div className="pet-store-container min-h-screen">
      {/* 二级头部导航 - 顶部区域 */}
      <PetStoreSecondaryNav 
        selectedNavItem={selectedNavItem} 
        onNavItemChange={handleNavItemChange} 
        onSearch={handleSearch}
      />
      
      {/* 主要内容区域 */}
      <div className="w-full">
        {/* 左侧分类筛选区域 - 固定定位 */}
        <div 
          className="fixed left-0 top-[64px] bottom-0 border-r border-gray-200 bg-white overflow-y-auto z-10"
          style={{ 
            width: `${sidebarWidth}px`,
            maxWidth: maxWidth,
            minWidth: '256px'
          }}
        >
          <div className="p-4">
            <ProductCategory
              selectedCategory={selectedCategory}
              sortOption={sortOption}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
              selectedRatings={selectedRatings}
              onRatingsChange={handleRatingsChange}
            />
          </div>
          {/* 拖拽条 */}
          <div 
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize bg-gray-200 hover:bg-gray-300 transition-colors"
            onMouseDown={handleResizeStart}
            style={{ zIndex: 10 }}
          />
        </div>
        
        {/* 右侧主体内容区域 - 为固定的左侧菜单留出空间 */}
        <div 
          className="ml-[256px] transition-all duration-300 bg-gray-50 min-h-[calc(100vh-64px)] overflow-y-auto"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          {/* 渐变背景标题区域 */}
          <PetStoreHeader />
          
          {/* 商品列表区域 */}
          <div className="px-6 py-4">
            <ProductListSection
              products={products}
              total={total}
              page={page}
              loading={loading}
              error={error}
              onPageChange={handlePageChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetStore;