import React from 'react';

/**
 * 寄养列表加载状态的骨架屏组件
 */
const FosterListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({length: 6}).map((_, index) => (
        <div key={index}
          className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
        >
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

export default FosterListSkeleton;