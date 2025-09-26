/**
 * 宠物商品分类实体类型
 */
export interface PetCategory {
  /** 分类ID */
  id: string;
  /** 分类名称 */
  name: string;
  /** 分类图标 (可选) */
  icon?: string;
  /** 父分类ID (可选) */
  parentId?: string;
  /** 排序 (可选) */
  sortOrder?: number;
  /** 是否热门分类 (可选) */
  isPopular?: boolean;
}