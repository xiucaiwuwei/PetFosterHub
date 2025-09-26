/**
 * 商品基本信息响应DTO - 用于列表展示
 */
export interface ProductBasicDto {
  /** 商品ID */
  id: string;
  /** 商品名称 */
  name: string;
  /** 商品主图URL */
  imageUrl: string;
  /** 商品价格 */
  price: number;
  /** 商品折扣 (百分比) */
  discount?: number;
  /** 商品评分 */
  rating: number;
  /** 评价数量 */
  reviewsCount: number;
  /** 简短描述 */
  shortDescription: string;
  /** 是否新品 */
  isNew?: boolean;
  /** 是否热销 */
  isPopular?: boolean;
  /** 商品分类 */
  category: string;
}

/**
 * 商品详情响应DTO - 用于详情页展示
 */
export interface ProductDetailDto extends ProductBasicDto {
  /** 详细描述 */
  description: string;
  /** 品牌 */
  brand: string;
  /** 重量 */
  weight: string;
  /** 库存数量 */
  inventory: number;
  /** 商品图片列表 */
  images?: string[];
  /** 主要成分 */
  ingredients?: string[];
  /** 营养成分信息 */
  nutritionalInfo?: string;
  /** 适用年龄 */
  suitableFor?: string;
  /** 生产日期 */
  manufactureDate?: string;
  /** 保质期 */
  shelfLife?: string;
  /** 产地 */
  origin?: string;
}

/**
 * 商品列表分页响应DTO
 */
export interface PaginatedProductResponseDto {
  /** 商品列表 */
  products: ProductBasicDto[];
  /** 总条数 */
  totalCount: number;
  /** 当前页码 */
  currentPage: number;
  /** 每页显示数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}