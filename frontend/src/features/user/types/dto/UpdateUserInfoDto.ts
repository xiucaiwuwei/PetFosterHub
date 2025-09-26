/**
 * 更新用户信息的数据传输对象
 */
export interface UpdateUserInfoDto {
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
  avatar?: string;
}