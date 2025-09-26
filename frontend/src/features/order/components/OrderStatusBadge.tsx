import React from 'react';
import { OrderStatus } from '../types/enums';
import { getOrderStatusText, getOrderStatusClass } from '../utils/validationUtils';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className = '' }) => {
  const statusText = getOrderStatusText(status);
  const statusClass = getOrderStatusClass(status);

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass} ${className}`}
    >
      {statusText}
    </span>
  );
};