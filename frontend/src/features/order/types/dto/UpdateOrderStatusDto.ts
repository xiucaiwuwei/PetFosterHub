import { OrderStatus } from './GetOrderDto';

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  reason?: string;
}