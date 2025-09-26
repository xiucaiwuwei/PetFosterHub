import { FosterOrderStatus } from '../enums';

// 寄养订单实体类型定义
export interface FosterOrder {
  id: string; // 订单ID
  fosterServiceId: string; // 寄养服务ID
  userId: string; // 用户ID
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  totalPrice: number; // 总价格
  status: FosterOrderStatus; // 订单状态
  paymentStatus: string; // 支付状态
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  // 其他订单相关字段
}