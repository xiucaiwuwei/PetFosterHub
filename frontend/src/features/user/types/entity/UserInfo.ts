/**
 * 用户信息实体类型
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  role: 'owner' | 'foster' | 'admin';
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}