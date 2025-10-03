/**
 * 获取寄养服务详情的自定义Hook
 * 从API获取服务详情并转换为组件所需的格式
 */
import { useState, useEffect, useCallback } from 'react';
import fosterService from '../services/fosterService';
import type { FosterServiceDetailRequest, FosterServiceDetailResponse } from '../types/dto';
import type { FosterService } from '@/types';
import { FosterServiceStatus } from '../types/enums';

interface UseFosterDetailReturn {
  fosterDetail: FosterService | null;
  loading: boolean;
  error: string | null;
  refreshFosterDetail: () => void;
}

/**
 * 获取寄养服务详情的自定义Hook
 * @param fosterId 寄养服务ID
 * @returns 转换后的服务详情数据及状态
 */
export const useFosterDetail = (fosterId: string): UseFosterDetailReturn => {
  const [fosterDetail, setFosterDetail] = useState<FosterService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 转换API响应数据为组件所需的格式
  const transformFosterDetail = (apiData: FosterServiceDetailResponse): FosterService => {
    // 从API响应中提取和转换所需数据
    return {
      id: apiData.id,
      providerId: apiData.providerInfo.id,
      providerName: apiData.providerInfo.name,
      providerAvatar: apiData.providerInfo.avatar,
      providerType: 'individual', // 默认为个人提供者
      title: apiData.title,
      description: apiData.description,
      pricePerDay: apiData.price,
      currency: 'CNY',
      location: apiData.location,
      // 从availableSlots中提取最早和最晚可用日期
      availableFrom: apiData.availableSlots.length > 0 
        ? new Date(apiData.availableSlots[0].date) 
        : new Date(),
      availableTo: apiData.availableSlots.length > 0 
        ? new Date(apiData.availableSlots[apiData.availableSlots.length - 1].date) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 默认30天后
      // 从tags和details中提取宠物类型信息
      petTypes: extractPetTypesFromTags(apiData.tags),
      // 默认为合理的最大宠物数量
      maxPets: 3,
      images: apiData.images,
      // 使用details.facilities作为amenities
      amenities: apiData.details.facilities || [],
      rating: apiData.rating,
      reviewsCount: apiData.reviewCount,
      // 基于服务状态判断可用性
      isAvailable: apiData.status === FosterServiceStatus.ACTIVE
    };
  };

  // 从标签中提取宠物类型
  const extractPetTypesFromTags = (tags: string[]): ('dog' | 'cat' | 'other')[] => {
    const petTypes: ('dog' | 'cat' | 'other')[] = [];
    
    // 检查标签中是否包含宠物类型相关词汇
    if (tags.some(tag => tag.includes('狗') || tag.includes('犬'))) {
      petTypes.push('dog');
    }
    if (tags.some(tag => tag.includes('猫'))) {
      petTypes.push('cat');
    }
    if (tags.some(tag => tag.includes('其他') || tag.includes('小型'))) {
      petTypes.push('other');
    }
    
    // 如果没有找到任何宠物类型，默认包含狗和猫
    if (petTypes.length === 0) {
      return ['dog', 'cat'];
    }
    
    return petTypes;
  };

  // 加载寄养服务详情
  const loadFosterDetail = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params: FosterServiceDetailRequest = { id };
      const apiData = await fosterService.getFosterServiceDetail(params);
      
      // 转换数据格式
      const transformedData = transformFosterDetail(apiData);
      setFosterDetail(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取寄养服务详情失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 当寄养服务ID变化时重新加载数据
  useEffect(() => {
    loadFosterDetail(fosterId);
  }, [fosterId, loadFosterDetail]);

  // 刷新详情
  const refreshFosterDetail = useCallback(() => {
    loadFosterDetail(fosterId);
  }, [fosterId, loadFosterDetail]);

  return {
    fosterDetail,
    loading,
    error,
    refreshFosterDetail
  };
};

export default useFosterDetail;