import { OrderStatus } from '../dto/GetOrderDto';

export interface OrderSummary {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  startDate: Date;
  endDate: Date;
  fosterServiceTitle: string;
  petName: string;
  createdAt: Date;
}