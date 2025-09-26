import { useDispatch } from 'react-redux';
import { updateOrderStatus, cancelOrder } from '../slice/orderSlice';
import { UpdateOrderStatusDto } from '../types/dto';
import { OrderStatus } from '../types/enums';

interface UseOrderActionsReturn {
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => Promise<boolean>;
  cancelUserOrder: (orderId: string, reason?: string) => Promise<boolean>;
  confirmOrder: (orderId: string) => Promise<boolean>;
  completeOrder: (orderId: string) => Promise<boolean>;
}

export const useOrderActions = (): UseOrderActionsReturn => {
  const dispatch = useDispatch();

  // 更新订单状态
  const updateStatus = async (orderId: string, statusData: UpdateOrderStatusDto): Promise<boolean> => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, statusData })).unwrap();
      return true;
    } catch (error) {
      console.error('更新订单状态失败:', error);
      return false;
    }
  };

  // 取消订单
  const cancelUserOrder = async (orderId: string, reason?: string): Promise<boolean> => {
    try {
      await dispatch(cancelOrder({ id: orderId, reason })).unwrap();
      return true;
    } catch (error) {
      console.error('取消订单失败:', error);
      return false;
    }
  };

  // 确认订单
  const confirmOrder = async (orderId: string): Promise<boolean> => {
    return updateStatus(orderId, { status: OrderStatus.CONFIRMED });
  };

  // 完成订单
  const completeOrder = async (orderId: string): Promise<boolean> => {
    return updateStatus(orderId, { status: OrderStatus.COMPLETED });
  };

  return {
    updateOrderStatus: updateStatus,
    cancelUserOrder,
    confirmOrder,
    completeOrder
  };
};