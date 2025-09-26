// 寄养服务相关的工具函数

/**
 * 格式化价格显示
 * @param price 价格
 * @param currency 货币类型
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number, currency: string = 'CNY'): string => {
  const formattedPrice = new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
  
  if (currency === 'CNY') {
    return `¥${formattedPrice}`;
  }
  
  return `${formattedPrice} ${currency}`;
};

/**
 * 格式化日期显示
 * @param date 日期对象或日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * 计算两个日期之间的天数
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 天数
 */
export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 1;
};

/**
 * 格式化评分显示
 * @param rating 评分值
 * @returns 格式化后的评分字符串
 */
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

/**
 * 生成唯一的临时ID
 * @returns 唯一ID字符串
 */
export const generateTempId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * 验证日期范围是否有效
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 是否有效
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();
  
  // 移除时间部分，只比较日期
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  // 开始日期必须大于等于今天
  // 结束日期必须大于等于开始日期
  return start >= today && end >= start;
};