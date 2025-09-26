import { Order } from './Order';

export interface OrderState {
  orders: {
    items: Order[];
    loading: boolean;
    error: string | null;
    total: number;
    page: number;
    limit: number;
  };
  currentOrder: {
    data: Order | null;
    loading: boolean;
    error: string | null;
  };
}