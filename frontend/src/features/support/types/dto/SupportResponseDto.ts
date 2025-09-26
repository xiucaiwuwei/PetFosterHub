// 支持响应数据传输对象
export interface SupportResponseDto {
  id: string;
  userId: string;
  userName: string;
  serviceType: string;
  message: string;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
}