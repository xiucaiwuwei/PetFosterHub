import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import type { PetProduct } from '@/features/petStore/types';
import type { ProductCategory } from '@/features/petStore/types/enums/ProductCategory';
import type { ProductSortOption } from '@/features/petStore/types';
import type { ProductTag } from '@/features/petStore/types/enums/ProductTag';

// 模拟产品数据
const mockProducts: PetProduct[] = [
  {
    id: '1',
    name: '高级宠物干粮 - 鸡肉味',
    description: '富含蛋白质的高品质宠物干粮，适合所有年龄段的犬猫食用。',
    detailDescription: '采用优质鸡肉为主要原料，添加多种维生素和矿物质，有助于宠物健康成长。不含人工添加剂和防腐剂。',
    price: 89.99,
    originalPrice: 109.99,
    discount: 8.2,
    stock: 150,
    mainImage: 'https://via.placeholder.com/300x300?text=宠物干粮+鸡肉',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=鸡肉干粮1',
      'https://via.placeholder.com/300x300?text=鸡肉干粮2',
    ],
    category: 'DRY_FOOD',
    specifications: [
      { name: '适用年龄', value: '全年龄段' },
      { name: '口味', value: '鸡肉味' },
      { name: '重量', value: '5kg' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 245,
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-05-10'),
  },
  {
    id: '2',
    name: '宠物玩具 - 互动智能球',
    description: '可以自动滚动并发出声音的智能玩具，能有效缓解宠物的孤独感。',
    detailDescription: '内置感应器的智能玩具球，能根据宠物的动作自动改变滚动方向，吸引宠物注意力。适合独处时的宠物玩耍。',
    price: 129.99,
    originalPrice: 149.99,
    discount: 8.6,
    stock: 80,
    mainImage: 'https://via.placeholder.com/300x300?text=智能玩具球',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=玩具球1',
      'https://via.placeholder.com/300x300?text=玩具球2',
    ],
    category: 'TOYS',
    specifications: [
      { name: '材质', value: '安全塑料' },
      { name: '颜色', value: '蓝色' },
      { name: '适用宠物', value: '中小型犬猫' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.5,
    reviewCount: 67,
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2023-06-15'),
  },
  {
    id: '3',
    name: '宠物香波 - 天然草本配方',
    description: '温和无刺激的宠物专用香波，含有天然草本成分，保护宠物皮肤健康。',
    detailDescription: '采用燕麦和芦荟提取物，温和清洁宠物毛发，同时滋润皮肤，减少皮屑。pH值平衡，适合各种肤质。',
    price: 59.99,
    originalPrice: 79.99,
    discount: 7.5,
    stock: 200,
    mainImage: 'https://via.placeholder.com/300x300?text=宠物香波',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=香波1',
      'https://via.placeholder.com/300x300?text=香波2',
    ],
    category: 'CARE',
    specifications: [
      { name: '容量', value: '500ml' },
      { name: '配方', value: '天然草本' },
      { name: '适用宠物', value: '犬猫通用' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.7,
    reviewCount: 189,
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-04-20'),
  },
  {
    id: '4',
    name: '宠物牵引绳 - 舒适防爆冲',
    description: '采用高强度材料制作的牵引绳，舒适手柄设计，有效防止宠物暴冲。',
    detailDescription: '尼龙编织材质，坚固耐用，舒适泡沫手柄减少手部疲劳。自动伸缩设计，方便控制宠物活动范围。',
    price: 79.99,
    originalPrice: 99.99,
    discount: 8.0,
    stock: 120,
    mainImage: 'https://via.placeholder.com/300x300?text=宠物牵引绳',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=牵引绳1',
      'https://via.placeholder.com/300x300?text=牵引绳2',
    ],
    category: 'ACCESSORIES',
    specifications: [
      { name: '长度', value: '5米' },
      { name: '颜色', value: '黑色' },
      { name: '适用犬种', value: '中大型犬' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.3,
    reviewCount: 56,
    createdAt: new Date('2023-07-02'),
    updatedAt: new Date('2023-07-02'),
  },
  {
    id: '5',
    name: '宠物罐头 - 牛肉味湿粮',
    description: '营养丰富的宠物罐头，精选牛肉为原料，增加宠物食欲。',
    detailDescription: '含有90%的肉类成分，添加多种维生素和矿物质，满足宠物日常营养需求。不添加人工色素和防腐剂。',
    price: 39.99,
    originalPrice: 49.99,
    discount: 8.0,
    stock: 180,
    mainImage: 'https://via.placeholder.com/300x300?text=宠物罐头',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=罐头1',
      'https://via.placeholder.com/300x300?text=罐头2',
    ],
    category: 'WET_FOOD',
    specifications: [
      { name: '口味', value: '牛肉' },
      { name: '规格', value: '170g*6罐' },
      { name: '适用宠物', value: '犬猫通用' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.6,
    reviewCount: 212,
    createdAt: new Date('2023-03-12'),
    updatedAt: new Date('2023-03-12'),
  },
  {
    id: '6',
    name: '宠物零食 - 鸡肉干',
    description: '高蛋白低脂肪的鸡肉干，健康美味，适合训练奖励。',
    detailDescription: '100%纯鸡肉制作，不添加防腐剂和人工添加剂。低温干燥工艺保留营养成分，口感酥脆。',
    price: 29.99,
    originalPrice: 39.99,
    discount: 7.5,
    stock: 250,
    mainImage: 'https://via.placeholder.com/300x300?text=鸡肉干',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=零食1',
      'https://via.placeholder.com/300x300?text=零食2',
    ],
    category: 'TREATS',
    specifications: [
      { name: '口味', value: '原味' },
      { name: '重量', value: '100g' },
      { name: '保质期', value: '12个月' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 345,
    createdAt: new Date('2023-02-28'),
    updatedAt: new Date('2023-02-28'),
  },
  {
    id: '7',
    name: '宠物窝垫 - 四季通用',
    description: '柔软舒适的宠物窝垫，可拆洗设计，四季都适合使用。',
    detailDescription: '采用高弹性海绵填充，表面是舒适的短毛绒面料。底部有防滑设计，可拆卸清洗，方便卫生。',
    price: 159.99,
    originalPrice: 199.99,
    discount: 8.0,
    stock: 60,
    mainImage: 'https://via.placeholder.com/300x300?text=宠物窝垫',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=窝垫1',
      'https://via.placeholder.com/300x300?text=窝垫2',
    ],
    category: 'ACCESSORIES',
    specifications: [
      { name: '尺寸', value: '70x60cm' },
      { name: '颜色', value: '灰色' },
      { name: '材质', value: '短毛绒+海绵' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.4,
    reviewCount: 45,
    createdAt: new Date('2023-07-20'),
    updatedAt: new Date('2023-07-20'),
  },
  {
    id: '8',
    name: '宠物指甲剪 - 安全防断',
    description: '专业宠物指甲剪，人体工学设计，安全剪口防止指甲断裂。',
    detailDescription: '不锈钢刀刃，锋利耐用。有LED灯辅助，可清楚看到血线位置，避免剪伤宠物。适合各种宠物使用。',
    price: 49.99,
    originalPrice: 59.99,
    discount: 8.3,
    stock: 100,
    mainImage: 'https://via.placeholder.com/300x300?text=指甲剪',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=指甲剪1',
      'https://via.placeholder.com/300x300?text=指甲剪2',
    ],
    category: 'CARE',
    specifications: [
      { name: '材质', value: '不锈钢+ABS' },
      { name: '适用宠物', value: '犬猫通用' },
      { name: '尺寸', value: '14x5cm' },
    ],
    isNew: false,
    isBestseller: true,
    rating: 4.5,
    reviewCount: 98,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15'),
  },
  {
    id: '9',
    name: '宠物饮水机 - 自动循环过滤',
    description: '自动循环过滤的宠物饮水机，让宠物随时喝到新鲜干净的水。',
    detailDescription: '内置活性炭过滤系统，去除水中杂质和异味。自动循环设计增加宠物饮水兴趣，保持水分充足。',
    price: 199.99,
    originalPrice: 249.99,
    discount: 8.0,
    stock: 45,
    mainImage: 'https://via.placeholder.com/300x300?text=饮水机',
    secondaryImages: [
      'https://via.placeholder.com/300x300?text=饮水机1',
      'https://via.placeholder.com/300x300?text=饮水机2',
    ],
    category: 'ACCESSORIES',
    specifications: [
      { name: '容量', value: '2L' },
      { name: '颜色', value: '白色' },
      { name: '功能', value: '过滤+循环' },
    ],
    isNew: true,
    isBestseller: false,
    rating: 4.2,
    reviewCount: 34,
    createdAt: new Date('2023-08-05'),
    updatedAt: new Date('2023-08-05'),
  },
];

interface UseProductListParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  category?: ProductCategory;
  sortBy?: ProductSortOption;
  tags?: ProductTag[];
}

interface UseProductListReturn {
  products: PetProduct[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useProductList = (params: UseProductListParams): UseProductListReturn => {
  const [allProducts, setAllProducts] = useState<PetProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // 根据标签筛选产品
  const products = useMemo(() => {
    if (!params.tags || params.tags.length === 0) {
      return allProducts;
    }

    return allProducts.filter(product => {
      // 根据标签进行筛选
      const productTags: ProductTag[] = [];
      
      if (product.isNew) productTags.push(ProductTag.NEW_ARRIVAL);
      if (product.isBestseller) productTags.push(ProductTag.BEST_SELLER);
      if (product.discount && product.discount > 0) productTags.push(ProductTag.DISCOUNT);
      // 这里可以添加更多标签的判断逻辑
      
      // 检查是否包含至少一个所选标签
      return params.tags?.some(tag => productTags.includes(tag)) || false;
    });
  }, [allProducts, params.tags]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 注意：当前后端API可能不支持标签筛选，所以这里只传递基本参数
        // 实际项目中可以根据后端API支持情况调整
        const response = await productService.getProducts({
          page: params.page,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          category: params.category,
          sortBy: params.sortBy
        });
        setAllProducts(response.items || []);
        // 如果有标签筛选，使用筛选后的总数，否则使用原始总数
        setTotal(params.tags && params.tags.length > 0 
          ? products.length 
          : response.total || 0);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        // 使用模拟数据，确保页面能正常显示
        console.log('Using mock data instead');
        
        // 根据参数筛选模拟数据
        let filteredMockProducts = [...mockProducts];
        
        // 按分类筛选
        if (params.category && params.category !== 'all') {
          filteredMockProducts = filteredMockProducts.filter(
            product => product.category === params.category
          );
        }
        
        // 按搜索词筛选
        if (params.searchTerm) {
          const searchLower = params.searchTerm.toLowerCase();
          filteredMockProducts = filteredMockProducts.filter(
            product => 
              product.name.toLowerCase().includes(searchLower) ||
              product.description.toLowerCase().includes(searchLower)
          );
        }
        
        // 按排序选项排序
        if (params.sortBy === 'PRICE_LOW_TO_HIGH') {
          filteredMockProducts.sort((a, b) => a.price - b.price);
        } else if (params.sortBy === 'PRICE_HIGH_TO_LOW') {
          filteredMockProducts.sort((a, b) => b.price - a.price);
        } else if (params.sortBy === 'BEST_SELLING') {
          filteredMockProducts.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        } else if (params.sortBy === 'NEWEST') {
          filteredMockProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        
        // 分页处理
        const startIndex = (params.page - 1) * params.pageSize;
        const paginatedProducts = filteredMockProducts.slice(
          startIndex,
          startIndex + params.pageSize
        );
        
        setAllProducts(paginatedProducts);
        setTotal(filteredMockProducts.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.page, params.pageSize, params.searchTerm, params.category, params.sortBy, params.tags]);

  return {
    products,
    loading,
    error,
    total
  };
};