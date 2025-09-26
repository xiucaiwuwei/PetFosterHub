import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { fetchOrderDetail, clearCurrentOrder } from '../slice/orderSlice';
import { Order } from '../types/entity';

interface UseOrderDetailReturn {
  order: Order | null;
  loading: boolean;
  error: string | null;
  refreshOrderDetail: () => void;
}

export const useOrderDetail = (orderId: string): UseOrderDetailReturn => {
  const dispatch = useDispatch();

  // 从Redux获取当前订单状态
  const { data: order, loading, error } = useSelector((state: RootState) => state.order.currentOrder);

  // 获取订单详情
  const fetchOrderDetailById = (id: string) => {
    if (id) {
      dispatch(fetchOrderDetail(id));
    }
  };

  // 刷新订单详情
  const refreshOrderDetail = () => {
    fetchOrderDetailById(orderId);
  };

  // 当初始化或订单ID变化时获取订单详情
  useEffect(() => {
    fetchOrderDetailById(orderId);

    // 组件卸载时清除当前订单状态
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [orderId, dispatch]);

  return {
    order,
    loading,
    error,
    refreshOrderDetail
  };
};