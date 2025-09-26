import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { fetchOrders, clearOrdersError } from '../slice/orderSlice';
import { OrderSortOption } from '../types/enums';
import { Order } from '../types/entity';

interface UseOrderListOptions {
  initialPage?: number;
  initialLimit?: number;
  initialSortOption?: OrderSortOption;
}

interface UseOrderListReturn {
  orders: Order[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  totalPages: number;
  sortOption: OrderSortOption;
  onPageChange: (page: number) => void;
  onSortChange: (sortOption: OrderSortOption) => void;
  refreshOrders: () => void;
}

export const useOrderList = ({ initialPage = 1, initialLimit = 10, initialSortOption = OrderSortOption.DEFAULT }: UseOrderListOptions = {}): UseOrderListReturn => {
  const dispatch = useDispatch();
  const [sortOption, setSortOption] = useState<OrderSortOption>(initialSortOption);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialLimit);

  // 从Redux获取订单状态
  const { orders, loading, error, total } = useSelector((state: RootState) => state.order.orders);

  // 计算总页数
  const totalPages = Math.ceil(total / limit);

  // 获取订单列表
  const fetchOrderList = (page: number, currentSortOption: OrderSortOption) => {
    dispatch(fetchOrders({ page, limit, sortOption: currentSortOption }));
  };

  // 处理页码变化
  const onPageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchOrderList(page, sortOption);
    }
  };

  // 处理排序变化
  const onSortChange = (newSortOption: OrderSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(1); // 重置为第一页
    fetchOrderList(1, newSortOption);
  };

  // 刷新订单列表
  const refreshOrders = () => {
    fetchOrderList(currentPage, sortOption);
  };

  // 清除错误
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearOrdersError());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // 初始化加载
  useEffect(() => {
    fetchOrderList(initialPage, initialSortOption);
  }, [initialPage, initialSortOption]);

  return {
    orders,
    loading,
    error,
    total,
    currentPage,
    totalPages,
    sortOption,
    onPageChange,
    onSortChange,
    refreshOrders
  };
};