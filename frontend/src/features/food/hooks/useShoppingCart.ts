/**
 * 购物车相关的自定义Hook
 */

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} from '../slice';
import { validateQuantity, formatPrice } from '../utils/validationUtils';

interface UseShoppingCartReturn {
  cartItems: Array<{ productId: string; quantity: number }>;
  totalItems: number;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearShoppingCart: () => void;
  getCartItemCount: (productId: string) => number;
}

export const useShoppingCart = (): UseShoppingCartReturn => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.product);

  // 计算购物车中商品的总数量
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // 从购物车中移除商品
  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  // 更新购物车中商品的数量
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const validation = validateQuantity(quantity);
    if (validation.isValid) {
      dispatch(updateCartItemQuantity({ productId, quantity }));
    }
  };

  // 清空购物车
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  // 获取指定商品在购物车中的数量
  const getCartItemCount = (productId: string): number => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    totalItems,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearShoppingCart: handleClearCart,
    getCartItemCount
  };
};