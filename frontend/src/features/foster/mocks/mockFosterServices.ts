/**
 * 模拟寄养服务数据
 */
import type { FosterServiceItem, FosterServiceDetail } from '../types/dto';
import { FosterServiceStatus } from '../types/enums';

// 生成随机ID
const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// 生成随机日期
const generateRandomDate = (): string => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return randomDate.toISOString();
};

// 模拟寄养服务列表数据
export const mockFosterServices: FosterServiceItem[] = [
  {
    id: generateId('service'),
    title: '温馨家庭宠物寄养服务',
    description: '为您的爱宠提供如家般的照顾，包含日常喂食、遛弯、玩耍等服务。',
    price: 88.00,
    discountPrice: 78.00,
    images: ['https://picsum.photos/seed/pet1/800/600'],
    location: '上海市静安区南京西路123号',
    rating: 4.8,
    reviewCount: 128,
    tags: ['家庭寄养', '猫咪友好', '狗狗友好'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '专业宠物酒店式寄养',
    description: '提供专业的宠物酒店服务，独立房间，24小时专人看护，定期清洁消毒。',
    price: 128.00,
    discountPrice: 108.00,
    images: ['https://picsum.photos/seed/pet2/800/600'],
    location: '北京市朝阳区建国路88号',
    rating: 4.9,
    reviewCount: 96,
    tags: ['酒店式', '24小时看护', '独立房间'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '猫咪专属寄养服务',
    description: '猫咪专用寄养环境，安静舒适，每日梳毛，定时玩耍互动，让猫咪远离焦虑。',
    price: 68.00,
    images: ['https://picsum.photos/seed/cat1/800/600'],
    location: '广州市天河区天河路385号',
    rating: 4.7,
    reviewCount: 85,
    tags: ['猫咪专属', '安静环境', '每日梳毛'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '狗狗活力寄养服务',
    description: '为狗狗提供大量户外活动空间，每日多次遛弯，专业训练师陪伴玩耍。',
    price: 98.00,
    discountPrice: 88.00,
    images: ['https://picsum.photos/seed/dog1/800/600'],
    location: '深圳市南山区科技园南区',
    rating: 4.6,
    reviewCount: 78,
    tags: ['狗狗专属', '户外活动', '专业训练'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '小型宠物特殊寄养',
    description: '为仓鼠、兔子、鸟类等小型宠物提供专业寄养服务，根据不同宠物提供专属照料。',
    price: 48.00,
    images: ['https://picsum.photos/seed/small1/800/600'],
    location: '成都市锦江区春熙路99号',
    rating: 4.5,
    reviewCount: 63,
    tags: ['小型宠物', '特殊照料', '专业服务'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '生病宠物特殊护理',
    description: '为生病或术后恢复的宠物提供专业护理服务，包含药物管理、特殊饮食等。',
    price: 168.00,
    discountPrice: 148.00,
    images: ['https://picsum.photos/seed/ill1/800/600'],
    location: '武汉市江汉区解放大道125号',
    rating: 4.9,
    reviewCount: 42,
    tags: ['特殊护理', '术后恢复', '药物管理'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '豪华宠物套房寄养',
    description: '豪华宠物套房，独立卫浴，高端床品，提供个性化服务，让您的爱宠享受尊贵体验。',
    price: 198.00,
    images: ['https://picsum.photos/seed/luxury1/800/600'],
    location: '杭州市西湖区西湖大道56号',
    rating: 4.9,
    reviewCount: 35,
    tags: ['豪华套房', '高端服务', '个性化'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '短期临时宠物寄养',
    description: '提供24小时到3天的短期临时寄养服务，适合短途出差或临时有事的宠物主人。',
    price: 58.00,
    discountPrice: 48.00,
    images: ['https://picsum.photos/seed/temp1/800/600'],
    location: '重庆市渝中区解放碑23号',
    rating: 4.6,
    reviewCount: 58,
    tags: ['短期寄养', '临时服务', '灵活时间'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '多宠物家庭寄养',
    description: '专为多宠物家庭设计的寄养服务，可同时照顾多只宠物，保持它们的生活习惯。',
    price: 158.00,
    images: ['https://picsum.photos/seed/multi1/800/600'],
    location: '南京市鼓楼区中山路88号',
    rating: 4.7,
    reviewCount: 46,
    tags: ['多宠物', '家庭寄养', '习惯保持'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  },
  {
    id: generateId('service'),
    title: '宠物行为矫正寄养',
    description: '结合寄养与行为矫正训练，帮助宠物改善不良习惯，提高社交能力。',
    price: 188.00,
    discountPrice: 168.00,
    images: ['https://picsum.photos/seed/train1/800/600'],
    location: '西安市雁塔区大雁塔北广场',
    rating: 4.8,
    reviewCount: 32,
    tags: ['行为矫正', '训练服务', '社交能力'],
    status: FosterServiceStatus.ACTIVE,
    createdAt: generateRandomDate(),
    updatedAt: generateRandomDate()
  }
];

// 根据ID获取寄养服务详情
export const getMockFosterServiceDetail = (id: string): FosterServiceDetail => {
  const baseService = mockFosterServices.find(s => s.id === id) || mockFosterServices[0];
  
  // 生成未来7天的可用时段
  const generateAvailableSlots = () => {
    const slots = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      slots.push({
        date: date.toISOString().split('T')[0],
        morning: Math.random() > 0.2,
        afternoon: Math.random() > 0.2,
        evening: Math.random() > 0.3
      });
    }
    
    return slots;
  };

  return {
    ...baseService,
    providerInfo: {
      id: generateId('provider'),
      name: '宠物乐园服务中心',
      avatar: 'https://picsum.photos/seed/provider/200/200',
      rating: 4.8,
      reviewCount: 325
    },
    details: {
      services: ['日常喂食', '定时遛弯', '梳毛清洁', '玩耍互动', '健康监测'],
      facilities: ['空调环境', '独立空间', '安全围栏', '监控系统', '清洁设备'],
      workingHours: '08:00-22:00',
      holidays: ['春节初一至初三', '国庆节前三天'],
      notice: '请提前一天预约，自带宠物食物和日常用品，提供宠物疫苗接种证明。'
    },
    availableSlots: generateAvailableSlots()
  };
};

// 模拟寄养服务列表响应
export const mockFosterServiceListResponse = {
  list: mockFosterServices,
  total: mockFosterServices.length,
  pageNum: 1,
  pageSize: 10
};