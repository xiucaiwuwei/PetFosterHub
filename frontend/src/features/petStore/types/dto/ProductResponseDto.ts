import type { ProductCategory } from '../enums/ProductCategory';

// 规格参数接口
export interface ProductSpecification {
  name: string;
  value: string;
}

// 商品响应DTO
export interface ProductResponseDto {
  id: string;
  name: string;
  description: string;
  detailDescription: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  mainImage: string;
  secondaryImages?: string[];
  category: ProductCategory;
  specifications?: ProductSpecification[];
  isNew: boolean;
  isBestseller: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

// 商品列表响应DTO
export interface ProductListResponseDto {
  items: ProductResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

// 购物车商品DTO
export interface CartItemResponseDto {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  quantity: number;
  addedAt: string;
}

// 订单响应DTO
export interface OrderResponseDto {
  id: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}