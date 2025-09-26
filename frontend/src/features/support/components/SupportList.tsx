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
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-md">
        <div className="text-gray-400 mb-2">
          <i className="fa-solid fa-question-circle text-4xl"></i>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          {isAdminView ? '暂无支持请求' : '您还没有提交过支持请求'}
        </h3>
        <p className="text-gray-500">
          {isAdminView ? '当用户提交新的支持请求时，将会显示在这里。' : '如有任何问题或建议，请提交支持请求。'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <SupportCard
          key={request.id}
          request={request}
          onViewDetails={onViewDetails}
          onUpdateStatus={onUpdateStatus}
          isAdminView={isAdminView}
        />
      ))}
    </div>
  );
};

export default SupportList;