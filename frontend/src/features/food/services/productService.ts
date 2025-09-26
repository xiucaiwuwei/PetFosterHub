/**
 * 商品相关业务逻辑服务
 */

import * as productApi from '../api';
import { ProductRequestDto, ProductDetailDto, AddToCartRequestDto } from '../types';
import { validateProductId, validateQuantity, calculateDiscountedPrice } from '../utils/validationUtils';

/**
 * 获取商品列表并进行业务处理
 * @param params 筛选和分页参数
 * @returns 处理后的分页商品列表
 */
export const getProducts = async (params?: ProductRequestDto) => {
  try {
    // 可以在这里添加一些业务逻辑，例如参数验证、默认值设置等
    const validatedParams = { ...params };
    
    // 调用API获取数据
    const result = await productApi.fetchProducts(validatedParams);
    
    // 可以在这里对返回的数据进行进一步处理
    return result;
  } catch (error) {
    console.error('获取商品列表业务处理失败:', error);
    throw error;
  }
};

/**
 * 获取商品详情并进行业务处理
 * @param productId 商品ID
 * @returns 处理后的商品详情
 */
export const getProductDetail = async (productId: string): Promise<ProductDetailDto> => {
  try {
    // 验证商品ID
    const validation = validateProductId(productId);
    if (!validation.isValid) {
      throw new Error(validation.message);
    }
    
    // 调用API获取商品详情
    const productDetail = await productApi.fetchProductDetail(productId);
    
    // 可以在这里对商品详情进行额外的业务处理
    return productDetail;
  } catch (error) {
    console.error('获取商品详情业务处理失败:', error);
    throw error;
  }
};

/**
 * 获取商品分类列表
 * @returns 商品分类列表
 */
export const getProductCategories = async () => {
  try {
    const categories = await productApi.fetchCategories();
    return categories;
  } catch (error) {
    console.error('获取商品分类业务处理失败:', error);
    throw error;
  }
};

/**
 * 添加商品到购物车的业务处理
 * @param data 添加到购物车的请求数据
 * @returns 操作结果
 */
export const addToCart = async (data: AddToCartRequestDto) => {
  try {
    // 验证商品ID
    const productValidation = validateProductId(data.productId);
    if (!productValidation.isValid) {
      throw new Error(productValidation.message);
    }
    
    // 验证数量
    const quantityValidation = validateQuantity(data.quantity);
    if (!quantityValidation.isValid) {
      throw new Error(quantityValidation.message);
    }
    
    // 调用API添加到购物车
    const result = await productApi.addProductToCart(data);
    
    return result;
  } catch (error) {
    console.error('添加商品到购物车业务处理失败:', error);
    throw error;
  }
};

/**
 * 搜索商品的业务处理
 * @param searchTerm 搜索关键词
 * @param categoryId 分类ID
 * @returns 搜索结果
 */
export const searchProducts = async (searchTerm?: string, categoryId?: string) => {
  try {
    const params: ProductRequestDto = {};
    
    if (searchTerm && searchTerm.trim()) {
      params.searchTerm = searchTerm.trim();
    }
    
    if (categoryId && categoryId !== 'all') {
      params.categoryId = categoryId;
    }
    
    const result = await productApi.fetchProducts(params);
    return result;
  } catch (error) {
    console.error('搜索商品业务处理失败:', error);
    throw error;
  }
};

/**
 * 计算商品的最终价格（考虑折扣）
 * @param originalPrice 原价
 * @param discount 折扣率
 * @returns 最终价格
 */
export const getFinalPrice = (originalPrice: number, discount?: number): number => {
  if (!discount || discount <= 0) {
    return originalPrice;
  }
  return calculateDiscountedPrice(originalPrice, discount);
};