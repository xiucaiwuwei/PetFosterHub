import { OrderStatus } from '../dto/GetOrderDto';

export interface Order {
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
  // 关联数据
  fosterService?: {
    id: string;
    title: string;
    pricePerDay: number;
    providerName: string;
    providerAvatar: string;
    rating: number;
    reviewsCount: number;
  };
  pet?: {
    id: string;
    name: string;
    breed: string;
    age: number;
    size: 'small' | 'medium' | 'large';
    imageUrls: string[];
    specialNeeds?: string;
  };
}