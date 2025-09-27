import type { ProductCategory } from '../enums/ProductCategory';
import type { ProductSortOption } from '@/features/petStore/types';

// 获取商品列表请求DTO
export interface GetProductsRequestDto {
  page: number;
  pageSize: number;
  searchTerm?: string;
  category?: ProductCategory;
  sortBy?: ProductSortOption;
}

// 添加到购物车请求DTO
export interface AddToCartRequestDto {
  productId: string;
  quantity: number;
}

// 创建订单请求DTO
export interface CreateOrderRequestDto {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  addressId?: string;
  paymentMethod?: string;
}

// 检查库存请求DTO
export interface CheckStockRequestDto {
  productId: string;
  quantity: number;
}