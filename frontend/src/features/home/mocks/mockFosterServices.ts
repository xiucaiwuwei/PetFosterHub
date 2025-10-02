import type { FosterService } from '../types';

// 寄养服务模拟数据
export const mockFosterServices: FosterService[] = [
  {
    id: 'mock-1',
    providerId: 'provider-1',
    providerName: '宠物乐园',
    providerAvatar: 'https://picsum.photos/id/237/100/100',
    providerType: 'store',
    title: '豪华宠物寄养服务',
    description: '为您的爱宠提供五星级的寄养体验，全天候看护，定期户外活动，专业护理。',
    pricePerDay: 120,
    currency: 'CNY',
    location: '北京市朝阳区建国路88号',
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    petTypes: ['dog', 'cat'],
    maxPets: 5,
    images: [
      'https://picsum.photos/id/169/800/600',
      'https://picsum.photos/id/1025/800/600',
      'https://picsum.photos/id/1062/800/600'
    ],
    amenities: ['24小时看护', '每日户外活动', '专业美容', '健康监测'],
    rating: 4.9,
    reviewsCount: 156,
    isAvailable: true,
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-2',
    providerId: 'provider-2',
    providerName: '宠物之家',
    providerAvatar: 'https://picsum.photos/id/238/100/100',
    providerType: 'individual',
    title: '温馨家庭式寄养',
    description: '像家人一样对待您的宠物，提供舒适的居家环境，让您的爱宠感受家的温暖。',
    pricePerDay: 80,
    currency: 'CNY',
    location: '上海市浦东新区张江高科技园区',
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    petTypes: ['dog', 'cat', 'other'],
    maxPets: 3,
    images: [
      'https://picsum.photos/id/1062/800/600',
      'https://picsum.photos/id/1074/800/600',
      'https://picsum.photos/id/1025/800/600'
    ],
    amenities: ['家庭环境', '定时喂食', '遛弯服务', '互动陪伴'],
    rating: 4.8,
    reviewsCount: 89,
    isAvailable: true,
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-3',
    providerId: 'provider-3',
    providerName: '快乐宠物会所',
    providerAvatar: 'https://picsum.photos/id/239/100/100',
    providerType: 'store',
    title: '专业犬类寄养训练',
    description: '不仅提供寄养服务，还可以进行基础训练，让您的爱犬在寄养期间也能得到成长。',
    pricePerDay: 150,
    currency: 'CNY',
    location: '广州市天河区天河路385号',
    availableFrom: new Date().toISOString(),
    availableTo: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    petTypes: ['dog'],
    maxPets: 8,
    images: [
      'https://picsum.photos/id/1025/800/600',
      'https://picsum.photos/id/1074/800/600',
      'https://picsum.photos/id/169/800/600'
    ],
    amenities: ['专业训练', '定时遛弯', '健康检查', '营养餐饮'],
    rating: 4.7,
    reviewsCount: 124,
    isAvailable: true,
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];