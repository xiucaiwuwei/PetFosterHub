import { OrderStatus } from '../types/enums';

// 格式化日期显示
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 验证订单日期范围
export const validateOrderDates = (startDate: Date, endDate: Date): { valid: boolean; message?: string } => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // 开始日期不能早于今天
  if (startDate < now) {
    return { valid: false, message: '开始日期不能早于今天' };
  }
  
  // 结束日期不能早于开始日期
  if (endDate <= startDate) {
    return { valid: false, message: '结束日期必须晚于开始日期' };
  }
  
  // 寄养时长不能超过30天
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays > 30) {
    return { valid: false, message: '寄养时长不能超过30天' };
  }
  
  return { valid: true };
};

// 获取订单状态的中文显示
export const getOrderStatusText = (status: OrderStatus): string => {
  const statusMap = {
    [OrderStatus.PENDING]: '待确认',
    [OrderStatus.CONFIRMED]: '已确认',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELLED]: '已取消'
  };
  
  return statusMap[status] || status;
};

// 获取订单状态的样式类
export const getOrderStatusClass = (status: OrderStatus): string => {
  const classMap = {
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.CONFIRMED]: 'bg-green-100 text-green-800',
    [OrderStatus.COMPLETED]: 'bg-blue-100 text-blue-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800'
  };
  
  return classMap[status] || 'bg-gray-100 text-gray-800';
};

// 计算订单天数
export const calculateOrderDays = (startDate: Date, endDate: Date): number => {
  const diffTime = endDate.getTime() - startDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};