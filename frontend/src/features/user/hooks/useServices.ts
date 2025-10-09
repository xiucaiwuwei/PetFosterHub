/**
 * 用于管理寄养服务数据的自定义hook
 */
import { useState, useCallback } from 'react';
import { FosterService } from '@/types';
import { toast } from 'sonner';

interface UseServicesReturn {
  services: FosterService[];
  isLoading: boolean;
  isCreatingService: boolean;
  createService: (serviceData: Omit<FosterService, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'rating' | 'reviewsCount' | 'isAvailable'>, providerId: string) => Promise<void>;
  fetchServicesByProvider: (providerId: string) => Promise<void>;
}

/**
 * 用于管理寄养服务数据的自定义hook
 */
export const useServices = (): UseServicesReturn => {
  const [services, setServices] = useState<FosterService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingService, setIsCreatingService] = useState(false);

  /**
   * 获取服务商的服务列表
   */
  const fetchServicesByProvider = useCallback(async (providerId: string) => {
    setIsLoading(true);
    try {
      // 实际项目中这里应该调用API
      // 目前返回模拟数据
      const mockServices: FosterService[] = [
        {
          id: `s${Math.floor(Math.random() * 1000)}`,
          providerId: providerId,
          providerName: '宠物乐园',
          providerAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee',
          providerType: 'store',
          title: '专业宠物寄养服务',
          description: '为您的爱宠提供舒适的寄养环境和专业的照顾',
          pricePerDay: 200,
          currency: 'CNY',
          location: '北京市海淀区',
          availableFrom: new Date(),
          availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          petTypes: ['dog', 'cat'],
          maxPets: 5,
          images: ['https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee'],
          amenities: ['24小时监控', '定时遛狗', '专业护理'],
          rating: 4.8,
          reviewsCount: 120,
          isAvailable: true
        },
        {
          id: `s${Math.floor(Math.random() * 1000)}`,
          providerId: providerId,
          providerName: '爱宠之家',
          providerAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee',
          providerType: 'individual',
          title: '高级宠物照顾服务',
          description: '提供专业的宠物照顾、训练和健康检查',
          pricePerDay: 350,
          currency: 'CNY',
          location: '北京市朝阳区',
          availableFrom: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          availableTo: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          petTypes: ['dog'],
          maxPets: 3,
          images: ['https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee'],
          amenities: ['单独房间', '专业训练', '健康检查'],
          rating: 4.9,
          reviewsCount: 85,
          isAvailable: true
        }
      ];
      setServices(mockServices);
    } catch (error) {
      console.error('获取服务列表失败:', error);
      toast.error('获取服务列表失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 创建新的寄养服务
   */
  const createService = useCallback(async (
    serviceData: Omit<FosterService, 'id' | 'providerId' | 'providerName' | 'providerAvatar' | 'rating' | 'reviewsCount' | 'isAvailable'>,
    providerId: string
  ): Promise<void> => {
    // 简单表单验证
    if (!serviceData.title || !serviceData.description || !serviceData.pricePerDay || !serviceData.location) {
      toast.error('请填写必填字段');
      throw new Error('请填写必填字段');
    }

    setIsCreatingService(true);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 创建新服务对象 - 明确类型断言确保TypeScript正确识别
      const newService = {
        ...serviceData,
        id: `s${Math.floor(Math.random() * 1000)}`,
        providerId,
        providerName: '未知提供者', // 实际项目中应该从用户信息获取
        providerAvatar: '', // 实际项目中应该从用户信息获取
        rating: 0,
        reviewsCount: 0,
        isAvailable: true
      } as FosterService;
      
      // 添加到服务列表
      setServices(prevServices => [...prevServices, newService]);
      toast.success('服务创建成功！');
    } catch (error) {
      console.error('创建服务失败:', error);
      toast.error('创建服务失败，请重试');
      throw error;
    } finally {
      setIsCreatingService(false);
    }
  }, []);

  return {
    services,
    isLoading,
    isCreatingService,
    createService,
    fetchServicesByProvider
  };
};