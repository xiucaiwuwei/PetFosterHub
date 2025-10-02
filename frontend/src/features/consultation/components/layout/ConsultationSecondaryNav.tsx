import React, { useState, useEffect, useRef } from 'react';

// 导航项类型定义
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

interface ConsultationSecondaryNavProps {
  selectedNavItem: string;
  onNavItemChange: (id: string) => void;
  onSearch?: (value: string) => void;
  onToggleFilters?: () => void;
  notificationsCount?: number;
}

// 导入拆分后的组件
import ClinicDropdown from './dropdowns/ClinicDropdown';
import DepartmentDropdown from './dropdowns/DepartmentDropdown';
import SecondaryNavItems from './navigation/SecondaryNavItems';
import SearchBar from './links/SearchBar';
import FilterButton from './links/FilterButton';
import HealthRecordsLink from './links/HealthRecordsLink';
import NotificationsButton from './links/NotificationsButton';
import ConsultationsLink from './links/ConsultationsLink';
import VaccinationsLink from './links/VaccinationsLink';
import HelpCenterLink from './links/HelpCenterLink';
import HospitalBrand from './links/HospitalBrand';
import MobileSearchButton from './links/MobileSearchButton';
import useOutsideClick from './utils/useOutsideClick';

const ConsultationSecondaryNav: React.FC<ConsultationSecondaryNavProps> = ({
  selectedNavItem,
  onNavItemChange,
  onSearch,
  onToggleFilters,
  notificationsCount = 0
}) => {
  // 状态管理
  const [selectedClinic, setSelectedClinic] = useState('central');
  const [clinicMenuOpen, setClinicMenuOpen] = useState(false);
  const [departmentMenuOpen, setDepartmentMenuOpen] = useState(false);
  
  // 引用和自定义钩子
  const navRef = useRef<HTMLDivElement>(null);
  
  // 使用自定义钩子处理点击外部关闭下拉菜单
  useOutsideClick(navRef, () => {
    setClinicMenuOpen(false);
    setDepartmentMenuOpen(false);
  });
  
  // 定义主导航项（在所有设备上显示）
  const primaryNavItems: NavItem[] = [
    { id: 'all-department', label: '全部科目' },
    { id: 'internal', label: '内科' },
    { id: 'surgery', label: '外科' },
    { id: 'dermatology', label: '皮肤科' },
    { id: 'ophthalmology', label: '眼科' },
    { id: 'dental', label: '牙科' },
    { id: 'cardiology', label: '心脏科' }
  ];

  // 定义次要导航项（在大屏幕上显示）
  const secondaryNavItems: NavItem[] = [
    { id: 'emergency', label: '急诊服务' },
    { id: 'health-check', label: '健康检查' },
    { id: 'nutrition', label: '营养咨询' },
    { id: 'behavior', label: '行为指导' },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 sticky top-16 z-20 shadow-sm backdrop-blur-sm bg-opacity-95">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16" ref={navRef}>
          {/* 导航区域 */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-2 flex-grow">
            {/* 诊所选择下拉菜单 */}
            <ClinicDropdown 
              selectedClinic={selectedClinic} 
              onClinicChange={setSelectedClinic} 
              clinicMenuOpen={clinicMenuOpen} 
              setClinicMenuOpen={setClinicMenuOpen} 
            />
            
            {/* 科目选择下拉菜单 */}
            <DepartmentDropdown 
              selectedNavItem={selectedNavItem} 
              onNavItemChange={onNavItemChange} 
              primaryNavItems={primaryNavItems} 
              departmentMenuOpen={departmentMenuOpen} 
              setDepartmentMenuOpen={setDepartmentMenuOpen} 
            />
            
            {/* 大屏幕上显示的额外导航项 */}
            <SecondaryNavItems 
              secondaryNavItems={secondaryNavItems} 
              selectedNavItem={selectedNavItem} 
              onNavItemChange={onNavItemChange} 
            />
          </div>
          
          {/* 右侧功能区 - 仅在中等屏幕以上显示 */}
          <div className="hidden md:flex items-center ml-4">
            {/* 搜索功能 */}
            <SearchBar onSearch={onSearch} />
            
            {/* 筛选图标按钮 */}
            <FilterButton onToggleFilters={onToggleFilters} />
            
            {/* 健康档案 */}
            <HealthRecordsLink />

            {/* 通知图标 */}
            <NotificationsButton notificationsCount={notificationsCount} />
            
            {/* 咨询记录 */}
            <ConsultationsLink />
            
            {/* 疫苗提醒 */}
            <VaccinationsLink />
            
            {/* 帮助中心 */}
            <HelpCenterLink />
          </div>
          
          {/* 医院品牌标识 */}
          <HospitalBrand />
          
          {/* 移动端搜索按钮 */}
          <MobileSearchButton />
        </div>
      </div>
    </div>
  );
};

export default ConsultationSecondaryNav;