/**
 * 商品列表相关的自定义Hook
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import {
  fetchProducts,
  fetchCategories,
  ProductRequestDto
} from '../slice';
import { ProductCategory, ProductSortOption } from '../types';

interface UseProductListProps {
  initialParams?: Partial<ProductRequestDto>;
}

interface UseProductListReturn {
  products: any[];
  categories: Array<{ id: string; name: string }> | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  selectedCategory: string;
  searchTerm: string;
  sortOption: ProductSortOption;
  onCategoryChange: (categoryId: string) => void;
  onSearch: (term: string) => void;
  onSortChange: (option: ProductSortOption) => void;
  onPageChange: (page: number) => void;
  refreshProducts: () => void;
}

export const useProductList = ({ initialParams = {} }: UseProductListProps = {}): UseProductListReturn => {
  const dispatch = useDispatch();
  const productState = useSelector((state: RootState) => state.product);
  
  const [selectedCategory, setSelectedCategory] = useState<string>(initialParams.categoryId || ProductCategory.ALL);
  const [searchTerm, setSearchTerm] = useState<string>(initialParams.searchTerm || '');
  const [sortOption, setSortOption] = useState<ProductSortOption>(initialParams.sortOption || ProductSortOption.DEFAULT);
  const [currentPage, setCurrentPage] = useState<number>(initialParams.page || 1);
  const [pageSize] = useState<number>(initialParams.pageSize || 10);

  // 获取商品列表
  const fetchProductList = () => {
    const params: ProductRequestDto = {
      categoryId: selectedCategory !== ProductCategory.ALL ? selectedCategory : undefined,
      searchTerm: searchTerm.trim() || undefined,
      sortOption,
      page: currentPage,
      pageSize
    };
    
    dispatch(fetchProducts(params));
  };

  // 获取商品分类
  const fetchCategoryList = () => {
    dispatch(fetchCategories());
  };

  // 监听筛选条件变化，重新获取商品列表
  useEffect(() => {
    fetchProductList();
  }, [selectedCategory, searchTerm, sortOption, currentPage, pageSize]);

  // 初始加载分类
  useEffect(() => {
    fetchCategoryList();
  }, []);

  // 处理分类变更
  const onCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理搜索
  const onSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理排序变更
  const onSortChange = (option: ProductSortOption) => {
    setSortOption(option);
    setCurrentPage(1); // 重置到第一页
  };

  // 处理分页变更
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 刷新商品列表
  const refreshProducts = () => {
    fetchProductList();
  };

  return {
    products: productState.products?.products || [],
    categories: productState.categories,
    loading: productState.loading,
    error: productState.error,
    currentPage: productState.products?.currentPage || 1,
    totalPages: productState.products?.totalPages || 1,
    selectedCategory,
    searchTerm,
    sortOption,
    onCategoryChange,
    onSearch,
    onSortChange,
    onPageChange,
    refreshProducts
  };
};