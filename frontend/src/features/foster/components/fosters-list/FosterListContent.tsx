/**
 * 寄养列表内容组件
 * 显示寄养服务列表、加载状态、错误状态和分页控件
 */
import React from 'react';
import { FosterCard } from '../FosterCard';
import FosterListSkeleton from './FosterListSkeleton';
import FosterListEmptyState from './FosterListEmptyState';
import type { FosterServiceItem } from '@/features/foster/types/dto';

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
 * 寄养列表的主要内容组件，包含错误状态、加载状态、结果显示和分页
 */
const FosterListContent: React.FC<FosterListContentProps> = ({
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

  if (fosters?.list && fosters.list.length > 0) {
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
            onClick={() => updateParams({pageNum: Math.max(1, fosters.pageNum - 1)})}
            disabled={fosters.pageNum === 1}
            className={`px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${fosters.pageNum === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
          >
            <i className="fa-solid fa-chevron-left mr-1"></i> 上一页
          </button>
          <button
            onClick={() => updateParams({pageNum: fosters.pageNum + 1})}
            disabled={fosters.pageNum * fosters.pageSize >= fosters.total}
            className={`px-4 py-2 mx-1 rounded-lg border transition-all duration-200 ${fosters.pageNum * fosters.pageSize >= fosters.total ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'}`}
          >
            下一页 <i className="fa-solid fa-chevron-right ml-1"></i>
          </button>
        </div>
      </>
    );
  }

  return (
    <FosterListEmptyState
      onClearAllFilters={onClearAllFilters}
      onRefreshList={refreshFosters}
    />
  );
};

export default FosterListContent;