// 寄养服务预订相关接口定义

/**
 * 寄养服务预订请求参数
 */
export interface BookFosterRequest {
  fosterServiceId: string; // 寄养服务ID
  petId: string; // 宠物ID
  checkInDate: string; // 入住日期
  checkOutDate: string; // 离店日期
  specialRequests?: string; // 特殊要求
}

/**
 * 寄养服务预订响应数据
 */
export interface BookFosterResponse {
  orderId: string; // 订单ID
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'; // 订单状态
  totalPrice: number; // 总价
  bookingTime: string; // 预订时间
  message?: string; // 响应消息
}

/**
 * 寄养订单详情
 */
export interface FosterOrder {
  id: string; // 订单ID
  fosterServiceId: string; // 寄养服务ID
  fosterServiceName: string; // 寄养服务名称
  fosterServicePrice: number; // 寄养服务价格
  providerId: string; // 服务提供者ID
  providerName: string; // 服务提供者名称
  petId: string; // 宠物ID
  petName: string; // 宠物名称
  checkInDate: string; // 入住日期
  checkOutDate: string; // 离店日期
  totalPrice: number; // 总价
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED'; // 订单状态
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
  specialRequests?: string; // 特殊要求
}