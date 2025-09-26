// 寄养服务相关的实体类型定义

// 寄养服务实体
export interface FosterService {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  status: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
  // 其他实体字段
}

// 寄养订单实体
export interface FosterOrder {
  id: string;
  fosterServiceId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  // 其他订单相关字段
}

// 宠物信息实体
export interface PetInfo {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  weight: number;
  healthCondition: string;
  specialRequirements: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// 寄养服务提供者信息实体
export interface FosterProvider {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  createdAt: string;
  updatedAt: string;
}

// 导出所有类型
export * from './FosterEntity';