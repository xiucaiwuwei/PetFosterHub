/**
 * 商品详情相关的自定义Hook
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../../app/store';
import {
  fetchProductDetail,
  addToCart,
  clearProductDetail,
  clearError
} from '../slice';
import { validateQuantity, formatPrice } from '../utils/validationUtils';

interface UseProductDetailReturn {
  productDetail: any;
  loading: boolean;
  error: string | null;
  quantity: number;
  setQuantity: (quantity: number) => void;
  addToCart: () => Promise<void>;
  isInStock: boolean;
  formattedPrice: string;
  isLoadingAddToCart: boolean;
}

export const useProductDetail = (): UseProductDetailReturn => {
  const dispatch = useDispatch();
  const productState = useSelector((state: RootState) => state.product);
  const { productId } = useParams<{ productId: string }>();
  
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState<boolean>(false);

  // 获取商品详情
  const fetchProductDetails = () => {
    if (productId) {
      dispatch(fetchProductDetail(productId));
    }
  };

  // 初始加载商品详情
  useEffect(() => {
    fetchProductDetails();
    
    // 组件卸载时清理状态
    return () => {
      dispatch(clearProductDetail());
      dispatch(clearError());
    };
  }, [productId, dispatch]);

  // 处理数量变更
  const handleQuantityChange = (newQuantity: number) => {
    const validation = validateQuantity(newQuantity);
    if (validation.isValid) {
      setQuantity(newQuantity);
    }
  };

  // 添加到购物车
  const handleAddToCart = async () => {
    if (!productId) {
      return;
    }

    setIsLoadingAddToCart(true);
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      // 可以在这里添加成功提示
      console.log('添加到购物车成功');
    } catch (error) {
      console.error('添加到购物车失败:', error);
    } finally {
      setIsLoadingAddToCart(false);
    }
  };

  // 检查商品是否有库存
  const isInStock = productState.productDetail?.stock > 0;

  // 格式化价格
  const formattedPrice = productState.productDetail 
    ? formatPrice(productState.productDetail.price)
    : '';

  return {
    productDetail: productState.productDetail,
    loading: productState.loading && !isLoadingAddToCart,
    error: productState.error,
    quantity,
    setQuantity: handleQuantityChange,
    addToCart: handleAddToCart,
    isInStock,
    formattedPrice,
    isLoadingAddToCart
  };
};