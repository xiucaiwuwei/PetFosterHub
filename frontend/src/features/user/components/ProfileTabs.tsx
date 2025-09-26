import React from 'react';
import { GetUserInfoDto } from '../types';

interface ProfileTabsProps {
  userInfo: GetUserInfoDto;
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
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => onTabChange('info')}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'info' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <i className="fa-solid fa-user mr-2"></i>
          个人资料
        </button>
        
        {userInfo.role === 'owner' ? (
          <button
            onClick={() => onTabChange('pets')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'pets' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <i className="fa-solid fa-paw mr-2"></i>
            我的宠物
          </button>
        ) : (
          <button
            onClick={() => onTabChange('services')}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'services' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <i className="fa-solid fa-home mr-2"></i>
            我的寄养服务
          </button>
        )}
        
        <button
          onClick={() => onTabChange('bookings')}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'bookings' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <i className="fa-solid fa-calendar-check mr-2"></i>
          预订记录
        </button>
        
        <button
          onClick={() => onTabChange('purchases')}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'purchases' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <i className="fa-solid fa-shopping-cart mr-2"></i>
          购买记录
        </button>
        
        <button
          onClick={() => onTabChange('consultations')}
          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'consultations' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <i className="fa-solid fa-stethoscope mr-2"></i>
          问诊记录
        </button>
      </nav>
    </div>
  );
};