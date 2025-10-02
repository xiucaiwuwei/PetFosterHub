// Home模块的自定义actions hooks
import { useAppDispatch } from '@/app/store/store';
import { fetchTopThreeFosters, fetchLatestThreeTestimonials, clearError } from '../slice/homeSlice';

// 封装home相关的dispatch操作
export const useHomeActions = () => {
  const dispatch = useAppDispatch();

  // 获取最好的三个寄养服务数据
  const getTopThreeFosters = () => {
    return dispatch(fetchTopThreeFosters());
  };

  // 获取三个用户最新的评价
  const getLatestThreeTestimonials = () => {
    return dispatch(fetchLatestThreeTestimonials());
  };

  // 清除错误
  const removeError = () => {
    return dispatch(clearError());
  };

  // 初始化所有home数据
  const initializeHomeData = async () => {
    try {
      // 并行请求所有数据
      await Promise.all([
        dispatch(fetchTopThreeFosters()),
        dispatch(fetchLatestThreeTestimonials())
      ]);
    } catch (error) {
      console.error('初始化home数据失败:', error);
      throw error;
    }
  };

  return {
    getTopThreeFosters,
    getLatestThreeTestimonials,
    removeError,
    initializeHomeData
  };
};