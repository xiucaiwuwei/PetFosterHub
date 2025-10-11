import React from 'react';
import { UserProfileResponse } from '../types';

/**
 * 个人中心布局组件 - 左中右三栏布局
 * - 左侧：标签导航
 * - 中间：主体内容
 * - 右侧：个人信息
 */

interface ProfileLayoutProps {
  userInfo: UserProfileResponse;
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
  userInfoSummary?: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  userInfo,
  activeTab,
  onTabChange,
  children,
  userInfoSummary
}) => {
  // 默认的导航标签配置
  const tabs = [
    { id: 'profile', label: '个人资料', icon: '👤' },
    { id: 'pets', label: '我的宠物', icon: '🐾' },
    { id: 'bookings', label: '我的预订', icon: '📅' },
    { id: 'services', label: '我的服务', icon: '🏠' },
    { id: 'reviews', label: '评价管理', icon: '⭐' }
  ];

  return (
    <div className="h-full bg-gradient-to-br from-orange-50 to-amber-50">
      {/* 主要内容区域 - 左中右三栏布局 - 取消上下内边距 */}
      <main className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* 左侧 - 标签导航（lg屏幕占据2列） */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8 h-[calc(100vh-64px)]">
                <nav className="p-0">
                <h2 className="text-lg font-bold text-gray-900 mb-6 px-3">个人中心</h2>
                <ul className="space-y-1">
                  {tabs.map((tab) => (
                    <li key={tab.id}>
                      <button
                        onClick={() => onTabChange(tab.id)}
                        className={`w-full flex items-center px-3 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                          ? 'bg-orange-100 text-orange-600 font-medium shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'}`}
                        aria-label={tab.label}
                      >
                        <span className="text-xl mr-3">{tab.icon}</span>
                        <span>{tab.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* 中间 - 主体内容（lg屏幕占据8列） */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden lg:h-[calc(100vh-64px)]">
              {/* 主体内容区域 - 取消内边距，添加滚动 */}
              <div className="p-0 overflow-y-auto h-full">
                {children}
              </div>
            </div>
          </div>

          {/* 右侧 - 个人信息（lg屏幕占据2列） */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-8 h-[calc(100vh-64px)]">
              {userInfoSummary || (
                <div className="p-0">
                  {/* 默认个人信息展示 */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                        {userInfo.avatar ? (
                          <img
                            src={userInfo.avatar}
                            alt={`${userInfo.nickname || userInfo.fullName || '用户'}'s avatar`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-gray-900">
                      {userInfo.nickname || userInfo.fullName || '用户'}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {userInfo.role || '用户'}
                    </p>
                  </div>
                  
                  {/* 简要统计信息 */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                      <span className="text-gray-600">用户评分</span>
                      <span className="text-orange-600 font-medium">{userInfo.rating || 5.0}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                      <span className="text-gray-600">注册时间</span>
                      <span className="text-gray-600 text-sm">
                        {userInfo.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl">
                      <span className="text-gray-600">评价数量</span>
                      <span className="text-green-600 font-medium">
                        {userInfo.reviewCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileLayout;