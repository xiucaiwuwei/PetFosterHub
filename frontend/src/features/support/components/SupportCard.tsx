import React from 'react';
import { SupportResponseDto } from '../types';
import { formatSupportStatus, formatDateTime } from '../utils/validationUtils';

interface SupportCardProps {
  request: SupportResponseDto;
  onViewDetails?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  isAdminView?: boolean;
}

const SupportCard: React.FC<SupportCardProps> = ({
  request,
  onViewDetails,
  onUpdateStatus,
  isAdminView = false
}) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceTypeLabel = (serviceType: string): string => {
    const serviceTypeMap: Record<string, string> = {
      'foster': '寄养服务',
      'boarding': '住宿服务',
      'grooming': '美容服务',
      'training': '训练服务',
      'medical': '医疗服务',
      'other': '其他服务'
    };
    return serviceTypeMap[serviceType] || serviceType;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">
              {isAdminView ? `用户: ${request.userName}` : '我的请求'}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {getServiceTypeLabel(request.serviceType)}
            </h3>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {formatSupportStatus(request.status)}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 line-clamp-2">
            {request.message}
          </p>
          {request.adminResponse && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-1">管理员回复:</div>
              <p className="text-sm text-gray-700">{request.adminResponse}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {formatDateTime(request.updatedAt || request.createdAt)}
          </span>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(request.id)}
              className="text-orange-500 hover:text-orange-700 font-medium transition-colors duration-150"
            >
              查看详情
            </button>
          )}
        </div>
        
        {isAdminView && onUpdateStatus && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <select
              value={request.status}
              onChange={(e) => onUpdateStatus(request.id, e.target.value)}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 px-2 py-1 border"
            >
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
              <option value="rejected">已拒绝</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportCard;