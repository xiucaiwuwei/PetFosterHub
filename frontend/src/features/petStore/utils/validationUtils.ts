// 商品相关的验证工具函数

/**
 * 验证商品名称
 * @param name 商品名称
 * @returns 验证结果对象 { valid: boolean, message?: string }
 */
export const validateProductName = (name: string): { valid: boolean; message?: string } => {
  if (!name || name.trim().length === 0) {
    return { valid: false, message: '商品名称不能为空' };
  }
  if (name.trim().length < 2) {
    return { valid: false, message: '商品名称至少需要2个字符' };
  }
  if (name.trim().length > 100) {
    return { valid: false, message: '商品名称不能超过100个字符' };
  }
  return { valid: true };
};

/**
 * 验证商品价格
 * @param price 商品价格
 * @returns 验证结果对象 { valid: boolean, message?: string }
 */
export const validateProductPrice = (price: number): { valid: boolean; message?: string } => {
  if (price === undefined || price === null) {
    return { valid: false, message: '商品价格不能为空' };
  }
  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, message: '商品价格必须是数字' };
  }
  if (price <= 0) {
    return { valid: false, message: '商品价格必须大于0' };
  }
  if (price > 999999) {
    return { valid: false, message: '商品价格不能超过999999' };
  }
  return { valid: true };
};

/**
 * 验证商品库存
 * @param stock 商品库存
 * @returns 验证结果对象 { valid: boolean, message?: string }
 */
export const validateProductStock = (stock: number): { valid: boolean; message?: string } => {
  if (stock === undefined || stock === null) {
    return { valid: false, message: '商品库存不能为空' };
  }
  if (typeof stock !== 'number' || isNaN(stock)) {
    return { valid: false, message: '商品库存必须是数字' };
  }
  if (stock < 0) {
    return { valid: false, message: '商品库存不能为负数' };
  }
  if (stock > 999999) {
    return { valid: false, message: '商品库存不能超过999999' };
  }
  return { valid: true };
};

/**
 * 验证购买数量
 * @param quantity 购买数量
 * @param stock 当前库存
 * @returns 验证结果对象 { valid: boolean, message?: string }
 */
export const validatePurchaseQuantity = (
  quantity: number,
  stock: number
): { valid: boolean; message?: string } => {
  if (quantity === undefined || quantity === null) {
    return { valid: false, message: '购买数量不能为空' };
  }
  if (typeof quantity !== 'number' || isNaN(quantity)) {
    return { valid: false, message: '购买数量必须是数字' };
  }
  if (!Number.isInteger(quantity)) {
    return { valid: false, message: '购买数量必须是整数' };
  }
  if (quantity <= 0) {
    return { valid: false, message: '购买数量必须大于0' };
  }
  if (quantity > 100) {
    return { valid: false, message: '单次购买数量不能超过100' };
  }
  if (quantity > stock) {
    return { valid: false, message: `购买数量不能超过库存(${stock})` };
  }
  return { valid: true };
};

/**
 * 验证图片URL
 * @param url 图片URL
 * @returns 验证结果对象 { valid: boolean, message?: string }
 */
export const validateImageUrl = (url: string): { valid: boolean; message?: string } => {
  if (!url || url.trim().length === 0) {
    return { valid: false, message: '图片URL不能为空' };
  }
  
  // 简单的URL格式验证
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
  if (!urlPattern.test(url)) {
    return { valid: false, message: '图片URL格式不正确' };
  }
  
  // 验证图片格式
  const imageExtensionPattern = /\.(jpeg|jpg|gif|png|webp)$/i;
  if (!imageExtensionPattern.test(url)) {
    return { valid: false, message: '只支持JPG、JPEG、GIF、PNG、WebP格式的图片' };
  }
  
  return { valid: true };
};