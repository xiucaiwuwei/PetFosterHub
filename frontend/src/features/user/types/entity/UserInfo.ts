/**
 * 用户信息实体类型
 */
import { UserRole } from '@/types/enums/UserRole';

export interface UserInfo {
  id: number; // 用户ID
  phone: string; // 手机号 (必填)
  nickname?: string; // 昵称
  avatar?: string; // 头像URL
  role: UserRole; // 用户角色
  fullName?: string; // 姓名
  address?: string; // 地址
  bio?: string; // 个人简介
  rating?: number; // 评分
  reviewCount?: number; // 评价数量
  idCard?: string; // 身份证号
  deleted?: number; // 逻辑删除标记
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}