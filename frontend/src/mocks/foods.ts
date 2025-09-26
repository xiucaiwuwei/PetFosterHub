// 食品商品类型定义
export interface FoodProduct {
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
  weight: string;
  ingredients: string[];
  nutritionalInfo: string;
}

// 食品分类类型定义
export interface FoodCategory {
  id: string;
  name: string;
}

// 生成模拟食品商品数据
export const foodProducts: FoodProduct[] = [
  // 狗狗食品
  {
    id: 'f1',
    name: '优质鸡肉味狗粮',
    category: 'dog',
    price: 89.00,
    discount: 10,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8B%97%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E9%A6%99%E8%82%B2%E9%B8%A1%E8%82%89%E5%91%B3%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=a6839a541b7556bf16f7cfd99e564e00',
    shortDescription: '富含蛋白质，促进肌肉发育，适合各年龄段狗狗',
    description: '这款优质鸡肉味狗粮采用新鲜鸡肉为主要原料，富含高品质蛋白质，有助于狗狗肌肉发育和维持健康体态。特别添加Omega-3和Omega-6脂肪酸，促进皮肤健康和毛发亮泽。不添加人工色素、香精和防腐剂，让您的爱犬吃得健康又安心。',
    rating: 4.7,
    reviewsCount: 128,
    isPopular: true,
    inventory: 56,
    brand: '宠优',
    weight: '2kg',
    ingredients: ['新鲜鸡肉', '糙米', '燕麦', '蔬菜', '水果', '鱼油'],
    nutritionalInfo: '蛋白质≥28%，脂肪≥12%，粗纤维≤5%，水分≤10%'
  },
  {
    id: 'f2',
    name: '天然无谷幼犬粮',
    category: 'dog',
    price: 128.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8B%97%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E5%A4%A9%E7%84%B6%E6%97%A0%E8%B0%B7%E5%8C%96%E5%85%B7%E7%B2%AE%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=79138b6896ab884652c019a4ca59b922',
    shortDescription: '无谷物配方，适合敏感肠胃幼犬，促进消化吸收',
    description: '专为幼犬设计的天然无谷配方狗粮，不含小麦、玉米等常见过敏原，减少肠胃不适风险。添加益生菌和益生元，促进消化系统健康，增强免疫力。富含DHA和ARA，有助于幼犬大脑和视力发育。小颗粒设计，适合幼犬咀嚼和消化。',
    rating: 4.8,
    reviewsCount: 96,
    isNew: true,
    inventory: 32,
    brand: '天然优选',
    weight: '1.5kg',
    ingredients: ['去骨鸡肉', '甜薯', '豌豆', '亚麻籽', '胡萝卜', '蓝莓'],
    nutritionalInfo: '蛋白质≥30%，脂肪≥15%，粗纤维≤4%，水分≤10%'
  },
  {
    id: 'f3',
    name: '大型犬专用成犬粮',
    category: 'dog',
    price: 158.00,
    discount: 15,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8B%97%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E5%A4%A7%E5%9E%8B%E7%8B%97%E4%B8%93%E7%94%A8%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=edfc7fa10571d88e3d5a6fa6f5214d95',
    shortDescription: '关节保护配方，减轻关节负担，适合金毛、拉布拉多等大型犬',
    description: '这款大型犬专用成犬粮特别添加葡萄糖胺和软骨素，有助于保护大型犬的关节健康，减轻关节负担。均衡的钙磷比例，有助于维持骨骼健康。优质蛋白质和适量脂肪，帮助维持理想体重，避免大型犬因过重导致的健康问题。添加天然膳食纤维，促进消化系统健康。',
    rating: 4.6,
    reviewsCount: 74,
    inventory: 28,
    brand: '大型犬专家',
    weight: '3kg',
    ingredients: ['牛肉', '糙米', '燕麦', '葡萄糖胺', '软骨素', '蔬菜'],
    nutritionalInfo: '蛋白质≥26%，脂肪≥10%，粗纤维≤5%，水分≤10%'
  },
  
  // 猫咪食品
  {
    id: 'f4',
    name: '三文鱼味天然猫粮',
    category: 'cat',
    price: 98.00,
    discount: 5,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8C%AB%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E9%A3%9F%E7%89%A9%E4%B8%89%E9%B1%BC%E5%91%B3%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=335cbf9742e74c34cfa91428758e2c2a',
    shortDescription: '富含Omega-3脂肪酸，促进猫咪毛发健康亮泽',
    description: '这款三文鱼味天然猫粮采用野生三文鱼为主要原料，富含Omega-3脂肪酸，有助于促进猫咪皮肤健康和毛发亮泽。添加牛磺酸，支持心脏和眼睛健康。均衡的蛋白质和脂肪比例，帮助猫咪维持理想体重。天然膳食纤维，促进消化系统健康。',
    rating: 4.8,
    reviewsCount: 156,
    isPopular: true,
    inventory: 42,
    brand: '喵鲜',
    weight: '1.8kg',
    ingredients: ['三文鱼', '鸡肉粉', '糙米', '蔬菜', '鱼油', '牛磺酸'],
    nutritionalInfo: '蛋白质≥32%，脂肪≥18%，粗纤维≤4%，水分≤10%'
  },
  {
    id: 'f5',
    name: '去毛球配方猫粮',
    category: 'cat',
    price: 108.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E7%8C%AB%E7%B2%AE%E7%B1%BB%E5%93%81%EF%BC%8C%E5%8E%BB%E6%AF%9B%E7%90%83%E9%85%8D%E6%96%B9%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=0e271180f6fe94deffd24a426c249e3b',
    shortDescription: '特殊纤维配方，帮助排除毛球，促进消化系统健康',
    description: '这款去毛球配方猫粮特别添加天然膳食纤维，帮助猫咪温和排除体内毛球，减少毛球形成和吐毛问题。优质蛋白质来源，有助于维持肌肉质量。添加维生素和矿物质，支持整体健康。适合所有年龄段的猫咪，尤其适合长毛猫和容易产生毛球的猫咪。',
    rating: 4.5,
    reviewsCount: 92,
    inventory: 36,
    brand: '喵想',
    weight: '2kg',
    ingredients: ['鸡肉', '糙米', '燕麦', '甜菜渣', '纤维素', '鱼油'],
    nutritionalInfo: '蛋白质≥30%，脂肪≥15%，粗纤维≤7%，水分≤10%'
  },
  
  // 小宠食品
  {
    id: 'f6',
    name: '仓鼠营养混合粮',
    category: 'small-pet',
    price: 35.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B0%8F%E5%AE%A0%E9%A3%9F%E5%93%81%EF%BC%8C%E4%BB%99%E9%BC%A0%E7%BB%84%E5%90%88%E7%B2%AE%EF%BC%8C%E5%A4%9A%E7%A7%8D%E8%8D%AF%E7%89%A9%E6%B7%B7%E5%90%88&sign=d06506a3d316eb124b84169aa3e228af',
    shortDescription: '多种谷物和种子混合，满足仓鼠营养需求',
    description: '这款仓鼠营养混合粮包含多种谷物、种子、坚果和蔬菜，提供仓鼠所需的全面营养。特别添加钙质和维生素，有助于骨骼健康和牙齿生长。天然配方，无人工添加剂，促进仓鼠健康成长。适合各种仓鼠品种，如金丝熊、三线仓鼠等。',
    rating: 4.6,
    reviewsCount: 48,
    inventory: 63,
    brand: '小宠乐园',
    weight: '500g',
    ingredients: ['燕麦', '小米', '玉米', '瓜子', '花生', '蔬菜干'],
    nutritionalInfo: '蛋白质≥16%，脂肪≥8%，粗纤维≤12%，水分≤12%'
  },
  
  // 鸟类食品
  {
    id: 'f7',
    name: '鹦鹉混合种子粮',
    category: 'bird',
    price: 45.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E9%B8%9F%E7%B1%BB%E9%A3%9F%E5%93%81%EF%BC%8C%E9%B9%A6%E9%B8%9F%E6%B7%B7%E5%90%88%E7%A7%8D%E5%AD%90%E7%B2%AE%EF%BC%8C%E5%A4%9A%E7%A7%8D%E8%8D%AF%E7%89%A9%E6%B7%B7%E5%90%88&sign=da9443fa3de9c04137acd3aa5323a325',
    shortDescription: '多种种子混合，满足鹦鹉营养需求，促进羽毛健康',
    description: '这款鹦鹉混合种子粮包含多种优质种子，如向日葵籽、燕麦、小米等，提供鹦鹉所需的全面营养。特别添加矿物质和维生素，有助于促进羽毛健康亮泽。适合各种鹦鹉品种，如虎皮鹦鹉、玄凤鹦鹉、金刚鹦鹉等。',
    rating: 4.5,
    reviewsCount: 36,
    inventory: 42,
    brand: '鸟语花香',
    weight: '800g',
    ingredients: ['向日葵籽', '燕麦', '小米', '麻子', '高粱', '矿物质'],
    nutritionalInfo: '蛋白质≥14%，脂肪≥20%，粗纤维≤10%，水分≤12%'
  },
  
  // 鱼类食品
  {
    id: 'f8',
    name: '热带鱼专用颗粒饲料',
    category: 'fish',
    price: 28.00,
    discount: 0,
    imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E9%B1%BC%E7%B1%BB%E9%A3%9F%E5%93%81%EF%BC%8C%E7%83%AD%E5%B8%A6%E9%B1%BC%E7%B2%98%E7%B2%98%E9%A3%9F%E6%96%99%EF%BC%8C%E9%AB%98%E8%B4%A8%E8%B4%A8%E9%87%91%E5%85%89%E7%85%A7%E7%89%87&sign=e67f0a18299008c5aa055c99fa8030a0',
    shortDescription: '均衡营养配方，促进热带鱼色彩鲜艳，健康成长',
    description: '这款热带鱼专用颗粒饲料采用优质鱼粉为主要原料，富含蛋白质和多种维生素，促进热带鱼健康成长和色彩鲜艳。缓慢下沉配方，适合不同水层的鱼类食用。不污染水质，易于消化吸收。适合各种热带鱼，如孔雀鱼、红绿灯、神仙鱼等。',
    rating: 4.7,
    reviewsCount: 52,
    isNew: true,
    inventory: 78,
    brand: '水族世界',
    weight: '100g',
    ingredients: ['鱼粉', '虾粉', '豆粕', '螺旋藻', '维生素', '矿物质'],
    nutritionalInfo: '蛋白质≥40%，脂肪≥6%，粗纤维≤3%，水分≤8%'
  }
];

// 获取所有食品商品
export const getFoodProducts = (): FoodProduct[] => {
  return [...foodProducts];
};

// 根据搜索条件和分类筛选食品商品
export const searchFoodProducts = (searchTerm: string, category: string): FoodProduct[] => {
  return foodProducts.filter(product => {
    const matchesSearchTerm = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === '' || category === 'all' || product.category === category;
    
    return matchesSearchTerm && matchesCategory;
  });
};

// 根据ID获取食品商品
export const getFoodProductById = (id: string): FoodProduct | undefined => {
  return foodProducts.find(product => product.id === id);
};
