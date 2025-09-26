import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { OrderSummary } from '../types/entity';
import { OrderStatusBadge } from './OrderStatusBadge';
import { formatDate } from '../utils/validationUtils';

interface OrderCardProps {
  order: OrderSummary;
  onClick?: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick(order.id);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ type: 'spring', stiffness: 300 }}
      onClick={() => onClick && onClick(order.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {order.fosterServiceTitle}
            </h3>
            <p className="text-sm text-gray-500">订单号: {order.id}</p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">寄养宠物</p>
            <p className="font-medium text-gray-900">{order.petName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">订单金额</p>
            <p className="font-bold text-gray-900">¥{order.totalPrice}</p>
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">寄养日期</p>
          <p className="text-gray-900">
            {formatDate(order.startDate)} 至 {formatDate(order.endDate)}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to={`/order/${order.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={handleClick}
          >
            查看详情
          </Link>
        </div>
      </div>
    </motion.div>
  );
};