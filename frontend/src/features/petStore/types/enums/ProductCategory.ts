// 商品分类枚举
export enum ProductCategory {
  // 宠物食品
  DRY_FOOD = 'DRY_FOOD',
  WET_FOOD = 'WET_FOOD',
  TREATS = 'TREATS',
  
  // 宠物用品
  TOYS = 'TOYS',
  CARE = 'CARE',
  ACCESSORIES = 'ACCESSORIES',
  
  // 其他分类
  OTHER = 'OTHER'
}

// 获取分类显示名称
export const getCategoryDisplayName = (category: ProductCategory): string => {
  const displayNames: Record<ProductCategory, string> = {
    [ProductCategory.DRY_FOOD]: '干粮',
    [ProductCategory.WET_FOOD]: '湿粮',
    [ProductCategory.TREATS]: '零食',
    [ProductCategory.TOYS]: '玩具',
    [ProductCategory.CARE]: '护理用品',
    [ProductCategory.ACCESSORIES]: '配件',
    [ProductCategory.OTHER]: '其他'
  };
  
  return displayNames[category] || category;
};