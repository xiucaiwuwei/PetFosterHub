/**
 * 获取订单列表请求数据传输对象
 */
export interface GetOrdersDto {
  searchTerm?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}