/**
 * 状态展示组件集合
 * 包含加载状态和错误状态的展示组件
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FosterDetailHeader from '../layout/FosterDetailHeader';

/**
 * 加载状态展示组件
 * 当寄养服务详情正在加载时显示的界面
 */
export const LoadingState = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <FosterDetailHeader serviceName="加载服务详情" />
      <main className="flex-grow flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">加载服务详情中...</p>
        </div>
      </main>
    </div>
  );
};

/**
 * 错误状态展示组件
 * 当寄养服务详情加载失败时显示的界面
 */
export const ErrorState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <FosterDetailHeader serviceName="服务错误" />
      <main className="flex-grow flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-exclamation-triangle text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">服务不存在或已被移除</h3>
          <button
            onClick={() => navigate('/fosters')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mt-4"
          >
            返回寄养服务列表
          </button>
        </div>
      </main>
    </div>
  );
};