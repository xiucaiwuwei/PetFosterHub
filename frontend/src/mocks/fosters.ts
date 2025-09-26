import { FosterService } from '@/types';

// 生成模拟日期
const today = new Date();
const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);
const nextMonth = new Date();
nextMonth.setDate(today.getDate() + 30);

// 模拟寄养服务数据
 export const fosterServices: FosterService[] = [
  {
    id: 'f1',
    providerId: 'u1',
    providerName: '张明',
    providerAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137',
    title: '温馨家庭式宠物寄养',
    description: '我是一名退休教师，家里有宽敞的院子，非常喜欢小动物。可以提供全天候照顾，每天会带宠物散步两次。有10年养宠经验，可提供宠物基本医疗护理。',
    pricePerDay: 80,
    currency: 'CNY',
    location: '北京市朝阳区',
    availableFrom: today,
    availableTo: nextMonth,
    petTypes: ['dog', 'cat'],
    maxPets: 2,
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=%E5%AE%BD%E6%95%9E%E7%9A%84%E5%AE%A0%E7%89%A9%E6%B4%BB%E5%8A%A8%E7%A9%BA%E9%97%B4%EF%BC%8C%E6%9C%89%E7%8E%A9%E5%85%B7%E5%92%8C%E8%88%92%E9%80%82%E7%9A%84%E5%BA%8A&sign=86edc1d2177be6350bf03b991a7aa48b',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=%E5%B8%A6%E5%9B%B4%E6%A0%8F%E7%9A%84%E5%B0%8F%E9%99%A2%E5%AD%90%EF%BC%8C%E9%80%82%E5%90%88%E5%AE%A0%E7%89%A9%E6%B4%BB%E5%8A%A8&sign=56ff9cace8b30d409d8f176adc02f085'
    ],
    amenities: ['每日散步', '定时喂食', '梳毛服务', '实时照片反馈'],
    rating: 4.8,
    reviewsCount: 24,
    isAvailable: true,
    providerType: 'individual' // 个体提供者
  },
  {
    id: 'f2',
    providerId: 'u2',
    providerName: '李华',
    providerAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%B9%B4%E8%BD%BB%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%BC%80%E6%9C%97%E7%AC%91%E5%AE%B9%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=8dc301c48f3190d00930598ba3ff11f3',
    title: '专业宠物酒店式寄养',
    description: '专业宠物护理师，拥有宠物护理资格证书。提供酒店式寄养服务，独立宠物套房，24小时监控。可提供宠物美容、训练等附加服务。',
    pricePerDay: 120,
    currency: 'CNY',
    location: '上海市静安区',
    availableFrom: today,
    availableTo: nextMonth,
    petTypes: ['dog', 'cat', 'other'],
    maxPets: 5,
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=%E5%AE%A0%E7%89%A9%E9%85%92%E5%BA%97%E5%A5%97%E6%88%BF%EF%BC%8C%E5%B9%B2%E5%87%80%E6%95%B4%E6%B4%81%EF%BC%8C%E6%9C%89%E7%8B%AC%E7%AB%8B%E7%A9%BA%E9%97%B4&sign=26b01ed50cd00e76b71b53898a1270fd',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=%E5%AE%A0%E7%89%A9%E6%B8%B8%E4%B9%90%E5%8C%BA%EF%BC%8C%E6%9C%89%E5%90%84%E7%A7%8D%E7%8E%A9%E5%85%B7%E5%92%8C%E8%AE%BE%E6%96%BD&sign=c1a059c10220c90aef3acdc3b31b087e'
    ],
    amenities: ['24小时监控', '专业护理', '宠物美容', '训练服务'],
    rating: 4.9,
    reviewsCount: 37,
    isAvailable: true,
    providerType: 'store' // 店铺提供者
  },
  {
    id: 'f3',
    providerId: 'u3',
    providerName: '王芳',
    providerAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E5%A5%B3%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E6%B8%A9%E6%9F%94%E6%B0%94%E8%B4%A8%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=a499604ce8edcd1a07b0b26633c885e7',
    title: '猫咪专属寄养服务',
    description: '猫咪爱好者，专注于猫咪寄养服务。家中无其他宠物，环境安静，有专门的猫咪活动区域和各种猫咪玩具。可提供猫咪行为训练指导。',
    pricePerDay: 60,
    currency: 'CNY',
    location: '广州市天河区',
    availableFrom: today,
    availableTo: nextWeek,
    petTypes: ['cat'],
    maxPets: 3,
    images: [
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=%E7%8C%AB%E5%92%AA%E6%B4%BB%E5%8A%A8%E5%8C%BA%EF%BC%8C%E6%9C%89%E7%8C%AB%E7%88%AC%E6%9E%B6%E5%92%8C%E5%90%84%E7%A7%8D%E7%8E%A9%E5%85%B7&sign=c0d199197d0d3f9c0eb07e80f5d59530',
      'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=%E7%8C%AB%E5%92%AA%E4%BC%91%E6%81%AF%E5%8C%BA%EF%BC%8C%E8%88%92%E9%80%82%E7%9A%84%E7%8C%AB%E7%AA%9D%E5%92%8C%E5%9E%AB%E5%AD%90&sign=f0d87689f23b2d991e541ac1c4e41968'
    ],
    amenities: ['猫咪专属', '安静环境', '每日玩耍时间', '健康监测'],
    rating: 4.7,
    reviewsCount: 19,
    isAvailable: true,
    providerType: 'individual' // 个体提供者
  }
];

// 获取所有寄养服务
export const getFosterServices = (): FosterService[] => {
  return fosterServices;
};

// 根据ID获取寄养服务
export const getFosterServiceById = (id: string): FosterService | undefined => {
  return fosterServices.find(service => service.id === id);
};

// 搜索寄养服务
 export const searchFosterServices = (searchTerm: string, petType?: string, providerType?: string): FosterService[] => {
  return fosterServices.filter(service => {
    const matchesSearchTerm = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             service.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPetType = petType ? service.petTypes.includes(petType as 'dog' | 'cat' | 'other') : true;
    
    const matchesProviderType = providerType ? service.providerType === providerType : true;
    
    return matchesSearchTerm && matchesPetType && matchesProviderType && service.isAvailable;
  });
};