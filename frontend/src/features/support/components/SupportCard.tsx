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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1 flex items-center">
              {isAdminView ? (
                <>
                  <i className="fa-solid fa-user-circle mr-1.5"></i>
                  用户: {request.userName}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-comment-dots mr-1.5"></i>
                  我的请求
                </>
              )}
            </span>
            <h3 className="text-xl font-bold text-gray-800 truncate">
              {getServiceTypeLabel(request.serviceType)}
            </h3>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
            {formatSupportStatus(request.status)}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 leading-relaxed">
            {request.message}
          </p>
          {request.adminResponse && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
              <div className="flex items-center text-sm font-medium text-blue-700 mb-2">
                <i className="fa-solid fa-clipboard-check mr-2"></i>
                管理员回复:
              </div>
              <p className="text-gray-700 ml-6">{request.adminResponse}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
          <span className="text-gray-500 flex items-center">
            <i className="fa-solid fa-clock mr-1.5"></i>
            {formatDateTime(request.updatedAt || request.createdAt)}
          </span>
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(request.id)}
              className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-medium transition-all duration-300 hover:bg-orange-100 hover:shadow-sm"
            >
              <i className="fa-solid fa-arrow-right mr-1.5"></i>
              查看详情
            </button>
          )}
        </div>
        
        {isAdminView && onUpdateStatus && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">更新状态:</span>
              <select
                value={request.status}
                onChange={(e) => onUpdateStatus(request.id, e.target.value)}
                className="text-sm rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 px-3 py-2 border transition-all duration-200"
              >
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已解决</option>
                <option value="rejected">已拒绝</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportCard;