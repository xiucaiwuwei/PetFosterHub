// Home模块的自定义actions hooks
import { useDispatch } from 'react-redux';
import { fetchFeaturedFosters, fetchServiceFeatures, fetchTestimonials, clearError } from '../slice/homeSlice';

// 封装home相关的dispatch操作
export const useHomeActions = () => {
  const dispatch = useDispatch();

  // 获取推荐寄养服务
  const getFeaturedFosters = () => {
    return dispatch(fetchFeaturedFosters());
  };

  // 获取服务特点
  const getServiceFeatures = () => {
    return dispatch(fetchServiceFeatures());
  };

  // 获取用户评价
  const getTestimonials = () => {
    return dispatch(fetchTestimonials());
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
        dispatch(fetchFeaturedFosters()),
        dispatch(fetchServiceFeatures()),
        dispatch(fetchTestimonials())
      ]);
    } catch (error) {
      console.error('初始化home数据失败:', error);
      throw error;
    }
  };

  return {
    getFeaturedFosters,
    getServiceFeatures,
    getTestimonials,
    removeError,
    initializeHomeData
  };
};