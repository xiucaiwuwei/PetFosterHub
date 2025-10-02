import { useEffect } from 'react';
import { useAppDispatch } from '@/app/store/store';
import { fetchLatestThreeTestimonials } from '../slice/homeSlice';
import { useTestimonials, useHomeLoading, useHomeError } from './useHomeState';

/**
 * 用户评价相关的自定义hook
 * 封装了用户评价数据的获取和处理逻辑
 */
export const useUserReviews = () => {
  const dispatch = useAppDispatch();
  const testimonials = useTestimonials();
  const loading = useHomeLoading();
  const error = useHomeError();

  // 在组件挂载时获取用户评价数据
  useEffect(() => {
    dispatch(fetchLatestThreeTestimonials());
  }, [dispatch]);

  // 重新获取评价数据
  const refetchTestimonials = () => {
    dispatch(fetchLatestThreeTestimonials());
  };

  // 渲染评分星星
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`star-${i}`} className="fa-solid fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half-star" className="fa-solid fa-star-half-stroke"></i>);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-star-${i}`} className="fa-regular fa-star"></i>);
    }

    return stars;
  };

  return {
    testimonials,
    loading,
    error,
    refetchTestimonials,
    renderRatingStars
  };
};