/**
 * 获取用户信息的数据传输对象
 */
import { UserRole } from "@/types";

export interface GetUserInfoDto {
  id: number;
  nickname: string;
  phone: string;
  avatar: string | null;
  role: UserRole;
  fullName: string | null;
  address: string | null;
  bio: string | null;
  rating: number | null;
  reviewCount: number | null;
  createdAt: string;
  updatedAt: string;
}