/**
 * 创建寄养订单接口参数
 */
import { FosterServiceStatus } from '../enums';

// 寄养服务实体类型定义
export interface FosterService {
  id: string; // 服务ID
  title: string; // 服务标题
  description: string; // 服务描述
  price: number; // 服务价格
  discountPrice?: number; // 折扣价格
  images: string[]; // 图片列表
  location: string; // 服务地点
  rating: number; // 评分
  reviewCount: number; // 评价数量
  tags: string[]; // 标签列表
  status: FosterServiceStatus; // 服务状态
  providerId: string; // 提供者ID
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  // 其他实体字段
}