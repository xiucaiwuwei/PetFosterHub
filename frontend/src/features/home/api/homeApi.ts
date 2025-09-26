// Home模块的API接口定义
import axios from 'axios';

const API_URL = '/api/home';

export const homeApi = {
  // 获取推荐寄养服务
  getFeaturedFosters: async () => {
    try {
      const response = await axios.get(`${API_URL}/featured-fosters`);
      return response.data;
    } catch (error) {
      console.error('获取推荐寄养服务失败:', error);
      // 降级为mock数据
      return getFeaturedFostersMock();
    }
  },

  // 获取服务特点
  getServiceFeatures: async () => {
    try {
      const response = await axios.get(`${API_URL}/service-features`);
      return response.data;
    } catch (error) {
      console.error('获取服务特点失败:', error);
      // 降级为mock数据
      return getServiceFeaturesMock();
    }
  },

  // 获取用户评价
  getTestimonials: async () => {
    try {
      const response = await axios.get(`${API_URL}/testimonials`);
      return response.data;
    } catch (error) {
      console.error('获取用户评价失败:', error);
      // 降级为mock数据
      return getTestimonialsMock();
    }
  }
};

// Mock数据
const getFeaturedFostersMock = () => {
  return [
    {
      id: '1',
      title: '温馨家庭式狗狗寄养',
      description: '提供专业的狗狗照顾服务，有丰富经验，提供每日遛狗、玩耍和精心照料。',
      price: 80,
      currency: '元',
      rating: 4.9,
      reviewsCount: 128,
      images: [
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%E5%BF%AB%E4%B9%90%E7%9A%84%E7%8B%97%E5%9C%A8%E5%AE%B6%E4%B8%AD%E7%8E%A9%E8%80%8D&sign=66292f96746f24cf8ea5c008b06a9422'
      ],
      providerName: '李小姐',
      providerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      location: '北京市朝阳区',
      petTypes: ['dog']
    },
    {
      id: '2',
      title: '猫咪专业寄养服务',
      description: '为猫咪提供安静舒适的环境，每日定时喂食、清理猫砂，提供玩耍和互动时间。',
      price: 60,
      currency: '元',
      rating: 4.8,
      reviewsCount: 95,
      images: [
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%E5%AE%B6%E5%BA%AD%E7%8C%AB%E7%8E%A9%E8%80%8D&sign=0329f0a3d53f33fe3b8e1c58f381f3a5'
      ],
      providerName: '王先生',
      providerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      location: '上海市静安区',
      petTypes: ['cat']
    },
    {
      id: '3',
      title: '多宠物综合寄养',
      description: '可以同时照顾狗狗和猫咪，提供个性化的照顾方案，有专业的宠物护理知识。',
      price: 90,
      currency: '元',
      rating: 4.7,
      reviewsCount: 76,
      images: [
        'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=%E7%8C%AB%E5%92%8C%E7%8B%97%E5%9C%A8%E4%B8%80%E8%B5%B7%E7%8E%A9%E8%80%8D&sign=f44520432e0a584fc32e46e810f38d24'
      ],
      providerName: '张女士',
      providerAvatar: 'https://randomuser.me/api/portraits/women/67.jpg',
      location: '广州市天河区',
      petTypes: ['dog', 'cat']
    }
  ];
};

const getServiceFeaturesMock = () => {
  return [
    {
      id: '1',
      title: '家庭式寄养',
      description: '不同于冰冷的宠物酒店，我们的寄养提供者提供温馨的家庭环境，让您的宠物感受家的温暖。',
      icon: 'home'
    },
    {
      id: '2',
      title: '严格筛选寄养者',
      description: '所有寄养提供者都经过严格筛选和背景调查，确保您的宠物得到专业、负责任的照顾。',
      icon: 'user-check'
    },
    {
      id: '3',
      title: '实时查看宠物状态',
      description: '寄养期间，您可以通过我们的平台接收宠物的照片和视频，随时了解爱宠的情况。',
      icon: 'video'
    }
  ];
};

const getTestimonialsMock = () => {
  return [
    {
      id: '1',
      name: '陈先生',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      content: '服务非常好，寄养者对我家狗狗照顾得很周到，每天都会发照片和视频，让我很放心。',
      rating: 5
    },
    {
      id: '2',
      name: '林女士',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      content: '猫咪寄养回来状态很好，看起来比在家还开心！寄养者很专业，会考虑再次使用。',
      rating: 5
    },
    {
      id: '3',
      name: '张先生',
      avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
      content: '平台操作简单，寄养者响应及时，价格合理，是出行时宠物照顾的理想选择。',
      rating: 4
    }
  ];
};