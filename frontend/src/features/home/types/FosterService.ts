/**
 * 寄养服务实体类
 * 表示平台上提供的宠物寄养服务
 */
export interface FosterService {
  /**
   * 服务ID
   */
  id: string;
  
  /**
   * 服务提供者ID
   */
  providerId: string;
  
  /**
   * 服务提供者名称
   */
  providerName: string;
  
  /**
   * 服务提供者头像URL
   */
  providerAvatar: string;
  
  /**
   * 服务提供者类型
   */
  providerType?: 'individual' | 'store';
  
  /**
   * 服务标题
   */
  title: string;
  
  /**
   * 服务描述
   */
  description: string;
  
  /**
   * 每日价格
   */
  pricePerDay: number;
  
  /**
   * 货币类型
   */
  currency: string;
  
  /**
   * 服务地点
   */
  location: string;
  
  /**
   * 可用开始时间（ISO 8601格式字符串）
   */
  availableFrom: string;
  
  /**
   * 可用结束时间（ISO 8601格式字符串）
   */
  availableTo: string;
  
  /**
   * 可接受的宠物类型
   */
  petTypes: ('dog' | 'cat' | 'other')[];
  
  /**
   * 最多可接受的宠物数量
   */
  maxPets: number;
  
  /**
   * 服务图片URL列表
   */
  images: string[];
  
  /**
   * 服务提供的便利设施
   */
  amenities: string[];
  
  /**
   * 服务评分
   */
  rating: number;
  
  /**
   * 评论数量
   */
  reviewsCount: number;
  
  /**
   * 是否可用
   */
  isAvailable: boolean;
  
  /**
   * 服务创建时间
   */
  createdAt: string;
  
  /**
   * 服务更新时间
   */
  updatedAt: string;
}