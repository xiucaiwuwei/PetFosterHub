/**
 * 创建寄养订单接口参数
 */
import { FosterOrderStatus, PaymentMethod } from '../enums';

// 创建寄养订单请求参数
export interface FosterOrderRequest {
  fosterServiceId: string; // 寄养服务ID
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  totalPrice: number; // 总价格
  petInfo: { // 宠物信息
    id: string; // 宠物ID
    name: string; // 宠物名称
    type: string; // 宠物类型
    breed: string; // 宠物品种
    age: number; // 宠物年龄
    weight: number; // 宠物体重
    healthCondition: string; // 健康状况
    specialRequirements: string; // 特殊要求
  };
  paymentMethod: PaymentMethod; // 支付方式
}

// 创建寄养订单响应数据
export interface FosterOrderResponse {
  orderId: string; // 订单ID
  status: FosterOrderStatus; // 订单状态
  totalPrice: number; // 总价格
  paymentStatus: string; // 支付状态
  orderTime: string; // 下单时间
}