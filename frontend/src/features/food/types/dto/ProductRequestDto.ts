/**
 * 商品请求DTO - 用于搜索和筛选商品
 */
export interface ProductRequestDto {
  /** 搜索关键词 */
  searchTerm?: string;
  /** 分类ID */
  categoryId?: string;
  /** 价格范围最小值 */
  minPrice?: number;
  /** 价格范围最大值 */
  maxPrice?: number;
  /** 是否只显示有货商品 */
  inStock?: boolean;
  /** 排序方式 (priceAsc, priceDesc, ratingDesc, newest) */
  sortBy?: string;
  /** 页码 */
  page?: number;
  /** 每页显示数量 */
  pageSize?: number;
}

/**
 * 添加到购物车请求DTO
 */
export interface AddToCartRequestDto {
  /** 商品ID */
  productId: string;
  /** 购买数量 */
  quantity: number;
  /** 商品选项 (如大小、颜色等) */
  options?: Record<string, string>;
}

/**
 * 商品详情请求DTO
 */
export interface ProductDetailRequestDto {
  /** 商品ID */
  productId: string;
}