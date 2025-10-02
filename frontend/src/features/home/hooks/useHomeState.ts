// Home模块的自定义state hooks
import {useSelector} from 'react-redux';
import {RootState} from '@/app/store/store';
import type {FosterService, Testimonial} from '../types';
import type {FosterServiceItem} from '@/features/foster/types/dto/FosterServiceDTO';
import {convertToFosterServiceItems} from '../types/fosterServiceConverter';

// 获取home模块的所有状态
export const useHomeState = () => {
    return useSelector((state: RootState) => state.home);
};

// 获取推荐寄养服务列表
export const useFeaturedFosters = (): FosterService[] => {
  return useSelector((state: RootState) => state.home.featuredFosters);
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

// 获取评分最高的寄养服务(转换为列表项格式)
export const useTopRatedFosterItems = (limit: number = 3): FosterServiceItem[] => {
  const topRatedFosters = useTopRatedFosters(limit);
  return convertToFosterServiceItems(topRatedFosters);
};