// 支持实体类型
export interface SupportEntity {
  id: string;
  userId: string;
  serviceType: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}