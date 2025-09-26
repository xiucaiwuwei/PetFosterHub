/**
 * 获取用户信息的数据传输对象
 */
export interface GetUserInfoDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
  role: 'owner' | 'foster' | 'admin';
  rating?: number;
  createdAt: string;
  updatedAt: string;
}