import type { FosterService } from './FosterService';
import type { FosterServiceItem } from '@/features/foster/types/dto/FosterServiceDTO';
import { FosterServiceStatus } from '@/features/foster/types/enums/FosterServiceStatus';

/**
 * 将 FosterService 转换为 FosterServiceItem
 * @param fosterService 寄养服务对象
 * @returns 转换后的寄养服务列表项
 */
export const convertToFosterServiceItem = (fosterService: FosterService): FosterServiceItem => {
  return {
    id: fosterService.id,
    title: fosterService.title,
    description: fosterService.description,
    price: fosterService.pricePerDay,
    images: fosterService.images,
    location: fosterService.location,
    rating: fosterService.rating,
    reviewCount: fosterService.reviewsCount,
    tags: fosterService.amenities.slice(0, 3), // 使用部分设施作为标签
    status: FosterServiceStatus.ACTIVE,
    createdAt: fosterService.createdAt,
    updatedAt: fosterService.updatedAt
  };
};

/**
 * 批量转换 FosterService 数组为 FosterServiceItem 数组
 * @param fosterServices 寄养服务数组
 * @returns 转换后的寄养服务列表项数组
 */
export const convertToFosterServiceItems = (
  fosterServices: FosterService[]
): FosterServiceItem[] => {
  return fosterServices.map(convertToFosterServiceItem);
};