/**
 * 获取用户列表请求数据传输对象
 */
export interface GetUsersDto {
  searchTerm?: string;
  role?: string;
  page?: number;
  pageSize?: number;
}