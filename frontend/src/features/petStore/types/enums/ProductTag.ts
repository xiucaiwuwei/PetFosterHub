// 商品标签枚举
export enum ProductTag {
  // 新品标签
  NEW_ARRIVAL = 'NEW_ARRIVAL',
  
  // 热销标签
  BEST_SELLER = 'BEST_SELLER',
  
  // 促销标签
  DISCOUNT = 'DISCOUNT',
  
  // 环保标签
  ECO_FRIENDLY = 'ECO_FRIENDLY',
  
  // 高端标签
  PREMIUM = 'PREMIUM'
}

// 获取标签显示名称
export const getTagDisplayName = (tag: ProductTag): string => {
  const displayNames: Record<ProductTag, string> = {
    [ProductTag.NEW_ARRIVAL]: '新品',
    [ProductTag.BEST_SELLER]: '热销',
    [ProductTag.DISCOUNT]: '促销',
    [ProductTag.ECO_FRIENDLY]: '环保',
    [ProductTag.PREMIUM]: '高端'
  };
  
  return displayNames[tag] || tag;
};

// 获取标签颜色
export const getTagColor = (tag: ProductTag): string => {
  const colors: Record<ProductTag, string> = {
    [ProductTag.NEW_ARRIVAL]: 'blue',
    [ProductTag.BEST_SELLER]: 'red',
    [ProductTag.DISCOUNT]: 'orange',
    [ProductTag.ECO_FRIENDLY]: 'green',
    [ProductTag.PREMIUM]: 'purple'
  };
  
  return colors[tag] || 'gray';
};