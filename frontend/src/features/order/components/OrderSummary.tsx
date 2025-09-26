import React from 'react';
import { Order } from '../types/entity';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDate } from '../utils/validationUtils';

interface OrderSummaryProps {
  order: Order;
  className?: string;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ order, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">订单详情</h2>
          <p className="text-gray-500">订单编号: {order.id}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">寄养服务</h3>
          <p className="text-gray-900">
            {order.fosterService ? order.fosterService.title : '未知服务'}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">寄养日期</h3>
          <p className="text-gray-900">
            {formatDate(order.startDate)} 至 {formatDate(order.endDate)}
          </p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">订单金额</h3>
          <p className="text-gray-900 font-bold">¥{order.totalPrice}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">创建时间</h3>
          <p className="text-gray-900">{formatDate(order.createdAt)}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">更新时间</h3>
          <p className="text-gray-900">{formatDate(order.updatedAt)}</p>
        </div>
      </div>

      {order.notes && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">特殊要求</h3>
          <p className="text-gray-900">{order.notes}</p>
        </div>
      )}
    </div>
  );
};