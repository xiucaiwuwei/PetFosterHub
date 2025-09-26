/**
 * 商品排序选项枚举
 */
export enum ProductSortOption {
  /** 价格从低到高 */
  PRICE_ASC = 'priceAsc',
  /** 价格从高到低 */
  PRICE_DESC = 'priceDesc',
  /** 评分从高到低 */
  RATING_DESC = 'ratingDesc',
  /** 最新上架 */
  NEWEST = 'newest',
  /** 默认排序 */
  DEFAULT = 'default'
}