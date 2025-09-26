/**
 * 管理模块的验证工具函数
 */

/**
 * 格式化日期显示
 * @param date 日期对象
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 格式化日期时间显示
 * @param date 日期对象
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * 验证用户数据
 * @param user 用户数据对象
 * @returns 验证结果对象，包含是否有效和错误信息
 */
export const validateUser = (user: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!user.name || user.name.trim() === '') {
    errors.push('用户名不能为空');
  }
  
  if (!user.email || user.email.trim() === '') {
    errors.push('邮箱不能为空');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push('邮箱格式不正确');
  }
  
  if (user.phone && !/^1[3-9]\d{9}$/.test(user.phone)) {
    errors.push('手机号码格式不正确');
  }
  
  if (user.rating && (user.rating < 0 || user.rating > 5)) {
    errors.push('评分必须在0-5之间');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 验证订单数据
 * @param order 订单数据对象
 * @returns 验证结果对象，包含是否有效和错误信息
 */
export const validateOrder = (order: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!order.id || order.id.trim() === '') {
    errors.push('订单ID不能为空');
  }
  
  if (!order.fosterServiceId || order.fosterServiceId.trim() === '') {
    errors.push('服务ID不能为空');
  }
  
  if (!order.petId || order.petId.trim() === '') {
    errors.push('宠物ID不能为空');
  }
  
  const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'paid', 'shipped'];
  if (order.status && !validStatuses.includes(order.status)) {
    errors.push('订单状态无效');
  }
  
  if (order.amount && (typeof order.amount !== 'number' || order.amount < 0)) {
    errors.push('订单金额必须为正数');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};