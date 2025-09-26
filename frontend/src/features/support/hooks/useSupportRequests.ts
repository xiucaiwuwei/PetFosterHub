import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { 
  fetchSupportRequests, 
  fetchSupportRequestById, 
  updateSupportRequest,
  deleteSupportRequest,
  resetSelectedRequest,
  clearError
} from '../slice/supportSlice';
import { SupportResponseDto, SupportRequestDto } from '../types';
import { toast } from 'sonner';

interface UseSupportRequestsReturn {
  requests: SupportResponseDto[];
  selectedRequest: SupportResponseDto | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  fetchRequests: () => void;
  getRequestById: (id: string) => void;
  updateRequest: (id: string, request: Partial<SupportRequestDto>) => Promise<void>;
  removeRequest: (id: string) => Promise<void>;
  resetSelected: () => void;
  clearErrorState: () => void;
}

export const useSupportRequests = (): UseSupportRequestsReturn => {
  const dispatch = useDispatch();
  const {
    requests,
    selectedRequest,
    isLoading,
    isSubmitting,
    error
  } = useSelector((state: RootState) => state.support);

  // 初始加载请求列表
  useEffect(() => {
    fetchRequests();
  }, []);

  // 获取请求列表
  const fetchRequests = () => {
    dispatch(fetchSupportRequests());
  };

  // 获取单个请求详情
  const getRequestById = (id: string) => {
    dispatch(fetchSupportRequestById(id));
  };

  // 更新请求
  const updateRequest = async (id: string, request: Partial<SupportRequestDto>) => {
    try {
      await dispatch(updateSupportRequest({ id, request })).unwrap();
      toast.success('更新成功');
    } catch (err) {
      toast.error('更新失败，请重试');
    }
  };

  // 删除请求
  const removeRequest = async (id: string) => {
    try {
      await dispatch(deleteSupportRequest(id)).unwrap();
      toast.success('删除成功');
    } catch (err) {
      toast.error('删除失败，请重试');
    }
  };

  // 重置选中的请求
  const resetSelected = () => {
    dispatch(resetSelectedRequest());
  };

  // 清除错误状态
  const clearErrorState = () => {
    dispatch(clearError());
  };

  return {
    requests,
    selectedRequest,
    isLoading,
    isSubmitting,
    error,
    fetchRequests,
    getRequestById,
    updateRequest,
    removeRequest,
    resetSelected,
    clearErrorState
  };
};