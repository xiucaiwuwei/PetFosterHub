/**
 * 导航栏组件
 * 负责显示应用的导航栏，包括品牌/logo、导航链接、用户登录状态等。
 * 这是一个容器组件，整合了拆分出去的各个子组件。
 */
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '@/lib/contexts/cartContext';
import { RootState } from '@/app/store/store';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';
import { useLocation } from './UserLayout';

// 导入拆分出去的子组件
import { BrandLogo } from './navbar/BrandLogo';
import { NavigationLinks } from './navbar/NavigationLinks';
import { NotificationIcon } from './navbar/NotificationIcon';
import { PositionSelector } from './navbar/PositionSelector';
import { UserMenu } from './navbar/UserMenu';

export function Navbar() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useCart();
  const { selectedProvince, selectedCity, openPositionModal } = useLocation();
  const [userInfo, setUserInfo] = useState<any>(null);

  // 从本地存储加载用户信息
  useEffect(() => {
    const loadUserInfo = () => {
      try {
        const storedUserInfo = LocalStorageManager.getItem('userInfo');
        if (storedUserInfo) {
          setUserInfo(storedUserInfo);
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
      }
    };

    // 总是尝试加载用户信息，而不仅仅依赖isAuthenticated状态变化
    loadUserInfo();
  }, [isAuthenticated]);

  return (
    <nav className="bg-white shadow-md hover:shadow-lg fixed w-full z-20 top-0 left-0 transition-all duration-300">
      <div className="w-full">
        <div className="flex justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            {/* 品牌Logo */}
            <BrandLogo />
            
            {/* 导航链接 */}
            <NavigationLinks isAuthenticated={isAuthenticated} />
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-1 md:space-x-4 transition-all duration-300">
              {/* 通知图标 */}
              <NotificationIcon isAuthenticated={isAuthenticated} />
              
              {/* 位置选择器 */}
              <PositionSelector 
                selectedProvince={selectedProvince}
                selectedCity={selectedCity}
                openPositionModal={openPositionModal}
              />
              
              {/* 用户菜单 */}
              <UserMenu 
                isAuthenticated={isAuthenticated}
                userInfo={userInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}