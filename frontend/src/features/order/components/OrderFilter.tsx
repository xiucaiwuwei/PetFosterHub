import React from 'react';
import { OrderStatus, OrderSortOption } from '../types/enums';
import { getOrderStatusText } from '../utils/validationUtils';

interface OrderFilterProps {
  selectedStatus: OrderStatus | 'all';
  selectedSortOption: OrderSortOption;
  onStatusChange: (status: OrderStatus | 'all') => void;
  onSortChange: (sortOption: OrderSortOption) => void;
}

export const OrderFilter: React.FC<OrderFilterProps> = ({
  selectedStatus,
  selectedSortOption,
  onStatusChange,
  onSortChange
}) => {
  const statusOptions = [
    { value: 'all', label: '全部状态' },
    { value: OrderStatus.PENDING, label: getOrderStatusText(OrderStatus.PENDING) },
    { value: OrderStatus.CONFIRMED, label: getOrderStatusText(OrderStatus.CONFIRMED) },
    { value: OrderStatus.COMPLETED, label: getOrderStatusText(OrderStatus.COMPLETED) },
    { value: OrderStatus.CANCELLED, label: getOrderStatusText(OrderStatus.CANCELLED) }
  ];

  const sortOptions = [
    { value: OrderSortOption.DEFAULT, label: '默认排序' },
    { value: OrderSortOption.DATE_DESC, label: '最新创建' },
    { value: OrderSortOption.DATE_ASC, label: '最早创建' },
    { value: OrderSortOption.PRICE_DESC, label: '价格从高到低' },
    { value: OrderSortOption.PRICE_ASC, label: '价格从低到高' },
    { value: OrderSortOption.STATUS, label: '按状态排序' }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">订单状态</label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as OrderStatus | 'all')}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">排序方式</label>
          <select
            value={selectedSortOption}
            onChange={(e) => onSortChange(e.target.value as OrderSortOption)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};