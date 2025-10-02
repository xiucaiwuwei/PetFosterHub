import React from 'react';
import { SupportResponseDto } from '../types';
import SupportCard from './SupportCard';

interface SupportListProps {
  requests: SupportResponseDto[];
  onViewDetails?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  isAdminView?: boolean;
  isLoading?: boolean;
  error?: string;
}

const SupportList: React.FC<SupportListProps> = ({
  requests,
  onViewDetails,
  onUpdateStatus,
  isAdminView = false,
  isLoading = false,
  error = ''
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 flex flex-col items-center justify-center min-h-[400px] border border-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-b-4 border-transparent mb-4"></div>
        <h3 className="text-lg font-medium text-gray-800">
          {isAdminView ? '加载支持请求中...' : '加载您的请求中...'}
        </h3>
        <p className="text-gray-500 mt-2">请稍候，我们正在获取最新数据</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow-sm flex items-start">
        <div className="mr-4 text-red-500 mt-1">
          <i className="fa-solid fa-exclamation-circle text-xl"></i>
        </div>
        <div>
          <h4 className="font-medium mb-1">加载失败</h4>
          <p>{error}</p>
          <button 
            className="mt-3 text-sm text-white bg-red-500 px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={() => window.location.reload()}
          >
            <i className="fa-solid fa-arrows-rotate mr-1"></i>
            重试
          </button>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-10 text-center border border-gray-100 min-h-[400px] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <i className="fa-solid fa-question-circle text-orange-400 text-4xl"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {isAdminView ? '暂无支持请求' : '您还没有提交过支持请求'}
        </h3>
        <p className="text-gray-600 max-w-md mb-6">
          {isAdminView ? '当用户提交新的支持请求时，将会显示在这里。' : '如有任何问题或建议，请提交支持请求，我们将尽快为您解决。'}
        </p>
        {!isAdminView && (
          <a 
            href="/support/submit" 
            className="px-6 py-2 bg-orange-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-orange-600 hover:shadow-md transform hover:-translate-y-1"
          >
            <i className="fa-solid fa-plus mr-2"></i>
            提交支持请求
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">
          {isAdminView ? '支持请求列表' : '我的支持请求'}
        </h3>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
          {requests.length} 条记录
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request) => (
          <SupportCard
            key={request.id}
            request={request}
            {...(onViewDetails && { onViewDetails })}
            {...(onUpdateStatus && { onUpdateStatus })}
            isAdminView={isAdminView}
          />
        ))}
      </div>
    </div>
  );
};

export default SupportList;