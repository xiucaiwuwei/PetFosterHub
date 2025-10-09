/**
 * 我的寄养服务标签页组件
 */
import React from 'react';
import { Home, Plus } from 'lucide-react';

interface ProfileServicesTabProps {
  onCreateService: () => void;
}

/**
 * 我的寄养服务标签页组件
 */
export const ProfileServicesTab: React.FC<ProfileServicesTabProps> = ({
  onCreateService
}) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Home className="text-2xl text-orange-500" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">您还没有创建寄养服务</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        创建寄养服务，开始接收宠物寄养预订，为宠物提供温馨的临时家园
      </p>
      <button 
        onClick={onCreateService}
        className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        <Plus size={16} className="mr-2" />
        创建寄养服务
      </button>
    </div>
  );
};