// Home模块的服务层逻辑
import { homeApi } from '../api/homeApi';
import { FosterService } from '@/types';

// 服务特点类型
export interface ServiceFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// 用户评价类型
export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  content: string;
  rating: number;
}

export const homeService = {
  // 获取推荐寄养服务
  async getFeaturedFosters(): Promise<FosterService[]> {
    try {
      const data = await homeApi.getFeaturedFosters();
      // 可以在这里添加数据处理逻辑
      return data;
    } catch (error) {
      console.error('获取推荐寄养服务失败:', error);
      throw error;
    }
  },

  // 获取服务特点
  async getServiceFeatures(): Promise<ServiceFeature[]> {
    try {
      const data = await homeApi.getServiceFeatures();
      return data;
    } catch (error) {
      console.error('获取服务特点失败:', error);
      throw error;
    }
  },

  // 获取用户评价
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const data = await homeApi.getTestimonials();
      return data;
    } catch (error) {
      console.error('获取用户评价失败:', error);
      throw error;
    }
  },

  // 获取评分最高的寄养服务
  async getTopRatedFosters(limit: number = 3): Promise<FosterService[]> {
    try {
      const allFosters = await this.getFeaturedFosters();
      return [...allFosters]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
    } catch (error) {
      console.error('获取评分最高的寄养服务失败:', error);
      throw error;
    }
  }
};