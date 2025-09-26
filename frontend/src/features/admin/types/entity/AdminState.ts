/**
 * 管理员模块状态类型定义
 */
export interface AdminState {
  loading: boolean;
  users: { data: any[]; total: number; loading: boolean };
  orders: { data: any[]; total: number; loading: boolean };
  products: { data: any[]; total: number; loading: boolean };
  consultations: { data: any[]; total: number; loading: boolean };
  selectedUser: any | null;
  selectedOrder: any | null;
  selectedProduct: any | null;
  selectedConsultation: any | null;
  stats: {
    totalUsers: number;
    monthlyOrders: number;
    monthlyRevenue: number;
    fosterServices: number;
  };
}