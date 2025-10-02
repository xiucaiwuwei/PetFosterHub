import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductSearch from '../search/ProductSearch';
import { Filter } from 'lucide-react';

// 导航项类型定义
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

interface PetStoreSecondaryNavProps {
  selectedNavItem: string;
  onNavItemChange: (id: string) => void;
  onSearch?: (value: string) => void;
  onToggleFilters?: () => void;
  onToggleCart?: () => void;
  onToggleFavorites?: () => void;
  cartCount?: number;
  favoritesCount?: number;
}

const PetStoreSecondaryNav: React.FC<PetStoreSecondaryNavProps> = ({
  selectedNavItem,
  onNavItemChange,
  onSearch,
  onToggleFilters,
  onToggleCart,
  onToggleFavorites,
  cartCount = 0,
  favoritesCount = 0
}) => {
  // 定义主导航项（在所有设备上显示）
  const primaryNavItems: NavItem[] = [
    { id: 'all', label: '全部商品' },
    { id: 'popular', label: '热门推荐', badge: '热' },
    { id: 'new', label: '新品上市', badge: '新' },
    { id: 'discount', label: '限时优惠', badge: '惠' }
  ];

  // 定义次要导航项（在大屏幕上显示） - 专注于营销和快速入口
  const secondaryNavItems: NavItem[] = [
    { id: 'recommended', label: '为您推荐' },
    { id: 'best-seller', label: '畅销榜单', badge: '榜' },
    { id: 'new-arrivals-week', label: '本周新品' },
    { id: 'hot-brands', label: '热门品牌' },
  ];

  // 动画变体
  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 sticky top-16 z-20 shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 导航区域 */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 flex-grow">
            {/* 主导航项 */}
            {primaryNavItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavItemChange(item.id)}
                className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 flex items-center justify-center text-sm font-medium ${selectedNavItem === item.id
                  ? 'bg-white text-orange-600 shadow-md border border-orange-200'
                  : 'text-gray-700 hover:bg-white hover:text-orange-700 hover:shadow-sm'}`}
                whileHover={buttonVariants.hover}
                whileTap={buttonVariants.tap}
              >
                {item.label}
                {item.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-xs font-semibold rounded-full bg-orange-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </motion.button>
            ))}
            
            {/* 大屏幕上显示的额外导航项 */}
            <div className="hidden md:flex space-x-2 ml-2">
              {secondaryNavItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavItemChange(item.id)}
                  className={`px-4 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 flex items-center justify-center text-sm font-medium ${selectedNavItem === item.id
                    ? 'bg-white text-orange-600 shadow-md border border-orange-200'
                    : 'text-gray-700 hover:bg-white hover:text-orange-700 hover:shadow-sm'}`}
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* 搜索功能 - 仅在中等屏幕以上显示 */}
          {onSearch && (
            <div className="hidden md:flex items-center ml-4">
              <ProductSearch 
                onSearch={onSearch} 
                variant="secondaryNav"
              />
              {/* 筛选图标按钮 - 放置在搜索和购物车之间 */}
              {onToggleFilters && (
                <motion.button
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                  onClick={onToggleFilters}
                  className="ml-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-lg p-2 transition-all duration-300 shadow-sm hover:shadow"
                  aria-label="筛选"
                >
                  <Filter className="w-5 h-5" />
                </motion.button>
              )}
              {/* 购物车图标 */}
              {onToggleCart && (
                <motion.button
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                  onClick={onToggleCart}
                  className="ml-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-lg p-2 transition-all duration-300 shadow-sm hover:shadow relative"
                  aria-label="购物车"
                >
                  <i className="fa-solid fa-shopping-cart w-5 h-5"></i>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </motion.button>
              )}
              
              {/* 收藏夹图标 */}
              {onToggleFavorites && (
                <motion.button
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                  onClick={onToggleFavorites}
                  className="ml-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-lg p-2 transition-all duration-300 shadow-sm hover:shadow relative"
                  aria-label="我的收藏"
                >
                  <i className="fa-solid fa-heart w-5 h-5"></i>
                  {favoritesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                      {favoritesCount}
                    </span>
                  )}
                </motion.button>
              )}
              {/* 订单记录图标 */}
              <motion.div
                whileHover={buttonVariants.hover}
                whileTap={buttonVariants.tap}
              >
                <Link
                  to="/profile/orders"
                  className="ml-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-lg p-2 transition-all duration-300 shadow-sm hover:shadow"
                  aria-label="我的订单"
                >
                  <i className="fa-solid fa-list-alt text-base"></i>
                </Link>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetStoreSecondaryNav;