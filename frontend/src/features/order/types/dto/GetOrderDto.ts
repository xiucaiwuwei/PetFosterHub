export interface GetOrderDto {
  id: string;
  status: OrderStatus;
  totalPrice: number;
  startDate: Date;
  endDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  fosterServiceId: string;
  petId: string;
  userId: string;
}

// 订单状态类型
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';