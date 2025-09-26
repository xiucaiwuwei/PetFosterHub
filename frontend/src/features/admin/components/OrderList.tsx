import React from 'react';
import { OrderStatus } from '../types/enums';
import { formatDate } from '../utils/validationUtils';
import { StatusBadge } from './StatusBadge';

interface Order {
  id: string;
  orderNumber: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  service: {
    id: string;
    name: string;
    type: string;
  };
  pet: {
    id: string;
    name: string;
    type: string;
    breed: string;
  };
  status: OrderStatus;
  totalAmount: number;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
}

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onViewOrder: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
  searchTerm: string;
  selectedStatus: string;
  clearFilters: () => void;
}

/**
 * 订单列表组件
 */
export const OrderList: React.FC<OrderListProps> = ({
  orders,
  isLoading,
  onViewOrder,
  onEditOrder,
  onDeleteOrder,
  searchTerm,
  selectedStatus,
  clearFilters
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">加载订单数据中...</p>
      </div>
    );
  }

  const getStatusType = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.CONFIRMED:
        return 'primary';
      case OrderStatus.IN_PROGRESS:
        return 'info';
      case OrderStatus.COMPLETED:
        return 'success';
      case OrderStatus.CANCELLED:
      case OrderStatus.REJECTED:
        return 'danger';
      case OrderStatus.REFUNDED:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING]: '待确认',
      [OrderStatus.CONFIRMED]: '已确认',
      [OrderStatus.IN_PROGRESS]: '进行中',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELLED]: '已取消',
      [OrderStatus.REJECTED]: '已拒绝',
      [OrderStatus.REFUNDED]: '已退款'
    };
    return statusMap[status] || status;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                订单编号
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用户信息
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                服务信息
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金额
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={order.user.avatar} 
                          alt={order.user.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{order.user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.service.name}</div>
                    <div className="text-sm text-gray-500">
                      {order.pet.name} ({order.pet.type}, {order.pet.breed})
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={getStatusLabel(order.status)} 
                      type={getStatusType(order.status)} 
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ¥{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onViewOrder(order)}
                      className="text-blue-500 hover:text-blue-600 mr-3"
                    >
                      查看
                    </button>
                    <button 
                      onClick={() => onEditOrder(order)}
                      className="text-orange-500 hover:text-orange-600 mr-3"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => onDeleteOrder(order)}
                      className="text-red-500 hover:text-red-600"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-search text-3xl mb-2 text-gray-300"></i>
                    <p>未找到匹配的订单</p>
                    {(searchTerm || selectedStatus !== 'all') && (
                      <button 
                        onClick={clearFilters}
                        className="mt-2 text-orange-500 hover:text-orange-600 text-sm"
                      >
                        清除筛选条件
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};