// 宠物商品类型定义
export interface PetProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  discount: number;
  imageUrl: string;
  shortDescription: string;
  description: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isPopular?: boolean;
  inventory: number;
  brand: string;
  weight?: string;
  materials?: string[];
  suitableFor: string[];
}

// 宠物分类类型定义
export interface PetCategory {
  id: string;
  name: string;
}

// 生成模拟宠物商品数据
export const petProducts: PetProduct[] = [
  // 宠物食品
  {
    id: 'p1',
    name: '优质鸡肉味狗粮',
    category: 'food',
    price: 89.00,
    discount: 10,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8B%97%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E9%A6%99%E8%82%B2%E9%B8%A1%E8%82%89%E5%91%B3%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=a6839a541b7556bf16f7cfd99e564e00',
    shortDescription: '富含蛋白质，促进肌肉发育，适合各年龄段狗狗',
    description: '这款优质鸡肉味狗粮采用新鲜鸡肉为主要原料，富含高品质蛋白质，有助于狗狗肌肉发育和维持健康体态。特别添加Omega-3和Omega-6脂肪酸，促进皮肤健康和毛发亮泽。',
    rating: 4.7,
    reviewsCount: 128,
    isPopular: true,
    inventory: 56,
    brand: '宠优',
    weight: '2kg',
    suitableFor: ['dog']
  },
  {
    id: 'p2',
    name: '三文鱼味天然猫粮',
    category: 'food',
    price: 98.00,
    discount: 5,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8C%AB%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E9%A3%9F%E7%89%A9%E4%B8%89%E9%B1%BC%E5%91%B3%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=335cbf9742e74c34cfa91428758e2c2a',
    shortDescription: '富含Omega-3脂肪酸，促进猫咪毛发健康亮泽',
    description: '这款三文鱼味天然猫粮采用野生三文鱼为主要原料，富含Omega-3脂肪酸，有助于促进猫咪皮肤健康和毛发亮泽。添加牛磺酸，支持心脏和眼睛健康。',
    rating: 4.8,
    reviewsCount: 156,
    isPopular: true,
    inventory: 42,
    brand: '喵鲜',
    weight: '1.8kg',
    suitableFor: ['cat']
  },
  
  // 宠物玩具
  {
    id: 'p3',
    name: '耐咬橡胶狗玩具',
    category: 'toys',
    price: 39.90,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8B%97%E7%8E%A9%E5%85%B7%EF%BC%8C%E8%80%90%E5%92%8C%E6%A9%A1%E8%83%B6%E5%99%A8%EF%BC%8C%E5%A4%9A%E5%BD%A9%E8%89%B2&sign=a8c4cc960a265c099f5fcac27931c08b',
    shortDescription: '坚固耐咬，内置发声装置激发狗狗兴趣',
    description: '这款耐咬橡胶狗玩具采用天然无毒橡胶制成，适合各种咬合力强的狗狗。内置发声装置，能激发狗狗的玩耍兴趣，帮助减轻焦虑和破坏行为。',
    rating: 4.6,
    reviewsCount: 98,
    inventory: 76,
    brand: '宠物乐',
    materials: ['天然橡胶'],
    suitableFor: ['dog']
  },
  {
    id: 'p4',
    name: '羽毛逗猫棒',
    category: 'toys',
    price: 25.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8C%AB%E7%8E%A9%E5%85%B7%EF%BC%8C%E7%BE%BD%E6%AF%9B%E9%80%97%E7%8C%AB%E6%A3%92%EF%BC%8C%E5%A4%9A%E5%BD%A9%E8%89%B2&sign=7d855756ed530c131592d8c090afcc79',
    shortDescription: '互动逗猫玩具，激发猫咪捕猎本能',
    description: '这款羽毛逗猫棒是与猫咪互动的理想玩具，羽毛设计能激发猫咪的捕猎本能，增加活动量。弹性杆设计，方便挥舞，让猫咪尽情玩耍。',
    rating: 4.8,
    reviewsCount: 215,
    isPopular: true,
    inventory: 120,
    brand: '喵趣',
    materials: ['羽毛', '塑料', '弹性钢丝'],
    suitableFor: ['cat']
  },
  
  // 宠物服饰
  {
    id: 'p5',
    name: '狗狗保暖羽绒服',
    category: 'clothing',
    price: 129.00,
    discount: 15,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8B%97%E7%89%A9%E6%9C%8D%E9%A5%B0%EF%BC%8C%E4%BF%9D%E6%9A%96%E7%BE%BD%E7%BB%92%E6%9C%8D%EF%BC%8C%E7%BA%A2%E8%89%B2&sign=81aee73f3d92f26280c377d7ee270cf4',
    shortDescription: '轻盈保暖，防水面料，适合冬季外出',
    description: '这款狗狗羽绒服采用高品质羽绒填充，轻盈保暖，不会给狗狗带来负担。外层防水面料，适合雨雪天气。魔术贴设计，穿脱方便，多种尺码可选。',
    rating: 4.5,
    reviewsCount: 76,
    inventory: 32,
    brand: '宠暖',
    suitableFor: ['dog']
  },
  {
    id: 'p6',
    name: '猫咪可爱水手服',
    category: 'clothing',
    price: 69.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8C%AB%E7%89%A9%E6%9C%8D%E9%A5%B0%EF%BC%8C%E5%8F%AF%E7%88%B1%E6%B水手服%EF%BC%8C%E7%99%BD%E8%89%B2%E9%BB%91%E6%96%9C&sign=1f2e3d4c5b6a7890f1e2d3c4b5a6f789',
    shortDescription: '可爱水手风格，舒适透气面料',
    description: '这款猫咪水手服采用可爱的水手风格设计，让您的猫咪更加萌趣。优质棉面料，柔软透气，不会刺激猫咪皮肤。弹性设计，不影响猫咪活动。',
    rating: 4.7,
    reviewsCount: 103,
    isNew: true,
    inventory: 45,
    brand: '喵星人',
    suitableFor: ['cat']
  },
  
  // 宠物用品
  {
    id: 'p7',
    name: '自动宠物饮水机',
    category: 'supplies',
    price: 159.00,
    discount: 10,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E8%87%AA%E5%8A%A8%E5%AE%A0%E7%89%A9%E9%9B%A8%E6%B0%B4%E6%9C%BA%EF%BC%8C%E9%AB%98%E7%BA%A7%E9%9B%B6%E9%94%80%E6%B0%B4%E6%9C%BA&sign=9ea803bcb787dc5a774c7c357fc1c54b',
    shortDescription: '过滤循环系统，保持水质新鲜',
    description: '这款自动宠物饮水机采用多层过滤系统，有效去除杂质和异味，保持水质新鲜。循环流动设计，吸引宠物多喝水。低噪音运行，不打扰生活。',
    rating: 4.6,
    reviewsCount: 89,
    inventory: 28,
    brand: '宠物智家',
    suitableFor: ['dog', 'cat', 'small-pet']
  },
  {
    id: 'p8',
    name: '折叠宠物航空箱',
    category: 'supplies',
    price: 239.00,
    discount: 5,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E6%8A%98%E5%8F%A0%E5%AE%A0%E7%89%A9%E8%88%AA%E7%A9%BA%E7%AE%B1%EF%BC%8C%E9%AB%98%E5%AE%89%E5%85%A8%E6%80%A7&sign=ff2f702f68a6d67a171af0fb835ee151',
    shortDescription: '轻便折叠设计，符合航空运输标准',
    description: '这款折叠宠物航空箱采用高强度塑料制成，坚固耐用，符合国际航空运输标准。折叠设计，不使用时可节省存储空间。通风孔设计，保证空气流通。',
    rating: 4.7,
    reviewsCount: 64,
    inventory: 19,
    brand: '旅行宠',
    suitableFor: ['dog', 'cat']
  },
  
  // 健康护理
  {
    id: 'p9',
    name: '宠物指甲剪套装',
    category: 'health',
    price: 45.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%AE%A0%E7%89%A9%E6%8C%87%E7%94%B2%E5%89%AA%E5%A5%97%E8%A3%85%EF%BC%8C%E5%A4%9A%E5%85%83%E5%B7%A5%E5%85%B7&sign=f025deaeaba2f8c64fda4a7322788f48',
    shortDescription: '安全指甲剪+锉刀，防止过度修剪',
    description: '这款宠物指甲剪套装包含安全指甲剪和锉刀，专为宠物设计，防止过度修剪伤及血管。防滑手柄，使用更安全。适合各种体型宠物使用。',
    rating: 4.8,
    reviewsCount: 156,
    isPopular: true,
    inventory: 89,
    brand: '宠护',
    suitableFor: ['dog', 'cat', 'small-pet']
  },
  {
    id: 'p10',
    name: '宠物口腔清洁套装',
    category: 'health',
    price: 89.00,
    discount: 15,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%AE%A0%E7%89%A9%E5%8F%A3%E8%85%94%E6%B8%85%E6%B4%81%E5%A5%97%E8%A3%85%EF%BC%8C%E7%89%99%E5%89%8A%E3%80%81%E5%8F%A3%E6%B7%BB%E6%B6%88%E5%89%82&sign=d8d6c195d881a3c2d9f85033c4cef0b6',
    shortDescription: '牙膏牙刷套装，预防牙结石和口臭',
    description: '这款宠物口腔清洁套装包含可食用牙膏和专用牙刷，有效去除牙菌斑，预防牙结石和口臭。牙膏有鸡肉口味，让宠物不抗拒刷牙。',
    rating: 4.5,
    reviewsCount: 73,
    inventory: 42,
    brand: '洁牙乐',
    suitableFor: ['dog', 'cat']
  }
];

// 获取所有宠物商品
export const getPetProducts = (): PetProduct[] => {
  return [...petProducts];
};

// 根据搜索条件和分类筛选宠物商品
export const searchPetProducts = (searchTerm: string, category: string): PetProduct[] => {
  return petProducts.filter(product => {
    const matchesSearchTerm = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === '' || category === 'all' || product.category === category;
    
    return matchesSearchTerm && matchesCategory;
  });
};

// 根据ID获取宠物商品
export const getPetProductById = (id: string): PetProduct | undefined => {
  return petProducts.find(product => product.id === id);
};