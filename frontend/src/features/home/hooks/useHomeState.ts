// Home模块的状态访问hooks
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { FosterService } from '@/types';
import { ServiceFeature, Testimonial } from '../services/homeService';

// 获取home模块的所有状态
export const useHomeState = () => {
  const homeState = useSelector((state: RootState) => state.home);
  return homeState;
};

// 获取推荐寄养服务列表
export const useFeaturedFosters = (): FosterService[] => {
  return useSelector((state: RootState) => state.home.featuredFosters);
};

// 获取服务特点列表
export const useServiceFeatures = (): ServiceFeature[] => {
  return useSelector((state: RootState) => state.home.serviceFeatures);
};

// 获取用户评价列表
export const useTestimonials = (): Testimonial[] => {
  return useSelector((state: RootState) => state.home.testimonials);
};

// 获取加载状态
export const useHomeLoading = (): boolean => {
  return useSelector((state: RootState) => state.home.loading);
};

// 获取错误信息
export const useHomeError = (): string | null => {
  return useSelector((state: RootState) => state.home.error);
};

// 获取评分最高的寄养服务
export const useTopRatedFosters = (limit: number = 3): FosterService[] => {
  const fosters = useFeaturedFosters();
  return [...fosters]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};