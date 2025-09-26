import axios from '@/lib/axios';
import { SupportRequestDto, SupportResponseDto } from '../types';

// 创建支持请求
export const createSupportRequest = async (request: SupportRequestDto): Promise<SupportResponseDto> => {
  const response = await axios.post('/api/support/requests', request);
  return response.data;
};

// 获取支持请求列表
export const getSupportRequests = async (): Promise<SupportResponseDto[]> => {
  const response = await axios.get('/api/support/requests');
  return response.data;
};

// 获取单个支持请求详情
export const getSupportRequestById = async (id: string): Promise<SupportResponseDto> => {
  const response = await axios.get(`/api/support/requests/${id}`);
  return response.data;
};

// 更新支持请求
export const updateSupportRequest = async (
  id: string,
  request: Partial<SupportRequestDto>
): Promise<SupportResponseDto> => {
  const response = await axios.put(`/api/support/requests/${id}`, request);
  return response.data;
};

// 删除支持请求
export const deleteSupportRequest = async (id: string): Promise<void> => {
  await axios.delete(`/api/support/requests/${id}`);
};