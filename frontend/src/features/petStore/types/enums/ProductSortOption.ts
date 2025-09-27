// 商品排序选项枚举
export enum ProductSortOption {
  // 按价格从低到高排序
  PRICE_LOW_TO_HIGH = 'PRICE_LOW_TO_HIGH',
  
  // 按价格从高到低排序
  PRICE_HIGH_TO_LOW = 'PRICE_HIGH_TO_LOW',
  
  // 按最新上架排序
  NEWEST = 'NEWEST',
  
  // 按销量排序
  BEST_SELLING = 'BEST_SELLING',
  
  // 按评分排序
  TOP_RATED = 'TOP_RATED'
}

// 获取排序选项显示名称
export const getSortOptionDisplayName = (sortOption: ProductSortOption): string => {
  const displayNames: Record<ProductSortOption, string> = {
    [ProductSortOption.PRICE_LOW_TO_HIGH]: '价格从低到高',
    [ProductSortOption.PRICE_HIGH_TO_LOW]: '价格从高到低',
    [ProductSortOption.NEWEST]: '最新上架',
    [ProductSortOption.BEST_SELLING]: '销量优先',
    [ProductSortOption.TOP_RATED]: '评分最高'
  };
  
  return displayNames[sortOption] || sortOption;
};