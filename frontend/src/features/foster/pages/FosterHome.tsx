/**
 * 寄养服务列表页面
 * 展示所有可提供的寄养服务，并提供搜索和筛选功能
 */
import { useState } from 'react';
import { useFosterListData } from '../hooks/useFosterListData';
import { useFosterFavorites } from '../components/favorites';
import { useFosterHomeUI } from '../hooks/useFosterHomeUI';
import { FosterCarousel, FosterListContent } from '../components';
import FosterSecondaryNav from '../components/layout/FosterSecondaryNav';
import FosterFilterPanel from '../components/layout/FosterFilterPanel';
import { FosterFavoritesManager } from '../components/favorites';
import { ChevronRight } from 'lucide-react';

function FosterHomeContent() {
  // 导入useState用于管理标签状态
  const [activeTab, setActiveTab] = useState<'filters' | 'favorites'>('filters');
  
  // 使用自定义hook处理所有数据逻辑
  const { 
    fosters,
    loading,
    error,
    refreshFosters,
    updateParams,
    handleFiltersChange,
    clearAllFilters
  } = useFosterListData({ pageNum: 1, pageSize: 12 });

  // 直接使用收藏夹hook
  const { toggleFavorites, favoritesCount } = useFosterFavorites();

  // 使用自定义hook处理UI相关逻辑
  const {
    selectedNavItem,
    isFilterOpen,
    selectedPetType,
    selectedServiceType,
    priceRanges,
    petTypes,
    serviceTypes,
    handleNavItemChange,
    toggleFilters,
    handlePetTypeChange,
    handleServiceTypeChange,
    handlePriceRangeChange,
    handleApplyFilters,
    handleResetFilters
  } = useFosterHomeUI({
    onParamsChange: updateParams,
    onFiltersChange: handleFiltersChange
  });

  // 侧边栏宽度设置
  const [expandedWidth] = useState(384);
  const maxWidth = '50%'; // 最大宽度为界面的一半

  return (
    <FosterFavoritesManager>
      <div className="foster-container flex flex-col min-h-screen">
        {/* 二级导航 */}
        <FosterSecondaryNav
          selectedNavItem={selectedNavItem}
          onNavItemChange={handleNavItemChange}
          onSearch={(value) => {
            updateParams({ keyword: value, pageNum: 1 });
          }}
          onToggleFilters={() => {
            setActiveTab('filters');
            toggleFilters();
          }}
          onToggleFavorites={() => {
            setActiveTab('favorites');
            toggleFilters();
          }}
          favoritesCount={favoritesCount}
        />

        {/* 主要内容区域 */}
        <div className="flex flex-1 relative overflow-hidden">
          {/* 右侧筛选区域 - 固定定位，初始完全隐藏（抽屉模式） */}
          <div
            className="fixed right-0 top-[64px] bottom-0 border-l border-gray-200 bg-white overflow-hidden z-10 transition-transform duration-300 ease-in-out"
            style={{
              width: `${expandedWidth}px`,
              maxWidth: maxWidth,
              transform: isFilterOpen ? 'translateX(0)' : 'translateX(100%)'
            }}
          >
            {/* 侧边栏切换按钮 - 仅在侧边栏展开时显示 */}
            {isFilterOpen && (
              <button
                className="absolute top-4 left-[-10px] w-5 h-10 bg-white rounded-l-full border border-gray-200 border-r-0 flex items-center justify-center shadow-md z-20 hover:bg-gray-50 transition-colors"
                onClick={toggleFilters}
                aria-label="收起菜单"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            )}

            {/* 筛选面板内容 */}
            {isFilterOpen && (
              <FosterFilterPanel
                onClose={toggleFilters}
                petTypes={petTypes}
                serviceTypes={serviceTypes}
                priceRanges={priceRanges}
                selectedPetType={selectedPetType}
                selectedServiceType={selectedServiceType}
                onPetTypeChange={handlePetTypeChange}
                onServiceTypeChange={handleServiceTypeChange}
                onPriceRangeChange={handlePriceRangeChange}
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            )}
          </div>

          {/* 主体内容区域 */}
          <div
            className="flex-1 bg-gray-50 min-h-[calc(100vh-64px)] overflow-y-auto transition-all duration-300 ease-in-out"
            style={{ marginRight: isFilterOpen ? `${expandedWidth}px` : '0px' }}
          >
            {/* 页面标题轮播图区域 */}
            <FosterCarousel />

            <div className="container mx-auto px-4 py-6">
              {/* 寄养服务列表区域 */}
              <FosterListContent
                fosters={fosters}
                loading={loading}
                error={error}
                refreshFosters={refreshFosters}
                updateParams={updateParams}
                onClearAllFilters={clearAllFilters} />
            </div>
          </div>
        </div>
      </div>
    </FosterFavoritesManager>
  );
}

function FosterHome() {
  return (
    <FosterFavoritesManager>
      <FosterHomeContent />
    </FosterFavoritesManager>
  );
}

export default FosterHome;