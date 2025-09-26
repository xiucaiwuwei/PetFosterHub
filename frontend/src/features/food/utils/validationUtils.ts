/**
 * 商品相关的验证和格式化工具函数
 */

/**
 * 格式化价格显示
 * @param price 价格数值
 * @returns 格式化后的价格字符串
 */
export const formatPrice = (price: number): string => {
  return `¥${price.toFixed(2)}`;
};

/**
 * 验证商品数量
 * @param quantity 数量
 * @returns 验证结果对象
 */
export const validateQuantity = (quantity: number): { isValid: boolean; message?: string } => {
  if (!Number.isInteger(quantity) || quantity < 1) {
    return { isValid: false, message: '数量必须是大于0的整数' };
  }
  return { isValid: true };
};

/**
 * 验证商品ID
 * @param productId 商品ID
 * @returns 验证结果对象
 */
export const validateProductId = (productId: string): { isValid: boolean; message?: string } => {
  if (!productId || typeof productId !== 'string' || productId.trim() === '') {
    return { isValid: false, message: '商品ID不能为空' };
  }
  // 可以根据实际的商品ID格式添加更多验证逻辑
  return { isValid: true };
};

/**
 * 计算折后价格
 * @param originalPrice 原价
 * @param discount 折扣率 (百分比)
 * @returns 折后价格
 */
export const calculateDiscountedPrice = (originalPrice: number, discount: number): number => {
  if (discount < 0 || discount > 100) {
    return originalPrice;
  }
  return originalPrice * (1 - discount / 100);
};

/**
 * 验证价格范围
 * @param minPrice 最低价格
 * @param maxPrice 最高价格
 * @returns 验证结果对象
 */
export const validatePriceRange = (minPrice?: number, maxPrice?: number): { isValid: boolean; message?: string } => {
  if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
    return { isValid: false, message: '最低价格必须是大于等于0的数字' };
  }
  
  if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
    return { isValid: false, message: '最高价格必须是大于等于0的数字' };
  }
  
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    return { isValid: false, message: '最低价格不能大于最高价格' };
  }
  
  return { isValid: true };
};