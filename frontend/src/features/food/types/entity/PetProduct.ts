/**
 * 宠物商品实体类型
 */
export interface PetProduct {
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