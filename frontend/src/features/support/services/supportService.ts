import { SupportRequestDto, SupportResponseDto } from '../types';
import * as supportApi from '../api/supportApi';

// 获取用户的支持请求列表
export const getUserSupportRequests = async (userId?: string): Promise<SupportResponseDto[]> => {
  try {
    const allRequests = await supportApi.getSupportRequests();
    if (userId) {
      return allRequests.filter(request => request.userId === userId);
    }
    return allRequests;
  } catch (error) {
    console.error('获取支持请求列表失败:', error);
    throw new Error('获取支持请求列表失败，请稍后再试');
  }
};

// 创建新的支持请求
export const submitSupportRequest = async (request: SupportRequestDto): Promise<SupportResponseDto> => {
  try {
    // 在提交前可以添加额外的验证或处理逻辑
    const validatedRequest = {
      ...request,
      userId: request.userId || localStorage.getItem('userId') || '', // 从本地存储获取用户ID
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const response = await supportApi.createSupportRequest(validatedRequest);
    return response;
  } catch (error) {
    console.error('提交支持请求失败:', error);
    throw new Error('提交支持请求失败，请稍后再试');
  }
};

// 更新支持请求状态
export const changeSupportRequestStatus = async (
  id: string,
  status: 'pending' | 'processing' | 'resolved' | 'rejected',
  adminResponse?: string
): Promise<SupportResponseDto> => {
  try {
    const updateData = {
      status,
      updatedAt: new Date().toISOString()
    };
    
    if (adminResponse) {
      updateData['adminResponse'] = adminResponse;
    }
    
    const response = await supportApi.updateSupportRequest(id, updateData);
    return response;
  } catch (error) {
    console.error('更新支持请求状态失败:', error);
    throw new Error('更新支持请求状态失败，请稍后再试');
  }
};

// 搜索支持请求
export const searchSupportRequests = async (
  keyword: string,
  filters?: {
    status?: string[];
    serviceType?: string[];
    startDate?: string;
    endDate?: string;
  }
): Promise<SupportResponseDto[]> => {
  try {
    const allRequests = await supportApi.getSupportRequests();
    
    // 实现客户端搜索和过滤逻辑
    return allRequests.filter(request => {
      // 搜索关键词匹配
      const matchesKeyword = !keyword || 
        request.message.toLowerCase().includes(keyword.toLowerCase()) ||
        request.userName?.toLowerCase().includes(keyword.toLowerCase()) ||
        request.serviceType.toLowerCase().includes(keyword.toLowerCase());
      
      // 状态过滤
      const matchesStatus = !filters?.status || filters.status.length === 0 || 
        filters.status.includes(request.status);
      
      // 服务类型过滤
      const matchesServiceType = !filters?.serviceType || filters.serviceType.length === 0 || 
        filters.serviceType.includes(request.serviceType);
      
      // 日期范围过滤
      const requestDate = new Date(request.createdAt);
      const matchesStartDate = !filters?.startDate || requestDate >= new Date(filters.startDate);
      const matchesEndDate = !filters?.endDate || requestDate <= new Date(filters.endDate);
      
      return matchesKeyword && matchesStatus && matchesServiceType && matchesStartDate && matchesEndDate;
    });
  } catch (error) {
    console.error('搜索支持请求失败:', error);
    throw new Error('搜索支持请求失败，请稍后再试');
  }
};