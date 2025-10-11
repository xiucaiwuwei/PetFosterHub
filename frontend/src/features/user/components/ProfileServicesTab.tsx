/**
 * 我的寄养服务标签页组件
 */
import React from 'react';
import { Home, Plus, Heart, Shield, PawPrint } from 'lucide-react';

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
    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden relative animate-fade-in opacity-100 translate-y-0 transition-all duration-500">
        {/* 装饰背景元素 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-orange-50 to-transparent opacity-70"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-tr from-blue-50 to-transparent opacity-70"></div>
        
        {/* 动画装饰元素 */}
        <div className="absolute top-16 left-16 w-16 h-16 rounded-full bg-orange-100 opacity-30 animate-pulse"></div>
        <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-blue-100 opacity-40 animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-1/4 w-8 h-8 rounded-full bg-green-100 opacity-30 animate-pulse delay-700"></div>
        
        <div className="relative z-10">
          {/* 图标区域 */}
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500/10 to-orange-600/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Home className="text-white" size={36} />
              </div>
            </div>
          </div>
          
          {/* 标题和描述 */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">您还没有创建寄养服务</h3>
          <p className="text-gray-600 mb-10 max-w-md mx-auto text-lg leading-relaxed">
            创建寄养服务，开始接收宠物寄养预订，为宠物提供温馨的临时家园
          </p>
          
          {/* 优势说明 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center p-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-3">
                <Heart size={18} className="text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">关爱宠物</span>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                <Shield size={18} className="text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">安全保障</span>
            </div>
            
            <div className="flex flex-col items-center p-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
                <PawPrint size={18} className="text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">专业服务</span>
            </div>
          </div>
          
          {/* 创建服务按钮 */}
          <button 
            onClick={onCreateService}
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            <Plus size={16} className="mr-2" />
            创建寄养服务
          </button>
        </div>
      </div>
  );
};