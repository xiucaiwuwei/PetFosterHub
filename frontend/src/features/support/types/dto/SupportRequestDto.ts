// 支持请求数据传输对象
export interface SupportRequestDto {
  id?: string;
  userId: string;
  serviceType: string;
  message: string;
  status?: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}