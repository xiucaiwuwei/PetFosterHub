/**
 * 寄养申请表单处理逻辑
 */

import { useState, useEffect, useCallback } from 'react';
import fosterService from '../services/fosterService';
import type {
  FosterServiceListRequest,
  FosterServiceListResponse,
  FosterServiceDetailRequest,
  FosterServiceDetailResponse
} from '../types/dto';

// 自定义Hook：获取寄养服务列表
export const useFosters = (params: FosterServiceListRequest = {}) => {
  const [fosters, setFosters] = useState<FosterServiceListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<FosterServiceListRequest>(params);

  // 加载寄养服务列表
  const loadFosters = useCallback(async (newParams?: FosterServiceListRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const finalParams = { ...currentParams, ...newParams };
      const data = await fosterService.getFosterServiceList(finalParams);
      setFosters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取寄养服务列表失败');
    } finally {
      setLoading(false);
    }
  }, [currentParams]);

  // 当参数变化时重新加载数据
  useEffect(() => {
    loadFosters();
  }, [loadFosters]);

  // 刷新列表
  const refreshFosters = useCallback(() => {
    loadFosters();
  }, [loadFosters]);

  // 更新搜索参数
  const updateParams = useCallback((newParams: FosterServiceListRequest) => {
    setCurrentParams(prev => ({ ...prev, ...newParams }));
  }, []);

  return {
    fosters,
    loading,
    error,
    refreshFosters,
    updateParams
  };
};

// 自定义Hook：获取寄养服务详情
export const useFosterDetail = (fosterId: string) => {
  const [fosterDetail, setFosterDetail] = useState<FosterServiceDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 加载寄养服务详情
  const loadFosterDetail = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params: FosterServiceDetailRequest = { id };
      const data = await fosterService.getFosterServiceDetail(params);
      setFosterDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取寄养服务详情失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 当寄养服务ID变化时重新加载数据
  useEffect(() => {
    loadFosterDetail(fosterId);
  }, [fosterId, loadFosterDetail]);

  // 刷新详情
  const refreshFosterDetail = useCallback(() => {
    loadFosterDetail(fosterId);
  }, [fosterId, loadFosterDetail]);

  return {
    fosterDetail,
    loading,
    error,
    refreshFosterDetail
  };
};

export default { useFosters, useFosterDetail };