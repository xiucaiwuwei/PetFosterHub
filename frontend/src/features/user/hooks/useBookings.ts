/**
 * 用于管理预订数据的自定义hook
 */
import { useState, useEffect, useCallback } from 'react';
import { Booking, FosterService } from '@/types';
import { getBookingsByOwnerId } from '@/mocks/bookings';
import { toast } from 'sonner';

interface UseBookingsReturn {
  bookings: Booking[];
  isLoading: boolean;
  searchService: (serviceId: string) => Promise<FosterService | null>;
  refreshBookings: (userId: string) => Promise<void>;
}

/**
 * 用于管理预订数据的自定义hook
 */
export const useBookings = (userId: string | null = null): UseBookingsReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 获取用户的预订列表
   */
  const fetchBookings = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    try {
      // 实际项目中这里应该调用API
      const userBookings = getBookingsByOwnerId(id);
      setBookings(userBookings);
    } catch (error) {
      console.error('获取预订列表失败:', error);
      toast.error('获取预订列表失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 刷新预订列表
   */
  const refreshBookings = useCallback(async (id: string) => {
    await fetchBookings(id);
  }, [fetchBookings]);

  /**
   * 搜索服务信息
   */
  const searchService = useCallback(async (serviceId: string): Promise<FosterService | null> => {
    try {
      // 实际项目中这里应该调用API
      // 目前返回模拟数据
      const mockService: FosterService = {
        id: serviceId,
        providerId: 'f1',
        providerName: '爱心寄养中心',
        providerAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E4%B8%AD%E5%B9%B4%E7%94%B7%E6%80%A7%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8F%8B%E5%A5%BD%E5%BE%AE%E7%AC%91%EF%BC%8C%E4%BA%9A%E6%B4%B2%E4%BA%BA&sign=d7506ee6b5f86c7cbbe326c898f85137',
        providerType: 'store',
        title: `宠物寄养服务 ${serviceId}`,
        description: '专业的宠物寄养服务，让您的宠物在您外出时得到妥善照顾',
        pricePerDay: Math.floor(Math.random() * 500) + 100,
        currency: 'CNY',
        location: '北京市朝阳区',
        availableFrom: new Date(),
        availableTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        petTypes: ['dog', 'cat'],
        maxPets: 5,
        images: ['https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=%E5%8A%A8%E7%89%A9%E5%A4%B4%E5%83%8F%EF%BC%8C%E5%8A%A8%E7%89%A9%E7%85%A7%E7%89%87&sign=4916b0c9017e427c2555127ae824f4ee'],
        amenities: ['专业照顾', '定时喂食', '日常遛弯'],
        rating: 4.8,
        reviewsCount: 128,
        isAvailable: true
      };
      return mockService;
    } catch (error) {
      console.error('搜索服务失败:', error);
      toast.error('搜索服务失败');
      return null;
    }
  }, []);

  // 当用户ID变化时，重新获取预订列表
  useEffect(() => {
    if (userId) {
      fetchBookings(userId);
    }
  }, [userId, fetchBookings]);

  return {
    bookings,
    isLoading,
    searchService,
    refreshBookings
  };
};