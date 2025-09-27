import { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import type { PetProduct } from '@/features/petStore/types';

export const useProductDetail = (id: string | undefined): {
  product: PetProduct | null;
  loading: boolean;
  error: string | null;
} => {
  const [product, setProduct] = useState<PetProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      setError('商品ID无效');
      return;
    }

    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await productService.getProductDetail(id);
        setProduct(response);
      } catch (err) {
        setError('获取商品详情失败，请稍后重试');
        console.error('Failed to fetch product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  return {
    product,
    loading,
    error
  };
};