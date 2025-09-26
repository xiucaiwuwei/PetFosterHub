import { PetType } from '../enums';

// 申请寄养服务请求参数
export interface ApplyFosterRequest {
  fosterServiceId: string; // 寄养服务ID
  startDate: string; // 开始日期
  endDate: string; // 结束日期
  petInfo: { // 宠物信息
    name: string; // 宠物名称
    type: PetType; // 宠物类型
    breed: string; // 宠物品种
    age: number; // 宠物年龄
    weight: number; // 宠物体重
    healthCondition: string; // 健康状况
    specialRequirements: string; // 特殊要求
  };
  contactInfo: { // 联系信息
    name: string; // 联系人姓名
    phone: string; // 联系电话
  };
  notes?: string; // 备注信息
}

// 申请寄养服务响应数据
export interface ApplyFosterResponse {
  orderId: string; // 订单ID
  status: string; // 订单状态
  message: string; // 响应消息
}