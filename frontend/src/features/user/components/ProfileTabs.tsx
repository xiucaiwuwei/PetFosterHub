/**
 * 个人中心标签页导航组件
 */
import React from 'react';
import { UserProfileResponse } from '../types';
import { User, PawPrint, Home, Calendar, ShoppingCart, Stethoscope } from 'lucide-react';
import { UserRole } from '@/types';

interface ProfileTabsProps {
  userInfo: UserProfileResponse;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

/**
 * 个人中心标签页导航组件
 */
export const ProfileTabs: React.FC<ProfileTabsProps> = ({
  userInfo,
  activeTab,
  onTabChange
}) => {
  // 标签页配置
  const tabs = [
    {
      id: 'info',
      label: '个人资料',
      icon: <User size={18} />
    },
    {
      id: userInfo.role === UserRole.OWNER ? 'pets' : 'services',
      label: userInfo.role === UserRole.OWNER ? '我的宠物' : '我的寄养服务',
      icon: userInfo.role === UserRole.OWNER ? <PawPrint size={18} /> : <Home size={18} />
    },
    {
      id: 'bookings',
      label: '预订记录',
      icon: <Calendar size={18} />
    },
    {
      id: 'purchases',
      label: '购买记录',
      icon: <ShoppingCart size={18} />
    },
    {
      id: 'consultations',
      label: '问诊记录',
      icon: <Stethoscope size={18} />
    }
  ];

  return (
    <div className="border-b border-gray-100">
      <div className="flex overflow-x-auto scrollbar-hide py-2 px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 mr-2 rounded-lg font-medium text-sm flex items-center whitespace-nowrap transition-all duration-300 ${activeTab === tab.id 
              ? 'bg-orange-50 text-orange-600 shadow-sm' 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};