/**
 * 寄养服务列表数据处理逻辑
 * 封装寄养服务列表页面的搜索、筛选等数据处理逻辑
 */
import { useCallback } from 'react';
import { useFosters } from './useFosters';
import type { FosterServiceListRequest } from '../types/dto';

// 搜索和筛选函数接口
export type SearchFunction = (keyword: string) => void;
export type FiltersChangeFunction = (filters: { petType: string; serviceType: string }) => void;

// 自定义Hook：处理寄养服务列表的搜索、筛选等数据逻辑
export const useFosterListData = (initialParams: FosterServiceListRequest = { pageNum: 1, pageSize: 12 }) => {
  // 使用基础的useFosters hook获取数据
  const { fosters, loading, error, updateParams, refreshFosters } = useFosters(initialParams);

  // 搜索函数
  const search: SearchFunction = useCallback((keyword: string) => {
    updateParams({ keyword, pageNum: 1 });
  }, [updateParams]);

  // 处理筛选条件变化的函数
  const handleFiltersChange: FiltersChangeFunction = useCallback((filters) => {
    // 合并筛选条件为一个关键字字符串
    const filterKeywords = [];
    if (filters.petType) filterKeywords.push(filters.petType);
    if (filters.serviceType) filterKeywords.push(filters.serviceType);
    
    const combinedKeyword = filterKeywords.join(' ');
    updateParams({ keyword: combinedKeyword, pageNum: 1 });
  }, [updateParams]);

  // 清除所有筛选条件的函数
  const clearAllFilters = useCallback(() => {
    search('');
    // 触发一次空筛选，确保所有筛选条件都被清除
    handleFiltersChange({ petType: '', serviceType: '' });
  }, [search, handleFiltersChange]);

  return {
    fosters,
    loading,
    error,
    refreshFosters,
    updateParams,
    search,
    handleFiltersChange,
    clearAllFilters
  };
};

export default useFosterListData;