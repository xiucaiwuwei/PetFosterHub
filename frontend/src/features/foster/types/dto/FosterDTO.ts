// 寄养服务相关的DTO类型定义

// 获取寄养服务列表请求参数
export interface FosterServiceListRequest {
  keyword?: string;
  pageNum?: number;
  pageSize?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 寄养服务列表项
export interface FosterServiceItem {
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
  createdAt: string;
  updatedAt: string;
}

// 获取寄养服务列表响应数据
export interface FosterServiceListResponse {
  list: FosterServiceItem[];
  total: number;
  pageNum: number;
  pageSize: number;
}

// 获取寄养服务详情请求参数
export interface FosterServiceDetailRequest {
  id: string;
}

// 寄养服务详情
export interface FosterServiceDetail {
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
  createdAt: string;
  updatedAt: string;
  providerInfo: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    reviewCount: number;
  };
  details: {
    services: string[];
    facilities: string[];
    workingHours: string;
    holidays: string[];
    notice: string;
  };
  availableSlots: {
    date: string;
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  }[];
}

// 获取寄养服务详情响应数据
export interface FosterServiceDetailResponse extends FosterServiceDetail {}

// 申请寄养服务请求参数
export interface ApplyFosterRequest {
  fosterServiceId: string;
  startDate: string;
  endDate: string;
  petInfo: {
    name: string;
    type: string;
    breed: string;
    age: number;
    weight: number;
    healthCondition: string;
    specialRequirements: string;
  };
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  notes?: string;
}

// 申请寄养服务响应数据
export interface ApplyFosterResponse {
  orderId: string;
  status: string;
  message: string;
}

// 创建寄养订单请求参数
export interface FosterOrderRequest {
  fosterServiceId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  petInfo: {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    weight: number;
    healthCondition: string;
    specialRequirements: string;
  };
  paymentMethod: string;
}

// 创建寄养订单响应数据
export interface FosterOrderResponse {
  orderId: string;
  status: string;
  totalPrice: number;
  paymentStatus: string;
  orderTime: string;
}

// 导出所有类型
export * from './FosterDTO';