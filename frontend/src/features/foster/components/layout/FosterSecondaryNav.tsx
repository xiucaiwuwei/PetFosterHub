/**
 * 寄养服务页面的二级导航组件
 * 提供导航菜单、搜索和筛选入口
 */
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Filter, List, Heart, Search } from 'lucide-react';

// 导航项类型定义
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

interface FosterSecondaryNavProps {
  selectedNavItem: string;
  onNavItemChange: (id: string) => void;
  onSearch?: (value: string) => void;
  onToggleFilters?: () => void;
  onToggleFavorites?: () => void;
  favoritesCount?: number;
}

const FosterSecondaryNav: React.FC<FosterSecondaryNavProps> = ({
  selectedNavItem,
  onNavItemChange,
  onSearch,
  onToggleFilters,
  onToggleFavorites,
  favoritesCount = 0
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim() && onSearch) {
      onSearch(searchValue.trim());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  // 定义主导航项（在所有设备上显示）
  const primaryNavItems: NavItem[] = [
    { id: 'all', label: '全部寄养' },
    { id: 'popular', label: '热门推荐'},
  ];

  // 定义次要导航项（在大屏幕上显示）
  const secondaryNavItems: NavItem[] = [
    { id: 'nearby', label: '附近寄养' },
    { id: 'pet-friendly', label: '宠物友好' },
    { id: 'professional', label: '专业寄养' },
    { id: 'home-style', label: '家庭式寄养' },
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

  const searchVariants = {
    focus: {
      width: '240px',
      transition: { duration: 0.3 }
    },
    blur: {
      width: '192px',
      transition: { duration: 0.3 }
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
          
          {/* 功能按钮区域 */}
          <div className="hidden md:flex items-center ml-4">
            {/* 搜索功能 */}
            {onSearch && (
              <div className="flex items-center mr-3">
                <div className="relative flex-grow max-w-md">
                  <motion.input
                    type="text"
                    placeholder="搜索寄养服务..."
                    value={searchValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    className="pl-10 pr-12 py-2.5 rounded-xl border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-300 transition-all duration-300 shadow-sm placeholder-gray-400 bg-white w-full"
                    initial="blur"
                    whileFocus="focus"
                    animate="blur"
                    variants={searchVariants}
                  />
                  <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <motion.button
                  whileHover={buttonVariants.hover}
                  whileTap={buttonVariants.tap}
                  onClick={handleSearch}
                  className="ml-2 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 shadow-sm hover:shadow whitespace-nowrap"
                >
                  搜索
                </motion.button>
              </div>
            )}
            
            {/* 筛选图标按钮 */}
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
            
            {/* 收藏夹图标按钮 */}
            {onToggleFavorites && (
              <motion.button
                whileHover={buttonVariants.hover}
                whileTap={buttonVariants.tap}
                onClick={onToggleFavorites}
                className="ml-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-lg p-2 transition-all duration-300 shadow-sm hover:shadow relative"
                aria-label="我的收藏"
              >
                <Heart className="w-5 h-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {favoritesCount}
                  </span>
                )}
              </motion.button>
            )}
            
            {/* 订单记录图标 */}
            <motion.button
              whileHover={buttonVariants.hover}
              whileTap={buttonVariants.tap}
              className="ml-3 bg-white hover:bg-gray-50 text-orange-600 border border-orange-300 rounded-lg p-2 transition-all duration-300 shadow-sm hover:shadow"
            >
              <Link
                to="/profile/orders"
                className="flex items-center justify-center"
                aria-label="我的订单"
              >
                <List className="w-5 h-5" />
              </Link>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FosterSecondaryNav;