/**
 * 更新订单信息请求数据传输对象
 */
export interface UpdateOrderDto {
  id: string;
  status?: string;
  notes?: string;
}