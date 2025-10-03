/**
 * 寄养服务卡片列表组件
 * 展示寄养服务的卡片列表，每个卡片包含服务的基本信息和操作按钮
 */
import React from 'react';
import type { FosterServiceItem } from '@/features/foster/types/dto';
import { FosterCard } from '../index';

interface FostersData {
  list: FosterServiceItem[];
  total: number;
  pageNum: number;
  pageSize: number;
}

interface FosterListContentProps {
  fosters: FostersData | null;
  loading: boolean;
  error: string | null;
  refreshFosters: () => void;
  updateParams: (params: { pageNum: number }) => void;
  onClearAllFilters: () => void;
}

/**
 * 寄养列表为空时的显示组件
 * 当寄养服务列表为空时显示的界面，提供清除筛选和刷新列表的功能
 */
interface FosterListEmptyStateProps {
  onClearAllFilters: () => void;
  onRefreshList: () => void;
}

export const FosterListEmptyState: React.FC<FosterListEmptyStateProps> = ({ onClearAllFilters, onRefreshList }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center animate-fadeIn">
      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <i className="fa-solid fa-search text-4xl text-orange-400"></i>
      </div>
      <h3 className="text-xl font-medium text-gray-900 mb-3">未找到匹配的寄养服务</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        请尝试调整搜索条件或宠物类型，或者联系我们添加新的寄养服务
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onClearAllFilters}
          className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 transform hover:scale-105"
        >
          <i className="fa-solid fa-refresh mr-2"></i> 清除所有筛选条件
        </button>
        <button
          onClick={onRefreshList}
          className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300"
        >
          <i className="fa-solid fa-sync-alt mr-2"></i> 刷新列表
        </button>
      </div>
    </div>
  );
};

/**
 * 寄养列表加载状态的骨架屏组件
 */
export const FosterListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
          <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300"></div>
          <div className="p-5">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * 寄养列表的主要内容组件，包含错误状态、加载状态、结果显示和分页
 */
export const FosterListContent: React.FC<FosterListContentProps> = ({
  fosters,
  loading,
  error,
  refreshFosters,
  updateParams,
  onClearAllFilters,
}) => {
  if (error) {
    return (
      <div
        className="bg-red-50 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative mb-8 animate-shake"
        role="alert"
      >
        <strong className="font-bold">错误：</strong>
        <span className="block sm:inline">{error}</span>
        <button
          onClick={refreshFosters}
          className="ml-4 text-sm font-medium text-red-600 hover:text-red-800 underline"
        >
          重试
        </button>
      </div>
    );
  }

  if (loading) {
    return <FosterListSkeleton />;
  }

  if (!fosters || fosters.list.length === 0) {
    return <FosterListEmptyState onClearAllFilters={onClearAllFilters} onRefreshList={refreshFosters} />;
  }

  return (
    <>
      {/* 结果统计 */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900">
          找到 <span className="text-orange-500 font-bold">{fosters.total}</span> 个寄养服务
        </h2>
        <div className="text-sm text-gray-500">
          显示第 {fosters.pageNum * fosters.pageSize - fosters.pageSize + 1} - {Math.min(fosters.pageNum * fosters.pageSize, fosters.total)} 个
        </div>
      </div>

      {/* 卡片网格 - 使用更好的间距和动画 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {fosters.list.map((service) => (
          <div key={service.id} className="group animate-fadeInUp">
            <FosterCard service={service} />
          </div>
        ))}
      </div>

      {/* 分页控件 */}
      <div className="mt-12 flex justify-center">
        <button
          onClick={() => updateParams({ pageNum: Math.max(1, fosters.pageNum - 1) })}
          disabled={fosters.pageNum === 1}
          className={`px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${fosters.pageNum === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
        >
          <i className="fa-solid fa-chevron-left mr-1"></i> 上一页
        </button>
        <button
          onClick={() => updateParams({ pageNum: fosters.pageNum + 1 })}
          disabled={fosters.pageNum * fosters.pageSize >= fosters.total}
          className={`px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${fosters.pageNum * fosters.pageSize >= fosters.total ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
        >
          下一页 <i className="fa-solid fa-chevron-right ml-1"></i>
        </button>
      </div>
    </>
  );
};