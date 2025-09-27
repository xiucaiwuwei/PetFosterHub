import React from 'react';

interface FosterListEmptyStateProps {
  onClearAllFilters: () => void;
  onRefreshList: () => void;
}

/**
 * 寄养列表为空时的显示组件
 */
const FosterListEmptyState: React.FC<FosterListEmptyStateProps> = ({
  onClearAllFilters,
  onRefreshList,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-10 text-center animate-fadeIn">
      <div
        className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6"
      >
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

export default FosterListEmptyState;