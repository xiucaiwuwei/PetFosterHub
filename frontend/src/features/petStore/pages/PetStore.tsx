import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProductList } from '../hooks/useProductList';
import PetStoreSecondaryNav from '../components/layout/PetStoreSecondaryNav';
import PetStoreCarousel from '../components/layout/PetStoreCarousel';
import ProductCategory from '../components/products/ProductCategory';
import ProductListSection from '../components/products/ProductListSection';
import { ProductSortOption } from '@/features/petStore/types';
import { ProductCategory as ProductCategoryEnum } from '@/features/petStore/types/enums/ProductCategory';
import { ProductTag } from '@/features/petStore/types/enums/ProductTag';
import { Filter, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { CartSidebar } from '../components/cart/CartSidebar';
import { FavoritesSidebar } from '../components/favorites/FavoritesSidebar';
import { useCart } from '@/lib/contexts/cartContext';
import { useFavorites } from '@/lib/contexts/favoritesContext';

const PetStore: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryEnum | 'all'>('all');
  const [sortOption, setSortOption] = useState<ProductSortOption>(ProductSortOption.PRICE_LOW_TO_HIGH);
  const [page, setPage] = useState(1);
  const [selectedNavItem, setSelectedNavItem] = useState('all'); // 二级导航选中项
  const [selectedTags, setSelectedTags] = useState<ProductTag[]>([]); // 标签筛选状态
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null }); // 价格范围筛选
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]); // 评分筛选
  const [sidebarWidth, setSidebarWidth] = useState(0); // 初始宽度为0，确保完全隐藏
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const maxWidth = '50%'; // 最大宽度为界面的一半
  const collapsedWidth = 0; // 设置为0，实现完全隐藏的抽屉效果
  const [expandedWidth, setExpandedWidth] = useState(384);
  
  // 使用购物车上下文
  const { isOpen: isCartOpen, toggleCart: toggleCartDrawer, itemCount } = useCart();
  // 使用收藏夹上下文
  const { isOpen: isFavoritesOpen, toggleFavorites, itemCount: favoritesCount } = useFavorites();
  const { products, loading, error, total } = useProductList({
    page,
    pageSize: 25,
    searchTerm,
    ...(selectedCategory !== 'all' && { category: selectedCategory }),
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

  // 切换侧边栏展开/收起
  const toggleSidebar = () => {
    if (isCartOpen) {
      toggleCartDrawer();
    }
    setIsSidebarOpen(!isSidebarOpen);
  };

  // 添加内容区域滚动监听，实现滚动时自动折叠侧边栏
  useEffect(() => {
    const contentElement = document.querySelector('.pet-store-container .flex-1');
    if (contentElement) {
      const handleScroll = () => {
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      };

      contentElement.addEventListener('scroll', handleScroll);
      return () => {
        contentElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isSidebarOpen]);

  return (
    <div className="pet-store-container min-h-screen flex flex-col">
      {/* 二级头部导航 - 顶部区域 */}
      <PetStoreSecondaryNav
          selectedNavItem={selectedNavItem}
          onNavItemChange={handleNavItemChange}
          onSearch={handleSearch}
          onToggleFilters={toggleSidebar}
          onToggleCart={toggleCartDrawer}
          onToggleFavorites={toggleFavorites}
          cartCount={itemCount}
          favoritesCount={favoritesCount}
        />
      
      {/* 主要内容区域 */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* 右侧分类筛选区域 - 固定定位，初始完全隐藏（抽屉模式） */}
        <div 
          className="fixed right-0 top-[64px] bottom-0 border-l border-gray-200 bg-white overflow-hidden z-10 transition-transform duration-300 ease-in-out"
          style={{ 
            width: `${expandedWidth}px`,
            maxWidth: maxWidth,
            transform: isSidebarOpen || isCartOpen ? 'translateX(0)' : 'translateX(100%)',
            display: sidebarWidth === 0 && !isSidebarOpen && !isCartOpen ? 'none' : 'block'
          }}
        >
          {/* 侧边栏切换按钮 - 仅在侧边栏展开时显示 */}
          {(isSidebarOpen || isCartOpen) && (
            <button
              className="absolute top-4 left-[-10px] w-5 h-10 bg-white rounded-l-full border border-gray-200 border-r-0 flex items-center justify-center shadow-md z-20 hover:bg-gray-50 transition-colors"
              onClick={isSidebarOpen ? toggleSidebar : toggleCartDrawer}
              aria-label={isSidebarOpen ? "收起菜单" : "收起购物车"}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          )}
          
          {/* 折叠状态下的图标按钮 - 在右侧侧边栏不需要，筛选功能已移至顶部导航 */}
          {/* 移除固定的侧边栏图标按钮，统一使用顶部导航栏的筛选按钮 */}
          

        
          {/* 展开状态下的完整菜单 */}
          {isSidebarOpen && (
            <div className="h-full p-4 overflow-y-auto">
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
          )}
          
          {/* 购物车侧边栏内容 - 根据isCartOpen状态显示 */}
          {isCartOpen && (
            <div className="h-full p-4 overflow-y-auto">
              <CartSidebar onClose={toggleCartDrawer} />
            </div>
          )}
          
          {/* 收藏夹侧边栏内容 - 根据isFavoritesOpen状态显示 */}
          {isFavoritesOpen && (
            <div className="h-full p-4 overflow-y-auto">
              <FavoritesSidebar onClose={toggleFavorites} />
            </div>
          )}
        </div>
        
        {/* 主体内容区域 */}
        <div 
          className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300 ease-in-out"
          style={{ marginRight: isSidebarOpen || isCartOpen || isFavoritesOpen ? `${expandedWidth}px` : '0px' }}
        >
          {/* 渐变背景标题轮播图区域 */}
          <PetStoreCarousel />
          
          {/* 商品列表区域 */}
          <div className="px-4 md:px-12">
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