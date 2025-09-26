export interface CreateOrderDto {
  fosterServiceId: string;
  petId: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  totalPrice: number;
}