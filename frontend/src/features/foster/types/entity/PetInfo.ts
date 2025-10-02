/**
 * 申请寄养服务参数
 */
import { PetType } from '../enums';

// 宠物信息实体类型定义
export interface PetInfo {
  id: string; // 宠物ID
  name: string; // 宠物名称
  type: PetType; // 宠物类型
  breed: string; // 宠物品种
  age: number; // 宠物年龄
  weight: number; // 宠物体重
  healthCondition: string; // 健康状况
  specialRequirements: string; // 特殊要求
  userId: string; // 用户ID
  createdAt: string; // 创建时间
  updatedAt: string; // 更新时间
}