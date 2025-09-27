import { useState, useEffect, useMemo } from 'react';
import { productService } from '../services/productService';
import type { PetProduct } from '@/features/petStore/types';
import type { ProductCategory } from '@/features/petStore/types/enums/ProductCategory';
import type { ProductSortOption } from '@/features/petStore/types';
import type { ProductTag } from '@/features/petStore/types/enums/ProductTag';

interface UseProductListParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  category?: ProductCategory;
  sortBy?: ProductSortOption;
  tags?: ProductTag[];
}

interface UseProductListReturn {
  products: PetProduct[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useProductList = (params: UseProductListParams): UseProductListReturn => {
  const [allProducts, setAllProducts] = useState<PetProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // 根据标签筛选产品
  const products = useMemo(() => {
    if (!params.tags || params.tags.length === 0) {
      return allProducts;
    }

    return allProducts.filter(product => {
      // 根据标签进行筛选
      const productTags: ProductTag[] = [];
      
      if (product.isNew) productTags.push(ProductTag.NEW_ARRIVAL);
      if (product.isBestseller) productTags.push(ProductTag.BEST_SELLER);
      if (product.discount && product.discount > 0) productTags.push(ProductTag.DISCOUNT);
      // 这里可以添加更多标签的判断逻辑
      
      // 检查是否包含至少一个所选标签
      return params.tags?.some(tag => productTags.includes(tag)) || false;
    });
  }, [allProducts, params.tags]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        // 注意：当前后端API可能不支持标签筛选，所以这里只传递基本参数
        // 实际项目中可以根据后端API支持情况调整
        const response = await productService.getProducts({
          page: params.page,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          category: params.category,
          sortBy: params.sortBy
        });
        setAllProducts(response.items || []);
        // 如果有标签筛选，使用筛选后的总数，否则使用原始总数
        setTotal(params.tags && params.tags.length > 0 
          ? products.length 
          : response.total || 0);
      } catch (err) {
        setError('获取商品列表失败，请稍后重试');
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.page, params.pageSize, params.searchTerm, params.category, params.sortBy, params.tags]);

  return {
    products,
    loading,
    error,
    total
  };
};