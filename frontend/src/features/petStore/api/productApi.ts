import axios from 'axios';
import type { ProductResponseDto } from '@/features/petStore/types';
import type { ProductCategory } from '@/features/petStore/types';
import type { ProductSortOption } from '@/features/petStore/types';

// 创建axios实例
const api = axios.create({
  baseURL: '/api/pet-store',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 这里可以添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，处理登录逻辑
          break;
        case 403:
          // 禁止访问
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器错误
          break;
        default:
          // 其他错误
          break;
      }
    }
    return Promise.reject(error);
  }
);

interface GetProductsApiParams {
  page: number;
  pageSize: number;
  searchTerm?: string;
  category?: ProductCategory;
  sortBy?: ProductSortOption;
}

interface GetProductsApiResponse {
  data: {
    items: ProductResponseDto[];
    total: number;
    page: number;
    pageSize: number;
  };
}

class ProductApi {
  // 获取商品列表
  async getProducts(params: GetProductsApiParams): Promise<GetProductsApiResponse> {
    try {
      const response = await api.get('/products', {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          searchTerm: params.searchTerm,
          category: params.category,
          sortBy: params.sortBy
        }
      });
      return response;
    } catch (error) {
      console.error('API Error: Failed to get products', error);
      throw error;
    }
  }

  // 获取商品详情
  async getProductDetail(id: string): Promise<{ data: ProductResponseDto }> {
    try {
      const response = await api.get(`/products/${id}`);
      return response;
    } catch (error) {
      console.error('API Error: Failed to get product detail', error);
      throw error;
    }
  }

  // 添加商品到购物车
  async addToCart(data: {
    productId: string;
    quantity: number;
  }): Promise<{ data: { success: boolean } }> {
    try {
      const response = await api.post('/cart/items', data);
      return response;
    } catch (error) {
      console.error('API Error: Failed to add to cart', error);
      throw error;
    }
  }

  // 创建订单
  async createOrder(data: {
    items: Array<{
      productId: string;
      quantity: number;
    }>;
  }): Promise<{ data: { orderId: string } }> {
    try {
      const response = await api.post('/orders', data);
      return response;
    } catch (error) {
      console.error('API Error: Failed to create order', error);
      throw error;
    }
  }

  // 获取购物车列表
  async getCart(): Promise<{ data: any }> {
    try {
      const response = await api.get('/cart');
      return response;
    } catch (error) {
      console.error('API Error: Failed to get cart', error);
      throw error;
    }
  }

  // 检查商品库存
  async checkStock(productId: string, quantity: number): Promise<{ data: { inStock: boolean } }> {
    try {
      const response = await api.get('/products/check-stock', {
        params: {
          productId,
          quantity
        }
      });
      return response;
    } catch (error) {
      console.error('API Error: Failed to check stock', error);
      throw error;
    }
  }
}

export const productApi = new ProductApi();