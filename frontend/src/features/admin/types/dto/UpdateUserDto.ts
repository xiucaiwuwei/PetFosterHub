/**
 * 更新用户信息请求数据传输对象
 */
export interface UpdateUserDto {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  avatar?: string;
  rating?: number;
  reviewsCount?: number;
}