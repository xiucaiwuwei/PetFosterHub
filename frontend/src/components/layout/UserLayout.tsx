import { useState, createContext, useContext } from 'react';
import { Navbar } from './Navbar.tsx';
import { Outlet } from 'react-router-dom';
import useUserInfoCheck from '@/features/auth/hooks/useUserInfoCheck';
import { ErrorBoundary } from '../error/ErrorBoundary';
import { PositionModal } from './PositionModal';
import LocalStorageManager from '@/lib/utils/LocalStorageManager';

// 定义位置信息接口
interface Province {
  code: string;
  name: string;
}

interface City {
  code: string;
  name: string;
  provinceCode: string;
}

// 定义位置上下文接口
interface LocationContextType {
  selectedProvince: Province;
  selectedCity: City;
  setSelectedProvince: React.Dispatch<React.SetStateAction<Province>>;
  setSelectedCity: React.Dispatch<React.SetStateAction<City>>;
  openPositionModal: () => void;
}

// 创建位置上下文
const LocationContext = createContext<LocationContextType | undefined>(undefined);

/**
 * 自定义钩子，用于使用位置上下文
 */
export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a UserLayout');
  }
  return context;
}

/**
 * 用户端布局组件 - 实现上下结构
 * 上部为固定导航栏，中间为主体内容，底部为页脚
 */
export function UserLayout({ fixedHeight = false }: { fixedHeight?: boolean }) {
  useUserInfoCheck({
    checkInterval: 30000,
    redirectStorageKey: 'redirectAfterCompleteProfile',
    customCheck: (userInfo) => {
      return userInfo?.user?.nickname && userInfo.user.nickname.trim() !== '';
    }
  });

  // 位置选择相关状态
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  
  // 定义位置存储接口
  interface LocationStorage {
    province: Province;
    city: City;
  }

  // 从本地存储加载默认位置，或者使用北京市作为默认值
  const getDefaultLocation = () => {
    try {
      const storedLocation = LocalStorageManager.getItem<LocationStorage>('selectedLocation');
      if (storedLocation && storedLocation.province && storedLocation.city) {
        return storedLocation;
      }
    } catch (error) {
      console.error('加载位置信息失败:', error);
    }
    return {
      province: { code: "11", name: "北京市" },
      city: { code: "1101", name: "市辖区", provinceCode: "11" }
    };
  };

  const defaultLocation = getDefaultLocation();
  const [selectedProvince, setSelectedProvince] = useState<Province>(defaultLocation.province);
  const [selectedCity, setSelectedCity] = useState<City>(defaultLocation.city);

  // 打开位置选择模态框
  const openPositionModal = () => {
    setIsPositionModalOpen(true);
  };

  // 关闭位置选择模态框
  const closePositionModal = () => {
    setIsPositionModalOpen(false);
  };

  // 处理位置选择确认
  const handlePositionSelect = (province: Province, city: City) => {
    setSelectedProvince(province);
    setSelectedCity(city);
    
    // 保存选择的位置到本地存储
    try {
      LocalStorageManager.setItem<LocationStorage>('selectedLocation', {
        province,
        city
      });
    } catch (error) {
      console.error('保存位置信息失败:', error);
    }
  };

  // 位置上下文值
  const locationContextValue: LocationContextType = {
    selectedProvince,
    selectedCity,
    setSelectedProvince,
    setSelectedCity,
    openPositionModal
  };

  return (
    <LocationContext.Provider value={locationContextValue}>
      <div className={fixedHeight ? "flex flex-col h-screen overflow-hidden" : "flex flex-col min-h-screen"}>
        {/* 头部导航 */}
        <Navbar />

        {/* 主体内容区域 - 占据剩余空间，并为固定导航栏留出顶部空间 */}
        <main className={fixedHeight ? "h-[calc(100vh-64px)] pt-16 overflow-hidden" : "flex-1 pt-16"}>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
      
      {/* 位置选择模态框 */}
      <PositionModal
        isOpen={isPositionModalOpen}
        onClose={closePositionModal}
        onSelect={handlePositionSelect}
        selectedProvince={selectedProvince}
        selectedCity={selectedCity}
      />
    </LocationContext.Provider>
  );
}